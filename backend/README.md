## 🔐 SecretEcho — Real-Time AI Companion Chat App (Backend)

SecretEcho is a lightweight messaging app mimicking an AI companion chat interface. Built with **Node.js, Express, MongoDB, and Socket.IO**, the backend supports JWT-based authentication, real-time messaging, and simulated AI replies.

---

## 📦 Tech Stack
- **Node.js + Express**
- **MongoDB (via Mongoose)**
- **Socket.IO** for real-time messaging
- **JWT** authentication
- **Docker + Docker Compose** for containerization

---

## 🚀 Features
### ✅ Core Functionality
- JWT-based user **signup & login**
- Send & fetch messages via REST API
- Simulated **AI companion replies**
- Real-time messaging with Socket.IO
- Modular structure with middleware, models, and routes

### 🌟 Bonus Features
- **Dockerized** backend + MongoDB
- AI reply delay to mimic real typing

---

## 📁 Folder Structure
```
src/
├── models/         # Mongoose models
├── routes/         # Auth & messaging routes
├── middleware/     # Error & auth middleware
├── index.ts        # App entry point
```

---

## 🧪 How to Run Locally (No Docker)
```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start dev server
npm run dev
```

### Required .env values
```
MONGO_URI=mongodb://localhost:27017/secretecho
JWT_SECRET=your_jwt_secret_here
```

---

## 🐳 Docker Setup
```bash
# Build and run using Docker Compose
docker-compose up --build
```

Accessible at `http://localhost:5000`

---

## 💬 API Endpoints
### 🔐 Auth
- `POST /api/auth/signup` – Register a user
- `POST /api/auth/login` – Authenticate & get JWT

### 💬 Messages
- `GET /api/messages` – Fetch all messages (auth required)
- `POST /api/messages` – Send a message (auth required)

---

## 🔄 Real-Time Events (Socket.IO)
| Event            | Payload Format             | Description                     |
|------------------|----------------------------|---------------------------------|
| `send_message`   | `{ sender, message }`      | Client sends a message          |
| `receive_message`| `{ sender, message }`      | Server (or AI) broadcasts it    |

---

## 📌 Notes
- The AI responses are random messages selected from a preset list.
- This backend is prepared for deployment or integration with a React/Next.js frontend.

---

## Author
Kishan Ghetiya - [GitHub](https://github.com/KishanGhetiya)
