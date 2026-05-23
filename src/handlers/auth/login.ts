import { FastifyRequest, FastifyReply } from 'fastify';
import { loginSchema } from '../../schemas/auth.schema';
import * as authService from '../../services/auth.service';
import { sendSuccess } from '../../utils/response';

export async function login(req: FastifyRequest, reply: FastifyReply) {
  const data = loginSchema.parse(req.body);
  const tokens = await authService.login(data);
  sendSuccess(reply, tokens, { message: 'Нэвтрэлт амжилттай' });
}
