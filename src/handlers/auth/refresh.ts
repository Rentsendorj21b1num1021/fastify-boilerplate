import { FastifyRequest, FastifyReply } from 'fastify';
import { refreshSchema } from '../../schemas/auth.schema';
import * as authService from '../../services/auth.service';
import { sendSuccess } from '../../utils/response';

export async function refresh(req: FastifyRequest, reply: FastifyReply) {
  const { refreshToken } = refreshSchema.parse(req.body);
  const tokens = await authService.refresh(refreshToken);
  sendSuccess(reply, tokens);
}
