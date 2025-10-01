# Quick Start Guide

## Prerequisites
- Node.js 18+ and npm installed
- Anthropic API key (get one at https://console.anthropic.com/)

## Local Development Setup

### 1. Backend Setup (Terminal 1)
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Edit .env and add your Anthropic API key:
# ANTHROPIC_API_KEY=sk-ant-your-key-here
# PORT=3001

# Start the backend server
npm run dev
```

You should see:
```
🚀 Backend server running on port 3001
🔑 API Key configured: Yes
```

### 2. Frontend Setup (Terminal 2)
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Set up environment variables (optional - defaults work for local dev)
cp .env.example .env

# Start the frontend development server
npm run dev
```

You should see:
```
VITE v4.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

### 3. Access the Application
Open your browser to `http://localhost:5173`

## Quick Scripts (from project root)

```bash
# Install all dependencies (frontend + backend)
npm run install:all

# Run frontend (starts on http://localhost:5173)
npm run dev:frontend

# Run backend (starts on http://localhost:3001)
npm run dev:backend

# Build frontend for production
npm run build:frontend
```

## Git Flow Workflow

This project uses Git Flow branching model:

### Create a new feature
```bash
git flow feature start my-feature-name
# ... make changes ...
git add .
git commit -m "Description of changes"
git flow feature finish my-feature-name
```

### Create a hotfix
```bash
git flow hotfix start fix-critical-bug
# ... make changes ...
git add .
git commit -m "Fix critical bug"
git flow hotfix finish fix-critical-bug
```

### Create a release
```bash
git flow release start 1.1.0
# ... update version numbers ...
git flow release finish 1.1.0
```

## Troubleshooting

### Backend won't start
- Check that port 3001 is not in use: `lsof -i :3001`
- Verify your `.env` file exists in the `backend/` directory
- Ensure `ANTHROPIC_API_KEY` is set correctly

### Frontend can't connect to backend
- Verify backend is running on port 3001
- Check `frontend/.env` has correct `VITE_BACKEND_URL`
- Look for CORS errors in browser console

### API calls fail with 500 error
- Verify your Anthropic API key is valid
- Check backend console for error messages
- Ensure you have credits remaining on your Anthropic account

## Testing the Setup

1. Backend health check:
   ```bash
   curl http://localhost:3001/health
   ```
   Should return: `{"status":"ok","message":"AI Thinking Partner API is running"}`

2. Start a new thought in the frontend - it should automatically send an initial structured prompt

## Next Steps

- Read the main [README.md](./README.md) for full documentation
- Configure deployment settings for Render.com
- Export your data regularly using the export button
