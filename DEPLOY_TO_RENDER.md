# Render Deployment Guide

## Quick Deploy

This repository is pre-configured for Render deployment:

1. **Fork** this repository to your GitHub account
2. Go to **[Render.com](https://render.com)** and create account
3. Click **"New"** → **"Static Site"**
4. **Connect** your forked GitHub repository
5. **Deploy** - Render will auto-detect the configuration!

## Configuration Details

The `render.yaml` file configures:
- **Service Type**: Static Site
- **Build Command**: `cd frontend && npm install && npm run build`
- **Publish Directory**: `frontend/dist`
- **Routing**: SPA routing with fallback to `index.html`

## Manual Configuration

If you prefer manual setup instead of using `render.yaml`:

### Static Site Settings
- **Build Command**: `cd frontend && npm install && npm run build`
- **Publish Directory**: `frontend/dist`
- **Node Version**: 18.x (automatic)

### Environment Variables
None required - this is a client-side only mockup.

## What Gets Deployed

- Complete UI mockup of the AI thinking partner concept
- Simulated conversations demonstrating the approach
- All features working with mock data
- Responsive design optimized for all devices

## Cost

✅ **Free tier compatible** - Static sites on Render are free with:
- Global CDN
- Automatic SSL
- GitHub integration
- Instant deploys

## After Deployment

Your mockup will be available at:
`https://your-site-name.onrender.com`

The deployment demonstrates the complete UX concept for the AI thinking partner tool designed for ADHD brains.