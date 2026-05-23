import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const envSchema = z.object({
  PORT: z.string().default('3000'),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI шаардлагатай'),
  JWT_SECRET: z.string().min(8, 'JWT_SECRET хамгийн багадаа 8 тэмдэгт байх ёстой'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  REFRESH_TOKEN_SECRET: z.string().min(8, 'REFRESH_TOKEN_SECRET хамгийн багадаа 8 тэмдэгт байх ёстой'),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('Environment variable алдаа:')
  parsed.error.errors.forEach((e) => {
    console.error(`  ${e.path.join('.')}: ${e.message}`)
  })
  process.exit(1)
}

const env = parsed.data

export const config = {
  port: Number(env.PORT),
  nodeEnv: env.NODE_ENV,
  mongoUri: env.MONGODB_URI,
  redisUrl: env.REDIS_URL,
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
  },
  refreshToken: {
    secret: env.REFRESH_TOKEN_SECRET,
    expiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
  },
}
