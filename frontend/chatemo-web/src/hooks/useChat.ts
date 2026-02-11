import { useState, useEffect } from 'react'
import { getMessages, sendMessage } from '../lib/api'
import type { Message } from '../components/MessageItem'

export function useChat() {
        const [messages, setMessages] = useState<Message[]>([])
        const [loading, setLoading] = useState(false)
        const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
        const [username, setUsername] = useState<string | null>(localStorage.getItem('username'))

        useEffect(() => {
                if (token) localStorage.setItem('token', token)
                else localStorage.removeItem('token')
        }, [token])

        useEffect(() => {
                if (username) localStorage.setItem('username', username)
                else localStorage.removeItem('username')
        }, [username])

        const login = (user: string, authToken: string) => {
                setUsername(user)
                setToken(authToken)
        }

        const logout = () => {
                setToken(null)
                setUsername(null)
                setMessages([])
        }

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

        const send = async (content: string) => {
                if (!token || !username) return

                setLoading(true)
                try {
                        const created = await sendMessage({ content, username }, token)
                        setMessages(m => [...m, created])
                } catch (err) {
                        console.error("Failed to send message", err)
                        if (err instanceof Error && err.message.includes('401')) {
                                logout() // Auto logout on auth error
                        }
                } finally {
                        setLoading(false)
                }
        }

        return { messages, send, loading, token, username, login, logout }
}
