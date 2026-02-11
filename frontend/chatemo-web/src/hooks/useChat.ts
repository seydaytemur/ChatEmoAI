import { useState, useEffect } from 'react'
import { getMessages, sendMessage } from '../lib/api'
import type { Message } from '../components/MessageItem'

export function useChat() {
        const [messages, setMessages] = useState<Message[]>([])
        const [loading, setLoading] = useState(false)

        useEffect(() => {
                let active = true
                const fetchData = async () => {
                        try {
                                const data = await getMessages()
                                if (active) setMessages(data)
                        } catch (err) {
                                console.error("Failed to fetch messages", err)
                        }
                }

                fetchData()
                const interval = setInterval(fetchData, 1500)

                return () => { active = false; clearInterval(interval) }
        }, [])

        const send = async (content: string, username: string) => {
                setLoading(true)
                try {
                        const effectiveUsername = username.trim() || 'guest'
                        const created = await sendMessage({ content, username: effectiveUsername })
                        setMessages(m => [...m, created])
                } catch (err) {
                        console.error("Failed to send message", err)
                } finally {
                        setLoading(false)
                }
        }

        return { messages, send, loading }
}
