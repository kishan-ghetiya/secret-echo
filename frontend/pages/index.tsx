import { useState } from 'react';
import { useRouter } from 'next/router';
import { login } from '../services/authService';
import { useAuth } from '../utils/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { token } = await login(form.email, form.password);
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setUser(decoded);
      router.push('/chat');
    } catch (err: any) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h1 className="login-title">Login</h1>

        <div className="input-group">
          <input
            className="input-field"
            placeholder="Email"
            onChange={e => setForm({ ...form, email: e.target.value })}
            value={form.email}
            required
          />
        </div>

        <div className="input-group">
          <input
            className="input-field"
            placeholder="Password"
            type="password"
            onChange={e => setForm({ ...form, password: e.target.value })}
            value={form.password}
            required
          />
        </div>

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {error && <p className="error-message">{error}</p>}

        <div className="signup-link">
          <p>Don't have an account? <a href="/signup" className="text-blue-500 hover:text-blue-700">Sign up here</a></p>
        </div>
      </form>
    </div>
  );
}
