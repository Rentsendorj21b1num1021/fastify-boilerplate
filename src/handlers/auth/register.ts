import { FastifyRequest, FastifyReply } from 'fastify';
import { registerSchema } from '../../schemas/auth.schema';
import * as authService from '../../services/auth.service';
import { sendSuccess } from '../../utils/response';

export async function register(req: FastifyRequest, reply: FastifyReply) {
  const data = registerSchema.parse(req.body);
  const user = await authService.register(data);
  sendSuccess(reply, user, { statusCode: 201, message: 'Бүртгэл амжилттай' });
}
