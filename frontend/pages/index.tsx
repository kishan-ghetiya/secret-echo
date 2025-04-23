import { useState } from 'react';
import API from '../services/api';
// import { saveAuth } from '../utils/AuthContext';
import { useRouter } from 'next/router';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await API.post('/auth/login', form);
    // saveAuth(res.data.token, res.data.user);
    localStorage.setItem('token', res.data.token);
    router.push('/chat');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Login</h1>
      <input placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
      <input placeholder="Password" type="password" onChange={e => setForm({ ...form, password: e.target.value })} />
      <button type="submit">Login</button>
    </form>
  );
}
