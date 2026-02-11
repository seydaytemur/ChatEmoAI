import { useState } from 'react'
import './App.css'
import { useChat } from './hooks/useChat'
import { MessageList } from './components/MessageList'
import { ChatInput } from './components/ChatInput'

export default function App() {
  const [username, setUsername] = useState('')
  const { messages, send, loading } = useChat()

  return (
    <div className="container">
      <h1>ChatEmo</h1>

      <div className="controls">
        <input
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Rumuz yaz..."
        />
      </div>

      <MessageList messages={messages} currentUsername={username} />

      <ChatInput
        onSend={(content) => send(content, username)}
        loading={loading}
      />
    </div>
  )
}
