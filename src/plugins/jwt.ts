import fp from 'fastify-plugin'
import fastifyJwt from '@fastify/jwt'
import { config } from '../config'

export default fp(async (fastify) => {
  fastify.register(fastifyJwt, {
    secret: config.jwt.secret,
  })
})
