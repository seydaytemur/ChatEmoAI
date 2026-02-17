import { SentimentBadge } from './SentimentBadge'

export type Message = {
        id: number
        content: string
        timestamp: string
        sentiment?: string | null
        confidence?: number | null
        username: string
}

interface MessageItemProps {
        message: Message
        isMe: boolean
}

export function MessageItem({ message, isMe }: MessageItemProps) {
        return (
                <div className={`msg ${isMe ? 'me' : ''}`}>
                        <div className="meta">
                                <span className="sender">{message.username}</span>
                                <span className="time">
                                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                        </div>
                        <div className="text">{message.content}</div>
                        <SentimentBadge sentiment={message.sentiment} confidence={message.confidence} />
                </div>
        )
}
