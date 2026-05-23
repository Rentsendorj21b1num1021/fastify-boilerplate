import { FastifyRequest, FastifyReply } from 'fastify';
import * as userService from '../../services/user.service';
import { sendSuccess } from '../../utils/response';

export async function getUser(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const user = await userService.getUserById(req.params.id);
  sendSuccess(reply, user);
}
