import { FastifyRequest, FastifyReply } from 'fastify';
import * as userService from '../../services/user.service';
import { sendSuccess } from '../../utils/response';

export async function deleteUser(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  await userService.deleteUser(req.params.id);
  sendSuccess(reply, undefined, { message: 'Амжилттай устгагдлаа' });
}
