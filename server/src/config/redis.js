import { createClient } from 'redis';
import env from './env.js';

let redisClient;
let isRedisMock = false;

class MockRedisClient {
  constructor() {
    this.store = new Map();
    this.isOpen = true;
  }
  async connect() {
    return this;
  }
  async get(key) {
    return this.store.get(key) || null;
  }
  async set(key, val, options) {
    this.store.set(key, val);
    if (options && options.EX) {
      setTimeout(() => {
        this.store.delete(key);
      }, options.EX * 1000);
    }
    return 'OK';
  }
  async del(key) {
    return this.store.delete(key) ? 1 : 0;
  }
  on(event, handler) {
    return this;
  }
  async quit() {
    this.isOpen = false;
    return 'OK';
  }
}

try {
  redisClient = createClient({
    url: env.REDIS_URL,
    socket: {
      // Return false to fail connection immediately if Redis is offline
      reconnectStrategy: false
    }
  });

  redisClient.on('error', (err) => {
    if (isRedisMock) return;
    console.warn('⚠️ Redis Connection Error. Falling back to Mock Redis.');
    isRedisMock = true;
    redisClient = new MockRedisClient();
  });
  
  await redisClient.connect().catch(() => {
    console.warn('⚠️ Could not connect to Redis. Falling back to Mock Redis.');
    isRedisMock = true;
    redisClient = new MockRedisClient();
  });
} catch (error) {
  console.warn('⚠️ Redis client creation failed. Falling back to Mock Redis.');
  isRedisMock = true;
  redisClient = new MockRedisClient();
}

export { redisClient, isRedisMock };
