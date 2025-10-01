# API Key Management Guide

## Overview

This application now supports flexible API key management:
1. **Free Tier**: Shared API key with rate limiting (10 requests/hour per user)
2. **Unlimited Access**: Users can provide their own Anthropic API key

## How It Works

### Architecture

```
User Request → Frontend → Backend → Claude API
                ↓
        Check API Key:
        - User provided? → Use it (no limits)
        - No user key? → Use shared key (with rate limit)
```

### Rate Limiting

- **Per IP tracking**: Each IP address gets 10 requests per hour
- **Automatic reset**: Limits reset after 1 hour
- **User feedback**: UI shows remaining requests and reset time
- **Graceful handling**: When limit reached, modal prompts user to add their own key

### Cost Control

The backend includes daily cost tracking for the shared key:
- Daily limit: $5 (configurable in `server.js`)
- Rough estimation: $0.015 per request
- Logs daily spending to console

## User Experience

### Scenario A: Free Tier User

1. Visit the site (no setup required)
2. Start using the AI (counts down: 10/10, 9/10, 8/10...)
3. See rate limit info on dashboard
4. Hit limit → Modal appears with options:
   - Wait for reset (shows countdown)
   - Add own API key for unlimited access

### Scenario B: User With API Key

1. Visit the site
2. Click "Add API Key" button in dashboard
3. Enter Anthropic API key (`sk-ant-...`)
4. Key is validated in real-time
5. If valid: ✓ Saved (shows "Using your API key")
6. Enjoy unlimited requests
7. Key stored in memory only (expires when tab closes)

### Scenario C: Invalid Key

1. User enters invalid key
2. Backend validates → Returns error
3. Modal shows: "Invalid API key. Please check and try again."
4. User can retry or remove key

## Security Features

✅ **In-Memory Storage**: API keys stored only in React state  
✅ **No Persistence**: Keys never saved to localStorage, cookies, or disk  
✅ **Session-Based**: Keys expire when browser tab closes  
✅ **Backend Validation**: Keys tested before acceptance  
✅ **No Exposure**: User keys never logged or exposed  
✅ **Direct Communication**: User keys go directly to Anthropic (not stored on server)

## Setup Instructions

### For Development

1. **Backend** (`backend/.env`):
   ```env
   ANTHROPIC_API_KEY=sk-ant-your-shared-key-here
   PORT=3001
   ```

2. **Frontend** (`frontend/.env`):
   ```env
   VITE_BACKEND_URL=http://localhost:3001
   ```

3. **Get a shared API key**:
   - Visit [console.anthropic.com](https://console.anthropic.com/)
   - Create a key labeled "Shared Free Tier"
   - Set monthly spending limit ($10-20 recommended)
   - Add to `backend/.env`

### For Production (Render)

1. **Backend Environment Variables**:
   - `ANTHROPIC_API_KEY`: Your shared key for free tier users
   - `PORT`: (auto-assigned by Render)

2. **Frontend Environment Variables**:
   - `VITE_BACKEND_URL`: Your backend URL (e.g., `https://yourapp.onrender.com`)

3. **CORS Configuration**:
   - Update `backend/server.js` to include your frontend domain
   - Already configured for `aithinkingpartner.syafiqkay.com`

## API Endpoints

### POST `/api/claude`

**Request:**
```json
{
  "model": "claude-sonnet-4-20250514",
  "max_tokens": 2000,
  "system": "System prompt...",
  "messages": [
    { "role": "user", "content": "Hello" }
  ],
  "userApiKey": "sk-ant-..." // Optional
}
```

**Response (Success):**
```json
{
  "content": [
    { "text": "AI response..." }
  ],
  "rateLimitInfo": {  // Only if using shared key
    "usingSharedKey": true,
    "remaining": 8,
    "limit": 10,
    "resetIn": 45  // minutes
  }
}
```

**Response (Rate Limit Exceeded):**
```json
{
  "error": "Rate limit exceeded",
  "message": "You've used all free requests. Rate limit resets in 45 minutes. Add your own API key for unlimited access.",
  "rateLimitExceeded": true,
  "resetIn": 45
}
```

**Response (Invalid User Key):**
```json
{
  "error": "Invalid API key",
  "message": "The API key provided is invalid. Please check your key and try again.",
  "invalidApiKey": true
}
```

### POST `/api/validate-key`

**Request:**
```json
{
  "apiKey": "sk-ant-..."
}
```

**Response:**
```json
{
  "valid": true,
  "message": "API key is valid"
}
```

## Cost Estimates

### For Site Owner (You)

**Shared Key Costs:**
- Light usage: $5-10/month
- Medium usage: $10-20/month
- Heavy usage: $20-50/month

**Cost per user:**
- ~$0.015 per request
- ~$0.15 per 10 requests (one free tier session)

**Recommendations:**
- Set monthly limit on API key ($20-50)
- Monitor usage in Anthropic console
- Adjust `SHARED_KEY_LIMIT` in code if needed

### For End Users

**Free Tier:**
- $0 (you pay)
- 10 requests/hour

**Own Key:**
- ~$0.01-0.03 per conversation
- ~$0.50-1.50 per month for regular use
- Unlimited requests

## Customization

### Change Rate Limits

Edit `backend/server.js`:

```javascript
const SHARED_KEY_LIMIT = 10;  // Change to 5, 20, etc.
const SHARED_KEY_RESET = 3600000;  // 1 hour in ms
```

### Change Daily Budget

Edit `backend/server.js`:

```javascript
const DAILY_LIMIT = 5.00;  // Change to 10.00, 20.00, etc.
```

### Disable Free Tier

Remove `ANTHROPIC_API_KEY` from backend environment variables.
Users will be required to provide their own key.

## Testing

### Test Free Tier

1. Don't add an API key
2. Make requests
3. Check dashboard for rate limit counter
4. Make 10 requests → Should see modal

### Test User Key

1. Click "Add API Key"
2. Enter invalid key → Should see error
3. Enter valid key → Should see success
4. Make unlimited requests
5. Close tab → Key should be gone
6. Reopen → Should revert to free tier

### Test Rate Limit

```bash
# Send 11 requests quickly (using curl or script)
for i in {1..11}; do
  curl -X POST http://localhost:3001/api/claude \
    -H "Content-Type: application/json" \
    -d '{"messages":[{"role":"user","content":"Hi"}]}'
done
```

11th request should return 429 error.

## Troubleshooting

### "Shared API key not configured"

- Backend `ANTHROPIC_API_KEY` is missing
- Check `backend/.env` file
- Restart backend server

### "Rate limit exceeded" immediately

- Server might have restarted (rate limits reset)
- Check if IP tracking is working correctly
- Verify `SHARED_KEY_LIMIT` value

### User key not working

- Check key format (`sk-ant-...`)
- Verify key is valid in Anthropic console
- Check network tab for validation errors
- Clear browser memory and try again

### CORS errors

- Verify frontend URL in backend's CORS config
- Check environment variables
- Restart both servers

## Future Enhancements

Potential improvements:
- [ ] Persistent rate limit storage (Redis)
- [ ] User accounts with saved keys (encrypted)
- [ ] Usage analytics dashboard
- [ ] Multiple tier options (5, 10, 20 requests)
- [ ] Email notifications for limit warnings
- [ ] API key usage tracking for users

## Support

For issues:
1. Check browser console for errors
2. Check backend logs
3. Verify API key validity at console.anthropic.com
4. Test with curl/Postman to isolate frontend vs backend issues
