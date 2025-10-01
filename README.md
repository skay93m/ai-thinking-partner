# AI Thinking Partner for ADHDer

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://aithinkingpartner.syafiqkay.com)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Built with Claude](https://img.shields.io/badge/built%20with-Claude%20AI-orange)](https://claude.ai)

> A productivity tool for ADHD brains that helps break the pattern of starting-and-abandoning projects through AI-powered Socratic questioning.

**[Try it live](https://aithinkingpartner.syafiqkay.com)** | **[Read the story](#motivation)**

A productivity tool designed for ADHD brains that helps break the pattern of starting-and-abandoning projects through AI-powered Socratic questioning.

## Features
- **Brutally honest AI thinking partner** using Claude API
- **Project tracking** with Definition of Done
- **Pattern detection** (credential-chasing, novelty-seeking)
- **Daily check-ins** that notice when you're spreading thin
- **Facts database** for context about your patterns
- **No judgment** for parked projects
- **Flexible API key options**: Free tier or bring your own key

## API Key Options

### Free Tier
- **10 AI requests per hour** per user
- No API key required
- Perfect for trying out the app
- Rate limits reset every hour

### Unlimited Access (Recommended)
- **Bring your own Anthropic API key**
- Unlimited requests
- Cost: ~$0.01-0.03 per conversation
- Get your key at [console.anthropic.com](https://console.anthropic.com/)
- Your key is stored only in browser memory (secure)
- Key never saved to disk or localStorage

### How It Works
1. **New users** automatically use the free tier (10 requests/hour)
2. **Rate limit reached?** A modal appears suggesting you add your own API key
3. **Add your key** → Unlimited requests, stored securely in memory
4. **Key validation** → Keys are tested before being accepted
5. **Session-based** → Key expires when you close the browser tab

### For Developers
The backend supports both shared and user-provided API keys:
- Shared key has rate limiting per IP address
- Daily cost tracking prevents runaway costs
- User keys bypass all rate limits
- API key validation endpoint ensures keys work before accepting

## Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS (via CDN), Lucide React (icons)
- **Backend**: Node.js, Express, CORS, Dotenv
- **API**: Claude API (Sonnet 4)

## Project Structure
```
ai-thinking-partner/
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── App.jsx    # Main application component
│   │   └── main.jsx   # Entry point
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── .env           # Local development (not committed)
│   └── .env.example   # Template for environment variables
├── backend/           # Express API server
│   ├── server.js      # Main server file with Claude API proxy
│   ├── package.json
│   ├── .env           # Local development (not committed)
│   └── .env.example   # Template for API key
└── README.md
```

## Local Development

### Prerequisites
- Node.js 18+ and npm

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env and add your Anthropic API key
# ANTHROPIC_API_KEY=sk-ant-...
# PORT=3001

# Start backend server
npm run dev
```

The backend will run on `http://localhost:3001`

### Frontend Setup
```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# The default backend URL is already set to http://localhost:3001
# Edit .env if you need to change it

# Run development server
npm run dev
```

The frontend will run on `http://localhost:5173`

### Getting Your Anthropic API Key
1. Go to [https://console.anthropic.com/](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to `backend/.env`

## Deployment to Render.com

This project requires deploying both frontend and backend separately.

### Backend Deployment (Web Service)

1. Create a new **Web Service** on Render.com
2. Connect your GitHub repository
3. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add Environment Variables:
   - `ANTHROPIC_API_KEY`: Your Claude API key (from console.anthropic.com)
   - `PORT`: 3001 (or leave blank, Render will assign automatically)
5. Deploy!
6. Note your backend URL (e.g., `https://your-app.onrender.com`)

### Frontend Deployment (Static Site)

1. Create a new **Static Site** on Render.com
2. Connect your GitHub repository
3. Configure:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
4. Add Environment Variable:
   - `VITE_BACKEND_URL`: Your backend URL from step above (e.g., `https://your-backend.onrender.com`)
5. Deploy!

### Alternative: Manual Deployment with render.yaml

You can also use separate `render.yaml` files for automated deployment of both services.

### Important Notes
- The backend must be deployed first to get its URL
- Update `frontend/.env.production` with the backend URL before frontend deployment
- Backend will be on a free tier that spins down after inactivity (may have cold start delays)
- Make sure CORS origins in `backend/server.js` include your frontend URL

