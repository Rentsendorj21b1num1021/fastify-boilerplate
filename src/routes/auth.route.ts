import { FastifyInstance } from 'fastify'
import { register } from '../handlers/auth/register'
import { login } from '../handlers/auth/login'
import { refresh } from '../handlers/auth/refresh'
import { logout } from '../handlers/auth/logout'
import { authenticate } from '../middlewares/auth'

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/register', register)
  fastify.post('/login', login)
  fastify.post('/refresh', refresh)
  fastify.post('/logout', { preHandler: authenticate }, logout)
}
