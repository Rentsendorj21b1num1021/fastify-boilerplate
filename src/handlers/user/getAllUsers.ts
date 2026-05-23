import { FastifyRequest, FastifyReply } from 'fastify';
import * as userService from '../../services/user.service';
import { sendSuccess } from '../../utils/response';

export async function getAllUsers(
  req: FastifyRequest<{ Querystring: { page?: string; limit?: string } }>,
  reply: FastifyReply
) {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const result = await userService.getAllUsers(page, limit);
  sendSuccess(reply, result);
}
