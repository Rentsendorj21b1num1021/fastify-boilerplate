import { FastifyRequest, FastifyReply } from 'fastify';
import * as authService from '../../services/auth.service';
import { sendSuccess } from '../../utils/response';

export async function logout(req: FastifyRequest, reply: FastifyReply) {
  const user = req.user as { id: string };
  await authService.logout(user.id);
  sendSuccess(reply, undefined, { message: 'Гарлаа' });
}
