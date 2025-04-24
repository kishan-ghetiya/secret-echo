import { useState } from 'react';
import API from '../services/api';
import { useRouter } from 'next/router';

export default function Signup() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [errors, setErrors] = useState({ username: '', email: '', password: '' });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    let formErrors = { username: '', email: '', password: '' };
    let hasError = false;

    if (!form.username) {
      formErrors.username = 'Username is required';
      hasError = true;
    }
    if (!form.email) {
      formErrors.email = 'Email is required';
      hasError = true;
    }
    if (!form.password) {
      formErrors.password = 'Password is required';
      hasError = true;
    }

    if (hasError) {
      setErrors(formErrors);
      return;
    }

    try {
      const res = await API.post('/auth/signup', form);
      localStorage.setItem('token', res.data.token);
      router.push('/');
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <h1 className="signup-title">Signup</h1>

        <div className="input-group">
          <input
            className="input-field"
            placeholder="Username"
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            value={form.username}
          />
          {errors.username && <div className="error-message">{errors.username}</div>}
        </div>

        <div className="input-group">
          <input
            className="input-field"
            placeholder="Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            value={form.email}
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>

        <div className="input-group">
          <input
            className="input-field"
            placeholder="Password"
            type="password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            value={form.password}
          />
          {errors.password && <div className="error-message">{errors.password}</div>}
        </div>

        <button type="submit" className="submit-button">
          Create Account
        </button>

        <div className="login-link">
          <p>Already have an account? <a href="/" className="text-blue-500 hover:text-blue-700">Login here</a></p>
        </div>
      </form>
    </div>
  );
}
