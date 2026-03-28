# AmkyawDev Coder AI

AI-powered coding platform with OpenHands integration.

## Features

- 🤖 **AI Code Assistant** - Intelligent code suggestions powered by OpenHands
- 💻 **Code Editor** - Monaco Editor with file tree and terminal
- 💬 **Real-time Chat** - Interact with AI coding assistant
- 🔄 **GitHub Integration** - Connect with GitHub repositories
- 🚀 **Docker Support** - Easy deployment with Docker Compose

## Tech Stack

- **Frontend**: Next.js 14+, React, Monaco Editor, Tailwind CSS
- **Backend**: Express.js, TypeScript, WebSocket
- **Database**: PostgreSQL with Prisma
- **AI**: OpenHands Cloud API

## Getting Started

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- OpenHands API Key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/amkyawdev/amkyaw-coder.git
cd amkyaw-coder
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Add your OpenHands API key to `.env`:
```
OPENHANDS_API_KEY=your_api_key_here
```

### Development

Using Docker:
```bash
docker-compose up -d
```

Manual setup:
```bash
# Install dependencies
npm install
cd frontend && npm install
cd ../backend && npm install

# Start development servers
npm run dev
```

### Access

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

## Project Structure

```
amkyaw-coder/
├── frontend/          # Next.js frontend
├── backend/           # Express.js backend
├── services/         # Microservices
├── infrastructure/   # K8s/Terraform configs
├── scripts/          # Automation scripts
└── docs/             # Documentation
```

## License

MIT