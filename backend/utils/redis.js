import { Redis } from "@upstash/redis";

class RedisClient {
  constructor() {
    this.client = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }

  async isAlive() {
    try {
      await this.client.ping();
      return true;
    } catch {
      return false;
    }
  }

  async get(key) {
    return await this.client.get(key);
  }

  async set(key, value, duration) {
    // duration in seconds
    return await this.client.set(key, value, {
      ex: duration,
    });
  }

  async del(key) {
    return await this.client.del(key);
  }
}

const redisClient = new RedisClient();
export default redisClient;