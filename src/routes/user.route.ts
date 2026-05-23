import { FastifyInstance } from 'fastify'
import { getUser } from '../handlers/user/getUser'
import { getAllUsers } from '../handlers/user/getAllUsers'
import { updateUser } from '../handlers/user/updateUser'
import { deleteUser } from '../handlers/user/deleteUser'
import { authenticate } from '../middlewares/auth'

export async function userRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate)

  fastify.get('/', getAllUsers)
  fastify.get('/:id', getUser)
  fastify.put('/:id', updateUser)
  fastify.delete('/:id', deleteUser)
}
