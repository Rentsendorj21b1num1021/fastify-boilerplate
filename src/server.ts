import { buildApp } from './app'
import { config } from './config'

const app = buildApp()

const start = async () => {
  await app.listen({ port: config.port, host: '0.0.0.0' })
}

const shutdown = async (signal: string) => {
  app.log.info(`${signal} хүлээн авлаа, сервер зогсож байна...`)
  await app.close()
  app.log.info('Сервер зогслоо')
  process.exit(0)
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))

start().catch((err) => {
  app.log.error(err)
  process.exit(1)
})
