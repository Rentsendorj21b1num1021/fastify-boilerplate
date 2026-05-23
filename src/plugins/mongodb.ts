import fp from 'fastify-plugin'
import mongoose from 'mongoose'
import { config } from '../config'

export default fp(async (fastify) => {
  await mongoose.connect(config.mongoUri)
  fastify.log.info('MongoDB connected')

  fastify.addHook('onClose', async () => {
    await mongoose.disconnect()
  })
})
