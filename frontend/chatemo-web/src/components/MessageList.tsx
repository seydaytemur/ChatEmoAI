import { MessageItem, type Message } from './MessageItem'

interface MessageListProps {
        messages: Message[]
        currentUsername: string
}

export function MessageList({ messages, currentUsername }: MessageListProps) {
        // Sort messages by timestamp
        const sorted = [...messages].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

        return (
                <div className="chat">
                        {sorted.map(m => (
                                <MessageItem
                                        key={m.id}
                                        message={m}
                                        isMe={m.username === (currentUsername.trim() || 'guest')}
                                />
                        ))}
                </div>
        )
}
