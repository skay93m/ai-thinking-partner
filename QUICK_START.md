# Quick Start - API Key Integration

## What You Got

✅ **Dual API Key System**
- Free tier: 10 requests/hour (uses your shared key)
- Unlimited: Users bring their own key

✅ **Beautiful UI**
- Modal for API key management
- Rate limit indicators
- Easy setup flow

✅ **Cost Protection**
- Rate limiting per IP
- Daily spending cap ($5)
- Automatic tracking

## Test It Locally

### 1. Start Backend
```bash
cd backend
cp .env.example .env
# Edit .env and add: ANTHROPIC_API_KEY=sk-ant-your-key-here
npm install
npm run dev
```

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Try It Out

**Test Free Tier:**
1. Open http://localhost:5173
2. Complete onboarding
3. Start a conversation
4. Check dashboard - should show "Using Free Tier" with counter

**Test User Key:**
1. Click "Add API Key" button
2. Enter an invalid key → Should see error
3. Enter your real key → Should validate ✓
4. Should now show "Using your API key (unlimited)"

**Test Rate Limit:**
Make 10 requests quickly, 11th should trigger modal

## Deploy to Render

### Backend (Web Service)
1. Create new Web Service
2. Point to your repo
3. Root Directory: `backend`
4. Environment Variables:
   - `ANTHROPIC_API_KEY`: Your shared key
5. Deploy!

### Frontend (Static Site)
1. Create new Static Site
2. Point to your repo
3. Root Directory: `frontend`
4. Build: `npm install && npm run build`
5. Publish: `frontend/dist`
6. Environment Variables:
   - `VITE_BACKEND_URL`: Your backend URL
7. Deploy!

### Update CORS
In `backend/server.js`, add your frontend URL:
```javascript
origin: [
  'http://localhost:5173',
  'https://your-frontend.onrender.com',  // Add this
  /\.onrender\.com$/
]
```

## How Users Will Experience It

### New User Journey
```
1. Visit site → Automatic free tier
2. Use app → See "8/10 requests remaining"
3. Hit limit → Modal: "Add key or wait 45 minutes"
4. Choose to add key → Enter key → Unlimited!
```

### Returning User
```
1. Return to site → Free tier again (keys don't persist)
2. Heavy users will likely add their key each session
3. Casual users will use free tier
```

## Cost Expectations

### For You (Site Owner)
- **Light**: $5-10/month
- **Medium**: $10-20/month
- **Protected**: Max $5/day ($150/month)

Recommendation: Set $20/month limit on your Anthropic API key.

### For Users
- **Free**: $0 (your cost: ~$0.15 per user per hour)
- **Own key**: ~$0.50-1.50/month for regular use

## Files Added/Modified

**New Files:**
- ✅ `frontend/src/ApiKeyModal.jsx`
- ✅ `API_KEY_GUIDE.md`
- ✅ `INTEGRATION_COMPLETE.md`
- ✅ `QUICK_START.md` (this file)

**Modified Files:**
- ✅ `backend/server.js` (rate limiting + validation)
- ✅ `frontend/src/App.jsx` (API key state + UI)
- ✅ `README.md` (API Key Options section)

## Key Features

### Backend
- Rate limiting: 10 req/hour/IP
- API key validation endpoint
- Cost tracking
- Dual key support

### Frontend
- API key modal
- Rate limit display
- Session-based storage
- Validation feedback

### Security
- Keys in memory only
- No persistence
- Backend validation
- Direct to Anthropic

## Common Questions

**Q: Will users need to enter their key every time?**
A: Yes, keys expire when they close the tab. This is by design for security.

**Q: Can I disable the free tier?**
A: Yes, remove `ANTHROPIC_API_KEY` from backend env vars.

**Q: How do I change the rate limit?**
A: Edit `SHARED_KEY_LIMIT` in `backend/server.js` (currently 10).

**Q: What if I run out of daily budget?**
A: Backend will return error, modal will prompt users to add their key.

**Q: Can I track my costs?**
A: Yes, check your Anthropic console dashboard.

## Monitoring Tips

### First Week
1. Check Anthropic console daily
2. Monitor backend logs for daily cost
3. Watch for rate limit patterns
4. Adjust limits if needed

### Backend Logs
```bash
# Watch for these:
"Using shared key - Remaining: X requests"
"Daily cost: $X.XXX"
"Using user-provided API key"
```

### Adjust If Needed
```javascript
// In backend/server.js
const SHARED_KEY_LIMIT = 10;  // Reduce to 5 if needed
const DAILY_LIMIT = 5.00;     // Increase to 10 if comfortable
```

## Troubleshooting

**"Shared API key not configured"**
→ Add `ANTHROPIC_API_KEY` to backend `.env`

**"Rate limit exceeded" immediately**
→ Backend restarted (rate limits reset), normal behavior

**CORS errors**
→ Update backend CORS origins with frontend URL

**User key not saving**
→ Expected! Keys are session-based for security

## Success! 🎉

You now have:
- ✅ Free tier for new users
- ✅ Unlimited option for power users
- ✅ Cost protection
- ✅ Beautiful UX
- ✅ Secure implementation

## Need Help?

Check these docs:
- `API_KEY_GUIDE.md` - Detailed technical guide
- `INTEGRATION_COMPLETE.md` - Full implementation details
- `README.md` - Updated with API key section

Test everything locally first, then deploy!
