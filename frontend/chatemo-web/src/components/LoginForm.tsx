import { useState } from 'react'
import { API_BASE } from '../lib/api'

interface LoginFormProps {
        onLogin: (username: string, token: string) => void
}

export function LoginForm({ onLogin }: LoginFormProps) {
        const [isRegister, setIsRegister] = useState(false)
        const [username, setUsername] = useState('')
        const [password, setPassword] = useState('')
        const [error, setError] = useState('')
        const [loading, setLoading] = useState(false)

        const handleSubmit = async (e: React.FormEvent) => {
                e.preventDefault()
                setError('')
                setLoading(true)

                const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login'

                try {
                        const response = await fetch(`${API_BASE}${endpoint}`, {
                                method: 'POST',
                                headers: {
                                        'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ username, password }),
                        })

                        const data = await response.json()

                        if (!response.ok) {
                                throw new Error(data || 'Bir hata oluştu')
                        }

                        onLogin(data.username, data.token)
                } catch (err: any) {
                        setError(err.message)
                } finally {
                        setLoading(false)
                }
        }

        return (
                <div className="login-container">
                        <div className="login-box">
                                <h2>{isRegister ? 'Kayıt Ol' : 'Giriş Yap'}</h2>
                                {error && <div className="error-message">{error}</div>}
                                <form onSubmit={handleSubmit}>
                                        <div className="form-group">
                                                <label>Kullanıcı Adı</label>
                                                <input
                                                        type="text"
                                                        value={username}
                                                        onChange={(e) => setUsername(e.target.value)}
                                                        required
                                                        minLength={3}
                                                        placeholder="Örn: kullanici123"
                                                />
                                        </div>
                                        <div className="form-group">
                                                <label>Şifre</label>
                                                <input
                                                        type="password"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        required
                                                        minLength={6}
                                                        placeholder="******"
                                                />
                                        </div>
                                        <button type="submit" disabled={loading}>
                                                {loading ? 'İşleniyor...' : (isRegister ? 'Kayıt Ol' : 'Giriş Yap')}
                                        </button>
                                </form>
                                <p className="toggle-auth">
                                        {isRegister ? 'Zaten hesabın var mı?' : 'Hesabın yok mu?'}
                                        <button onClick={() => setIsRegister(!isRegister)}>
                                                {isRegister ? 'Giriş Yap' : 'Kayıt Ol'}
                                        </button>
                                </p>
                        </div>
                </div>
        )
}
