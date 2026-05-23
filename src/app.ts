import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import { ZodError } from 'zod'

import { loggerConfig } from './utils/logger'
import mongodbPlugin from './plugins/mongodb'
import jwtPlugin from './plugins/jwt'
import redisPlugin from './plugins/redis'
import swaggerPlugin from './plugins/swagger'
import { authRoutes } from './routes/auth.route'
import { userRoutes } from './routes/user.route'
import { healthRoutes } from './routes/health.route'

export function buildApp() {
  const fastify = Fastify({
    logger: loggerConfig,
    genReqId: () => crypto.randomUUID(),
  })

  fastify.register(cors)
  fastify.register(helmet)
  fastify.register(rateLimit, { max: 100, timeWindow: '1 minute' })

  fastify.register(swaggerPlugin)
  fastify.register(mongodbPlugin)
  fastify.register(jwtPlugin)
  fastify.register(redisPlugin)

  fastify.register(healthRoutes)
  fastify.register(authRoutes, { prefix: '/api/v1/auth' })
  fastify.register(userRoutes, { prefix: '/api/v1/users' })

  fastify.setErrorHandler((error: any, req, reply) => {
    if (error instanceof ZodError) {
      return reply.code(400).send({
        success: false,
        message: 'Validation алдаа',
        errors: error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      })
    }

    req.log.error({ err: error }, error.message)
    const statusCode = error.statusCode || 500
    reply.code(statusCode).send({
      success: false,
      message: error.message || 'Серверийн алдаа',
    })
  })

  return fastify
}
