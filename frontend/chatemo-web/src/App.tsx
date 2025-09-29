import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { getMessages, sendMessage } from './lib/api'

type Message = {
  id: number
  content: string
  timestamp: string
  sentiment?: string | null
  confidence?: number | null
  username: string
}

function SentimentBadge({ sentiment, confidence }: { sentiment?: string | null; confidence?: number | null }) {
  const emoji = sentiment === 'pozitif' ? '😊' : sentiment === 'negatif' ? '😞' : '😐'
  const label = sentiment ? sentiment.toUpperCase() : 'ANALİZ BEKLENİYOR'
  const score = confidence != null ? ` %${(confidence * 100).toFixed(0)}` : ''
  return <span className="sentiment">{emoji} {label}{score}</span>
}

export default function App() {
  const [username, setUsername] = useState('')
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  const sorted = useMemo(() => [...messages].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()), [messages])

  useEffect(() => {
    let active = true
    ;(async () => {
      const data = await getMessages()
      if (active) setMessages(data)
    })()
    const interval = setInterval(async () => {
      const data = await getMessages()
      setMessages(data)
    }, 1500)
    return () => { active = false; clearInterval(interval) }
  }, [])

  const onSend = async () => {
    if (!input.trim()) return
    const effectiveUsername = username.trim() || 'guest'
    setLoading(true)
    try {
      const created = await sendMessage({ content: input, username: effectiveUsername })
      setMessages(m => [...m, created])
      setInput('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>ChatEmo</h1>
      <div className="controls">
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Rumuz yaz..." />
      </div>
      <div className="chat">
        {sorted.map(m => (
          <div key={m.id} className={`msg ${m.username === (username.trim() || 'guest') ? 'me' : 'other'}`}>
            <div className="meta">
              <b>{m.username}</b>
              <span>{new Date(m.timestamp).toLocaleTimeString()}</span>
            </div>
            <div className="text">{m.content}</div>
            <SentimentBadge sentiment={m.sentiment} confidence={m.confidence} />
          </div>
        ))}
      </div>
      <div className="composer">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Mesaj yaz..."
          onKeyDown={e => { if ((e as any).key === 'Enter') onSend() }}
        />
        <button disabled={loading} onClick={onSend}>{loading ? 'Gönderiliyor...' : 'Gönder'}</button>
      </div>
    </div>
  )
}
