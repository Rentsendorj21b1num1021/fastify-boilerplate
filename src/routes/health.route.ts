import { FastifyInstance } from 'fastify'
import mongoose from 'mongoose'

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/health', async (req, reply) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'

    reply.send({
      status: 'ok',
      db: dbStatus,
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    })
  })
}
