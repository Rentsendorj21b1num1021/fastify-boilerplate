import { config } from '../config'

export const loggerConfig = {
  level: config.nodeEnv === 'production' ? 'info' : 'debug',
  ...(config.nodeEnv === 'development' && {
    transport: {
      target: 'pino-pretty',
      options: { colorize: true, translateTime: 'HH:MM:ss', ignore: 'pid,hostname' },
    },
  }),
}
