import { FastifyInstance } from "fastify";
import { fetchWebhooks } from "./fetch-webhooks.js";
import { getWebhook } from "./get-webhook.js";
import { deleteWebhook } from "./delete-webhook.js";
import { captureWebhook } from "./capture-webhook.js";

export async function appRoutes(app: FastifyInstance) {
  app.register(fetchWebhooks);
  app.register(getWebhook);
  app.register(deleteWebhook);
  app.register(captureWebhook);
}
