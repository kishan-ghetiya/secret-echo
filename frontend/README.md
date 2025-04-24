# README.md — SecretEcho Frontend

## ✨ Overview
This is the **frontend** for the SecretEcho AI Companion Chat App — a lightweight messaging UI built using **React (Next.js)** with real-time updates via **Socket.IO**.

---

## 🛠️ Tech Stack
- **Next.js + TypeScript**
- **Tailwind CSS**
- **Socket.IO Client**
- **JWT Auth + Axios**

---

## 🔐 Features
- Sign up / Login with JWT (stored in localStorage)
- Global auth state with `AuthContext`
- Real-time messaging using WebSockets (Socket.IO)
- Message history persistence
- AI bot replies with simulated typing delay
- Responsive UI

---

## ⚙️ Setup
```bash
cd frontend
npm install

# Add .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api

npm run dev
```
Runs locally on: `http://localhost:3000`

---

## 🧭 Pages
| Route     | Description                     |
|-----------|---------------------------------|
| `/`       | Login form                      |
| `/signup` | Signup form                     |
| `/chat`   | Protected chat window (real-time)|

---

## 🧠 Auth Logic
- JWT is stored in localStorage on login
- Decoded on startup via `jwt-decode`
- Auth context handles:
  - login/logout
  - user state
  - redirect if not logged in

---

## 🔄 Socket.IO Events
| Event            | Description                     |
|------------------|---------------------------------|
| `send_message`   | User sends a message            |
| `receive_message`| Broadcast from backend (user + AI)|

---

## 🧪 Services
```ts
import { login, signup, fetchMessages, sendMessage } from '../services/authService';
```

---

## 🧼 UI Components
- `Navbar` with logout + user info
- Chat bubbles (sender-based styling)
- Typing indicator from AI bot

---

## 🧳 Deployment (optional)
You can deploy the frontend separately on **Vercel**, **Netlify**, etc.
Make sure to set:
```env
NEXT_PUBLIC_API_URL=https://your-backend-host/api
```

---

## ✅ Final Notes
- Pair this with the [SecretEcho backend](../backend) repo
- Ensure both services run together locally or in Docker

Enjoy chatting with your AI companion 🤖💬
