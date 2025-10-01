# AI Thinking Partner for ADHDer - UI Mockup

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Built with Claude](https://img.shields.io/badge/built%20with-Claude%20AI-orange)](https://claude.ai)

> A productivity tool concept for ADHD brains that helps break the pattern of starting-and-abandoning projects through AI-powered Socratic questioning.

**[View UI Mockup](#getting-started)** | **[Read the story](#motivation)**

## ⚠️ Project Status: UI Mockup Only

**This project has been scaled back to a design/UI demonstration.** 

While building this, I recognized I was repeating my own pattern: starting a new project without finishing ones already in progress. So I'm sticking with claude.ai chat as my thinking partner and keeping this as a UI mockup to demonstrate the concept.

Sometimes the most valuable outcome is recognizing the pattern before you're too deep in it.

## The Concept

A productivity tool designed for ADHD brains that helps break the pattern of starting-and-abandoning projects through AI-powered Socratic questioning.

## Features (Mockup Demonstration)
- **Brutally honest AI thinking partner** (simulated responses)
- **Project tracking** with Definition of Done
- **Pattern detection** (credential-chasing, novelty-seeking)
- **Daily check-ins** that notice when you're spreading thin
- **Facts database** for context about your patterns
- **No judgment** for parked projects

## Getting Started

### Running Locally

This is a frontend-only mockup. To run locally:

```bash
cd frontend
npm install
npm run dev
```

### Deploying to Render

This repository is configured for easy deployment to Render as a static site:

1. **Fork or clone this repository** to your GitHub account
2. **Connect to Render**:
   - Go to [render.com](https://render.com) and sign up/login
   - Click "New" → "Static Site"
   - Connect your GitHub repository
3. **Deploy automatically**: 
   - Render will detect the `render.yaml` configuration
   - Build command: `cd frontend && npm install && npm run build`
   - Publish directory: `frontend/dist`
   - The site will deploy automatically

### Manual Static Site Setup

If you prefer manual configuration:
- **Build Command**: `cd frontend && npm install && npm run build`
- **Publish Directory**: `frontend/dist`
- **Node Version**: 18.x or higher

The mockup includes:
- Sample conversations with simulated AI responses
- UI for all planned features
- Example data showing how the tool would work
- No real API calls or data persistence

## Motivation

ADHD brains often start projects with excitement but abandon them when they get difficult or boring. This tool concept was designed to:

1. **Challenge the impulse** to start something new
2. **Surface the patterns** behind project-jumping 
3. **Provide accountability** without judgment
4. **Help clarify** what "done" actually looks like

The irony wasn't lost on me that while building this tool to prevent project-abandonment, I was essentially doing exactly that - starting a new project instead of finishing existing ones.

## If You Want This Built

If you think there's value in this concept and want to see it deployed to production, let me know. In the meantime, I'm sticking with claude.ai chat as my thinking partner.

The repo demonstrates the UX concept and could serve as a foundation for someone who wants to build it out properly.

## Tech Stack (Mockup)
- **Frontend**: React 18, Vite, Tailwind CSS (via CDN), Lucide React (icons)
- **Backend**: ~~Node.js, Express~~ Removed for mockup
- **API**: ~~Claude API~~ Simulated responses

## Project Structure
```
ai-thinking-partner/
├── frontend/           # React frontend mockup
│   ├── src/
│   │   ├── App.jsx    # Main application component (mockup)
│   │   └── main.jsx   # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── backend/           # [Removed for mockup]
└── README.md
```

## Running the Mockup

### Prerequisites
- Node.js 18+ and npm

### Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The mockup will run on `http://localhost:5173`

### What You'll See
- Complete UI for all planned features
- Sample conversations with simulated AI responses
- Example projects and facts data
- All interactions work but don't persist data
- No real API calls - everything is mocked for demonstration

# Copy environment template
cp .env.example .env

# The default backend URL is already set to http://localhost:3001
# Edit .env if you need to change it

# Run development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## Why This Approach?

This tool concept was born from personal experience with ADHD patterns:

1. **Excitement about new projects** often masks avoidance of difficult work
2. **"This time will be different"** thinking ignores past patterns
3. **External accountability** helps more than willpower alone
4. **Socratic questioning** reveals underlying motivations

The AI thinking partner would be designed to:
- Challenge the impulse to start something new
- Surface patterns behind project-jumping 
- Provide accountability without judgment
- Help clarify what "done" actually looks like

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

This is currently a UI mockup, but if there's interest in building this out properly, contributions would be welcome. The foundation is here for someone who wants to implement the full concept.

