import { db } from '@/db'
import { webhooks } from '@/db/schema'

function generateStripeSignature(faker: any): string {
  const ts = Math.floor(Date.now() / 1000)
  const v1 = faker.string.hexadecimal({ length: 64, casing: 'lower' }).slice(2)
  const v0 = faker.string.hexadecimal({ length: 64, casing: 'lower' }).slice(2)
  return `t=${ts},v1=${v1},v0=${v0}`
}

function pickStripeEventType(faker: any): string {
  const types = [
    'payment_intent.succeeded',
    'payment_intent.payment_failed',
    'charge.succeeded',
    'charge.failed',
    'charge.refunded',
    'invoice.paid',
    'invoice.payment_failed',
    'invoice.finalized',
    'invoice.upcoming',
    'customer.created',
    'customer.updated',
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted',
    'checkout.session.completed',
    'checkout.session.async_payment_succeeded',
    'checkout.session.async_payment_failed',
    'payout.paid',
    'payout.failed',
    'refund.created',
  ]
  return faker.helpers.arrayElement(types)
}

function buildStripePayload(eventType: string, faker: any) {
  const created = Math.floor(Date.now() / 1000)
  const id = `evt_${faker.string.alphanumeric({ length: 24, casing: 'lower' })}`
  const objectId = `pi_${faker.string.alphanumeric({ length: 24, casing: 'lower' })}`

  const base = {
    id,
    type: eventType,
    api_version: '2024-06-20',
    created,
    livemode: false,
    pending_webhooks: 1,
    request: { id: `req_${faker.string.alphanumeric({ length: 24, casing: 'lower' })}`, idempotency_key: null },
    data: {
      object: {
        id: objectId,
        object: 'payment_intent',
        amount: faker.number.int({ min: 500, max: 20000 }),
        currency: faker.helpers.arrayElement(['usd', 'eur', 'gbp', 'brl']),
        status: faker.helpers.arrayElement(['succeeded', 'requires_payment_method', 'processing', 'canceled']),
        customer: `cus_${faker.string.alphanumeric({ length: 14, casing: 'lower' })}`,
        metadata: { order_id: faker.string.alphanumeric(10) },
      },
    },
  }

  return base
}

async function main() {
  const { faker } = await import('@faker-js/faker')
  const total = 60

  // Optional: clear existing rows for a clean seed
  await db.delete(webhooks)

  const rows = Array.from({ length: total }, () => {
    const eventType = pickStripeEventType(faker)
    const payload = buildStripePayload(eventType, faker)
    const body = JSON.stringify(payload, null, 2)

    const pathname = faker.helpers.arrayElement([
      '/webhooks/stripe',
      '/stripe/webhook',
      '/api/stripe/webhook',
    ])

    const ip = faker.internet.ip()
    const method = 'POST' as const
    const contentType = 'application/json'
    const contentLength = Buffer.byteLength(body, 'utf8')

    const headers: Record<string, string> = {
      'user-agent': 'Stripe/1.0 (+https://stripe.com/docs/webhooks)',
      'content-type': contentType,
      'stripe-signature': generateStripeSignature(faker),
      'accept': '*/*',
      'host': faker.internet.domainName(),
      'connection': 'close',
    }

    return {
      method,
      pathname,
      ip,
      statusCode: faker.helpers.arrayElement([200, 200, 200, 200, 400, 500]),
      contentType,
      contentLength,
      queryParams: {},
      headers,
      body,
    }
  })

  await db.insert(webhooks).values(rows)

  console.log(`Seeded ${rows.length} webhook records.`)
}

main().then(() => process.exit(0)).catch((err) => {
  console.error(err)
  process.exit(1)
})
