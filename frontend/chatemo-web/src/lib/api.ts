const API_BASE = (import.meta as any).env.VITE_API_URL || 'http://localhost:5128'

export type CreateMessage = { content: string; username: string }

export async function getMessages() {
  const res = await fetch(`${API_BASE}/api/messages`)
  if (!res.ok) throw new Error('Failed to load messages')
  return (await res.json()) as any[]
}

export async function sendMessage(body: CreateMessage) {
  const res = await fetch(`${API_BASE}/api/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  if (!res.ok) throw new Error('Failed to send message')
  return await res.json()
}


