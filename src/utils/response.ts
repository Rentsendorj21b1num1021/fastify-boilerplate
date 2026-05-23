import { FastifyReply } from 'fastify';

interface SuccessOptions {
  statusCode?: number;
  message?: string;
}

export function sendSuccess<T>(reply: FastifyReply, data?: T, options: SuccessOptions = {}) {
  const { statusCode = 200, message } = options;
  return reply.code(statusCode).send({
    success: true,
    ...(message && { message }),
    ...(data !== undefined && data !== null && { data }),
  });
}
