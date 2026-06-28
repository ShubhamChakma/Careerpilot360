import { redisClient, isRedisMock } from '../config/redis.js';

class JobQueue {
  constructor() {
    this.memoryQueue = [];
    this.listeners = [];
    this.isProcessing = false;
  }

  /**
   * Adds a new compiler task job to the queue.
   * @param {object} jobData - Contains code, language, and test cases
   * @returns {Promise<string>} jobId
   */
  async addJob(jobData) {
    const jobId = Math.random().toString(36).substring(2, 11);
    const job = {
      id: jobId,
      data: jobData,
      status: 'queued',
      result: null,
      error: null,
      createdAt: new Date()
    };

    if (!isRedisMock) {
      try {
        // Save job JSON to Redis hash with 10-minute expiry
        await redisClient.set(`job:${jobId}`, JSON.stringify(job), { EX: 600 });
        // Push ID to compile queue
        await redisClient.rPush('compile_jobs_queue', jobId);
      } catch (err) {
        console.warn('⚠️ Redis write failed in queue, fallback to memory:', err.message);
        this.memoryQueue.push(job);
      }
    } else {
      this.memoryQueue.push(job);
    }

    // Call process loop asynchronously
    this._processNext();

    return jobId;
  }

  /**
   * Returns a job by its ID.
   * @param {string} jobId 
   * @returns {Promise<object|null>}
   */
  async getJob(jobId) {
    if (!isRedisMock) {
      try {
        const val = await redisClient.get(`job:${jobId}`);
        if (val) return JSON.parse(val);
      } catch (err) {
        console.warn('⚠️ Redis get job failed:', err.message);
      }
    }
    
    const job = this.memoryQueue.find(j => j.id === jobId);
    return job || null;
  }

  /**
   * Updates job fields.
   * @param {string} jobId 
   * @param {object} updates 
   */
  async updateJob(jobId, updates) {
    if (!isRedisMock) {
      try {
        const val = await redisClient.get(`job:${jobId}`);
        if (val) {
          const job = JSON.parse(val);
          const updated = { ...job, ...updates };
          await redisClient.set(`job:${jobId}`, JSON.stringify(updated), { EX: 600 });
          return;
        }
      } catch (err) {
        console.warn('⚠️ Redis update job failed:', err.message);
      }
    }

    const idx = this.memoryQueue.findIndex(j => j.id === jobId);
    if (idx !== -1) {
      this.memoryQueue[idx] = { ...this.memoryQueue[idx], ...updates };
    }
  }

  /**
   * Registers a worker task handler function.
   * @param {Function} workerFn 
   */
  process(workerFn) {
    this.listeners.push(workerFn);
    this._processNext();
  }

  async _processNext() {
    if (this.isProcessing || this.listeners.length === 0) return;
    this.isProcessing = true;

    try {
      let jobId = null;
      let job = null;

      if (!isRedisMock) {
        try {
          jobId = await redisClient.lPop('compile_jobs_queue');
          if (jobId) {
            const val = await redisClient.get(`job:${jobId}`);
            if (val) job = JSON.parse(val);
          }
        } catch (err) {
          console.warn('⚠️ Redis lPop failed:', err.message);
        }
      }

      if (!jobId && this.memoryQueue.length > 0) {
        const firstQueued = this.memoryQueue.find(j => j.status === 'queued');
        if (firstQueued) {
          jobId = firstQueued.id;
          job = firstQueued;
        }
      }

      if (jobId && job) {
        await this.updateJob(jobId, { status: 'processing' });
        
        try {
          const result = await this.listeners[0](job.data);
          await this.updateJob(jobId, { 
            status: 'completed', 
            result, 
            completedAt: new Date() 
          });
        } catch (err) {
          await this.updateJob(jobId, { 
            status: 'failed', 
            error: err.message, 
            completedAt: new Date() 
          });
        }
      }
    } catch (err) {
      console.error('❌ Processing loop error:', err.message);
    } finally {
      this.isProcessing = false;
      
      let hasMore = false;
      if (!isRedisMock) {
        try {
          const len = await redisClient.lLen('compile_jobs_queue');
          hasMore = len > 0;
        } catch (err) {
          hasMore = this.memoryQueue.some(j => j.status === 'queued');
        }
      } else {
        hasMore = this.memoryQueue.some(j => j.status === 'queued');
      }

      if (hasMore) {
        setTimeout(() => this._processNext(), 100);
      }
    }
  }
}

export const compileQueue = new JobQueue();
