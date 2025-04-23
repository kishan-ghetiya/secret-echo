import { useState } from 'react';
import API from '../services/api';
// import { saveAuth } from '../utils/AuthContext';
import { useRouter } from 'next/router';

export default function Signup() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await API.post('/auth/signup', form);
    // saveAuth(res.data.token, res.data.user);
    localStorage.setItem('token', res.data.token);
    router.push('/chat');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Signup</h1>
      <input placeholder="Username" onChange={e => setForm({ ...form, username: e.target.value })} />
      <input placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
      <input placeholder="Password" type="password" onChange={e => setForm({ ...form, password: e.target.value })} />
      <button type="submit">Create Account</button>
    </form>
  );
}
