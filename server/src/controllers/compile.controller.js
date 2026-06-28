import { compileQueue } from '../services/queue.service.js';

/**
 * Submits a new compilation job to the task queue.
 * POST /api/compile
 */
export async function submitCode(req, res, next) {
  try {
    const { code, language, testCases } = req.body;

    if (!code) {
      return res.status(400).json({ 
        success: false, 
        error: { message: 'Code snippet is required for compilation.' } 
      });
    }

    if (!language) {
      return res.status(400).json({ 
        success: false, 
        error: { message: 'Language selection (e.g. javascript, python) is required.' } 
      });
    }

    // Default to at least one empty testcase if none are provided
    const cases = testCases && Array.isArray(testCases) ? testCases : [{ id: 'default', input: '', expectedOutput: '' }];

    const jobId = await compileQueue.addJob({ 
      code, 
      language, 
      testCases: cases 
    });

    res.status(202).json({
      success: true,
      data: {
        jobId,
        status: 'queued'
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Polls the job status and gets the execution result.
 * GET /api/compile/:jobId
 */
export async function getJobStatus(req, res, next) {
  try {
    const { jobId } = req.params;
    const job = await compileQueue.getJob(jobId);

    if (!job) {
      return res.status(404).json({ 
        success: false, 
        error: { message: 'Compilation job not found.' } 
      });
    }

    res.json({
      success: true,
      data: {
        id: job.id,
        status: job.status,
        result: job.result,
        error: job.error,
        createdAt: job.createdAt,
        completedAt: job.completedAt
      }
    });
  } catch (error) {
    next(error);
  }
}
