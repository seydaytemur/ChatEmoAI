export const API_BASE = (import.meta as any).env.VITE_API_URL || 'http://localhost:5235'

export type CreateMessage = { content: string; username: string }

export async function getMessages() {
  const res = await fetch(`${API_BASE}/api/messages`)
  if (!res.ok) throw new Error('Failed to load messages')
  return (await res.json()) as any[]
}

export async function sendMessage(body: CreateMessage, token?: string) {
  const headers: HeadersInit = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_BASE}/api/messages`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  })
  if (!res.ok) throw new Error('Failed to send message')
  return await res.json()
}


