import { useState } from 'react'

interface ChatInputProps {
        onSend: (message: string) => void
        loading: boolean
}

export function ChatInput({ onSend, loading }: ChatInputProps) {
        const [input, setInput] = useState('')

        const handleSend = () => {
                if (!input.trim()) return
                onSend(input)
                setInput('')
        }

        return (
                <div className="composer">
                        <input
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder="Mesaj yaz..."
                                onKeyDown={e => { if (e.key === 'Enter') handleSend() }}
                                disabled={loading}
                        />
                        <button disabled={loading} onClick={handleSend}>
                                {loading ? 'Gönderiliyor...' : 'Gönder'}
                        </button>
                </div>
        )
}
