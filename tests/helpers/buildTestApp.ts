import Fastify from 'fastify';
import cors from '@fastify/cors';
import { ZodError } from 'zod';
import { authRoutes } from '../../src/routes/auth.route';
import { userRoutes } from '../../src/routes/user.route';
import { healthRoutes } from '../../src/routes/health.route';
import fastifyJwt from '@fastify/jwt';

// Test app — DB, Redis холболтгүй хөнгөн instance
export function buildTestApp() {
  const app = Fastify({ logger: false });

  app.register(cors);
  app.register(fastifyJwt, { secret: 'test_secret' });

  app.register(healthRoutes);
  app.register(authRoutes, { prefix: '/api/v1/auth' });
  app.register(userRoutes, { prefix: '/api/v1/users' });

  app.setErrorHandler((error: any, req, reply) => {
    if (error instanceof ZodError) {
      return reply.code(400).send({
        success: false,
        message: 'Validation алдаа',
        errors: error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
    }
    reply.code(error.statusCode || 500).send({
      success: false,
      message: error.message || 'Серверийн алдаа',
    });
  });

  return app;
}
