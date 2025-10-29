import { FastifyInstance } from 'fastify'
import { fetchWebhooks } from './fetch-webhooks.js'

export async function appRoutes(app: FastifyInstance) {
  app.register(fetchWebhooks)
}
