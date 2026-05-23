import { FastifyInstance } from 'fastify'

export function createCache(fastify: FastifyInstance) {
  return {
    async get<T>(key: string): Promise<T | null> {
      const val = await fastify.redis.get(key)
      return val ? JSON.parse(val) : null
    },

    async set(key: string, value: unknown, ttlSeconds = 300): Promise<void> {
      await fastify.redis.setEx(key, ttlSeconds, JSON.stringify(value))
    },

    async del(key: string): Promise<void> {
      await fastify.redis.del(key)
    },
  }
}
