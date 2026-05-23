import fp from 'fastify-plugin'
import { createClient, RedisClientType } from 'redis'
import { config } from '../config'

declare module 'fastify' {
  interface FastifyInstance {
    redis: RedisClientType
  }
}

export default fp(async (fastify) => {
  const client = createClient({ url: config.redisUrl }) as RedisClientType

  client.on('error', (err) => fastify.log.error({ err }, 'Redis алдаа'))

  await client.connect()
  fastify.log.info('Redis connected')

  fastify.decorate('redis', client)

  fastify.addHook('onClose', async () => {
    await client.disconnect()
  })
})
