# AmkyawDev Coder AI 🧑‍💻

[AmkyawDev Coder AI](https://amkyaw-coder.vercel.app) - AI-Powered Coding Platform with Real-time Collaboration

<p align="center">
  <a href="https://amkyaw-coder.vercel.app">
    <img src="https://img.shields.io/badge/Live Demo-Visit-blue?style=for-the-badge" alt="Live Demo" />
  </a>
  <a href="https://github.com/amkyawdev/amkyaw-coder/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/amkyawdev/amkyaw-coder?style=for-the-badge" alt="License" />
  </a>
  <a href="https://vercel.com">
    <img src="https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel" alt="Vercel" />
  </a>
  <a href="https://www.mongodb.com">
    <img src="https://img.shields.io/badge/Database-MongoDB-green?style=for-the-badge&logo=mongodb" alt="MongoDB" />
  </a>
</p>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI Code Assistant** | Intelligent code suggestions powered by OpenHands AI |
| 💻 **Monaco Code Editor** | Full-featured code editor with syntax highlighting |
| 📁 **File Explorer** | Create, edit, and manage project files |
| 💬 **Real-time Chat** | Interactive AI chat for code assistance |
| 🔄 **GitHub Integration** | Connect with GitHub repositories |
| 🔐 **Authentication** | Secure user authentication with Firebase + JWT |
| 🚀 **Real-time Updates** | WebSocket for live collaboration |
| 📱 **Modern UI** | Beautiful responsive interface |

---

## 🛠️ Tech Stack

### Frontend
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat&logo=tailwindcss)
![Monaco Editor](https://img.shields.io/badge/Monaco-Editor-4.6-orange?style=flat)

### Backend
![Express.js](https://img.shields.io/badge/Express-4-gray?style=flat&logo=express)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?style=flat&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-7-green?style=flat&logo=mongodb)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4-red?style=flat)
![OpenHands](https://img.shields.io/badge/OpenHands-AI-orange?style=flat)

### DevOps
![Docker](https://img.shields.io/badge/Docker-2496ed?style=flat&logo=docker)
![Vercel](https://img.shields.io/badge/Vercel-black?style=flat&logo=vercel)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **Docker** & Docker Compose (optional)
- **MongoDB Atlas** account or local MongoDB
- **OpenHands API Key** from [app.all-hands.dev](https://app.all-hands.dev/settings/api-keys)
- **Firebase Project** from [console.firebase.google.com](https://console.firebase.google.com)

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/amkyawdev/amkyaw-coder.git
cd amkyaw-coder
```

#### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env
```

#### 3. Configure Environment Variables (.env)

```env
# OpenHands AI Configuration
OPENHANDS_API_KEY=your_openhands_api_key_here
OPENHANDS_API_URL=https://app.all-hands.dev

# MongoDB Configuration (MongoDB Atlas)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/amkyawcoder

# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters

# Backend Configuration
PORT=4000

# Frontend URLs
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_OPENHANDS_URL=https://app.all-hands.dev
FRONTEND_URL=http://localhost:3000
```

#### 4. Install Dependencies

```bash
# Install all dependencies
npm install

# Or install separately
cd frontend && npm install
cd ../backend && npm install
```

#### 5. Run Development Servers

```bash
# Start both frontend and backend
npm run dev

# Or start individually
# Terminal 1: Frontend
cd frontend && npm run dev

# Terminal 2: Backend
cd backend && npm run dev
```

### Docker Deployment

```bash
# Start all services with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## 📁 Project Structure

```
amkyaw-coder/
├── frontend/                    # Next.js 14 Frontend
│   ├── src/
│   │   ├── app/               # Next.js App Router
│   │   │   ├── auth/          # Authentication pages
│   │   │   ├── dashboard/    # User dashboard
│   │   │   └── workspace/    # Code editor workspace
│   │   ├── components/       # React components
│   │   ├── hooks/           # Custom React hooks
│   │   └── lib/             # Utilities & OpenHands client
│   ├── Dockerfile
│   ├── next.config.js
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── backend/                    # Express.js Backend
│   ├── src/
│   │   ├── config/           # Configuration
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Express middleware
│   │   ├── models/         # MongoDB/Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── websocket/     # WebSocket handlers
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── docker-compose.yml          # Docker Compose config
├── package.json              # Root package.json
├── .env.example             # Environment template
├── README.md                # This file
└── .gitignore
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|------------|------|
| POST | `/api/auth/register` | Register new user | ✗ |
| POST | `/api/auth/login` | Login user | ✗ |
| GET | `/api/auth/me` | Get current user | ✓ |
| PUT | `/api/auth/profile` | Update profile | ✓ |

### Projects
| Method | Endpoint | Description |
|--------|----------|------------|
| GET | `/api/projects` | List user projects |
| POST | `/api/projects` | Create new project |
| GET | `/api/projects/:id` | Get project details |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |

### Files
| Method | Endpoint | Description |
|--------|----------|------------|
| GET | `/api/files/project/:projectId` | List project files |
| POST | `/api/files` | Create new file |
| PUT | `/api/files/:id` | Update file |
| DELETE | `/api/files/:id` | Delete file |

### Sessions (OpenHands AI)
| Method | Endpoint | Description |
|--------|----------|------------|
| POST | `/api/sessions/start` | Start AI conversation |
| GET | `/api/sessions/:id/status` | Get session status |
| POST | `/api/sessions/:id/poll` | Poll for completion |

---

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENHANDS_API_KEY` | OpenHands API key | ✓ |
| `OPENHANDS_API_URL` | OpenHands API URL | ✓ |
| `MONGODB_URI` | MongoDB connection string | ✓ |
| `JWT_SECRET` | JWT signing secret | ✓ |
| `PORT` | Backend port (default: 4000) | ✗ |
| `FRONTEND_URL` | Frontend URL for CORS | ✗ |

---

## 📱 Pages

| Page | URL | Description |
|------|-----|-------------|
| Landing | `/` | Hero page with features |
| Login | `/auth/login` | User login |
| Signup | `/auth/signup` | New user registration |
| Dashboard | `/dashboard` | User projects list |
| Workspace | `/workspace/[id]` | Code editor with AI chat |

---

## 🤝 Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [OpenHands](https://github.com/All-Hands-AI/OpenHands) - AI Coding Assistant
- [Next.js](https://nextjs.org) - React Framework
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Code Editor
- [Firebase](https://firebase.google.com) - Authentication

---

## 📞 Support

- 📧 Email: support@amkyaw.dev
- 💬 Discord: [Join our community](https://discord.gg/amkyawdev)
- 🐛 Issues: [Report bugs](https://github.com/amkyawdev/amkyaw-coder/issues)

---

<p align="center">
  Made with ❤️ by <a href="https://amkyaw.dev">Aung Myo Kyaw</a>
</p>