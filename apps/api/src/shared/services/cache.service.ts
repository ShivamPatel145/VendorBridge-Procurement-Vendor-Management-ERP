import Redis from 'ioredis';
import { env } from '../../config/env';

class CacheService {
  private redis: Redis | null = null;
  private useUpstashRest = false;
  private upstashUrl = '';
  private upstashToken = '';

  constructor() {
    if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
      this.useUpstashRest = true;
      this.upstashUrl = env.UPSTASH_REDIS_REST_URL.replace(/\/$/, '');
      this.upstashToken = env.UPSTASH_REDIS_REST_TOKEN;
      console.log('📶 Cache: Using Upstash Redis REST Client');
    } else {
      try {
        this.redis = new Redis({
          host: 'localhost',
          port: 6379,
          maxRetriesPerRequest: 1,
        });
        this.redis.on('error', (err) => {
          // Fail silently in logs unless it blocks operation
        });
        console.log('📶 Cache: Using local standard Redis client via ioredis');
      } catch (err) {
        console.error('❌ Failed to initialize local Redis:', err);
      }
    }
  }

  async get(key: string): Promise<string | null> {
    if (this.useUpstashRest) {
      try {
        const response = await fetch(`${this.upstashUrl}/get/${key}`, {
          headers: { Authorization: `Bearer ${this.upstashToken}` },
        });
        if (!response.ok) return null;
        const data = (await response.json()) as { result: string | null };
        return data.result;
      } catch (err) {
        console.error('Upstash Cache GET error:', err);
        return null;
      }
    }

    if (this.redis) {
      try {
        return await this.redis.get(key);
      } catch (err) {
        console.error('Local Cache GET error:', err);
        return null;
      }
    }
    return null;
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (this.useUpstashRest) {
      try {
        const url = ttlSeconds
          ? `${this.upstashUrl}/set/${key}/${encodeURIComponent(value)}/EX/${ttlSeconds}`
          : `${this.upstashUrl}/set/${key}/${encodeURIComponent(value)}`;
        await fetch(url, {
          headers: { Authorization: `Bearer ${this.upstashToken}` },
        });
      } catch (err) {
        console.error('Upstash Cache SET error:', err);
      }
      return;
    }

    if (this.redis) {
      try {
        if (ttlSeconds) {
          await this.redis.set(key, value, 'EX', ttlSeconds);
        } else {
          await this.redis.set(key, value);
        }
      } catch (err) {
        console.error('Local Cache SET error:', err);
      }
    }
  }

  async del(key: string): Promise<void> {
    if (this.useUpstashRest) {
      try {
        await fetch(`${this.upstashUrl}/del/${key}`, {
          headers: { Authorization: `Bearer ${this.upstashToken}` },
        });
      } catch (err) {
        console.error('Upstash Cache DEL error:', err);
      }
      return;
    }

    if (this.redis) {
      try {
        await this.redis.del(key);
      } catch (err) {
        console.error('Local Cache DEL error:', err);
      }
    }
  }
}

export const cacheService = new CacheService();
export default cacheService;
