import './App.css'
import { useChat } from './hooks/useChat'
import { MessageList } from './components/MessageList'
import { ChatInput } from './components/ChatInput'
import { LoginForm } from './components/LoginForm'

export default function App() {
  const { messages, send, loading, token, username, login, logout } = useChat()

  if (!token) {
    return <LoginForm onLogin={login} />
  }

  return (
    <div className="container">
      <div className="header">
        <h1>ChatEmo</h1>
        <div className="user-info">
          <span>@{username}</span>
          <button onClick={logout} className="logout-btn">Çıkış</button>
        </div>
      </div>

      <MessageList messages={messages} currentUsername={username || ''} />

      <ChatInput
        onSend={(content) => send(content)}
        loading={loading}
      />
    </div>
  )
}
