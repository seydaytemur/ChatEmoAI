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
                <div className={`msg ${isMe ? 'me' : 'other'}`}>
                        <div className="meta">
                                <b>{message.username}</b>
                                <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <div className="text">{message.content}</div>
                        <SentimentBadge sentiment={message.sentiment} confidence={message.confidence} />
                </div>
        )
}
