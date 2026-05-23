import { FastifyRequest, FastifyReply } from 'fastify';
import { updateUserSchema } from '../../schemas/user.schema';
import * as userService from '../../services/user.service';
import { sendSuccess } from '../../utils/response';

export async function updateUser(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const data = updateUserSchema.parse(req.body);
  const user = await userService.updateUser(req.params.id, data);
  sendSuccess(reply, user, { message: 'Амжилттай шинэчлэгдлээ' });
}
