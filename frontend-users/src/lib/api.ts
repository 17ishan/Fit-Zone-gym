// frontend/src/lib/api.ts
const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

export type CreateMembershipPayload = {
  userId: number
  planName: string
  priceCents: number
  startDate: string // ISO date
  endDate: string   // ISO date
}

export async function createMembership(payload: CreateMembershipPayload) {
  const res = await fetch(`${API_BASE}/api/v1/memberships`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(err?.error || err?.message || 'Failed to create membership')
  }
  return res.json()
}

/**
 * Record a payment in your DB. In a real app this is called by your payment webhook *after*
 * provider returns success. For local dev we call it manually to simulate success.
 */
export async function recordPayment(data: {
  userId?: number
  membershipId?: number
  amountCents: number
  method?: string
  providerPaymentId?: string
  status: 'pending' | 'succeeded' | 'failed'
  metadata?: Record<string, any>
}) {
  const body = { ...data, metadata: data.metadata ? JSON.stringify(data.metadata) : undefined }
  const res = await fetch(`${API_BASE}/api/v1/payments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(err?.error || err?.message || 'Failed to record payment')
  }
  return res.json()
}
