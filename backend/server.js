import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Rate limiting for shared key - TOTAL LIFETIME CALLS
const rateLimits = new Map();
const SHARED_KEY_LIMIT = 10; // TOTAL requests per IP (lifetime)

// Cost tracking for shared key
let dailyCost = 0;
const DAILY_LIMIT = 5.00; // $5 per day max

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://aithinkingpartner.syafiqkay.com',
    /\.onrender\.com$/
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI Thinking Partner API is running' });
});

// Rate limiting function - TOTAL CALLS (no reset)
function checkRateLimit(ip) {
  const userLimit = rateLimits.get(ip);
  
  if (!userLimit) {
    rateLimits.set(ip, { count: 1 });
    return { allowed: true, remaining: SHARED_KEY_LIMIT - 1, total: false };
  }
  
  if (userLimit.count >= SHARED_KEY_LIMIT) {
    return { allowed: false, remaining: 0, total: true };
  }
  
  userLimit.count++;
  return { allowed: true, remaining: SHARED_KEY_LIMIT - userLimit.count, total: false };
}

// Claude API proxy endpoint
app.post('/api/claude', async (req, res) => {
  try {
    const { model, max_tokens, system, messages, userApiKey } = req.body;
    const clientIP = req.ip || req.connection.remoteAddress;
    
    let apiKey;
    let usingSharedKey = false;
    
    // Determine which API key to use
    if (userApiKey && userApiKey.startsWith('sk-ant-')) {
      // User provided their own key
      apiKey = userApiKey;
      console.log('Using user-provided API key');
    } else {
      // Use shared key with rate limiting
      const rateCheck = checkRateLimit(clientIP);
      
      if (!rateCheck.allowed) {
        return res.status(429).json({ 
          error: 'Free tier limit reached',
          message: `You've used all 10 free requests. Add your own API key for unlimited access.`,
          rateLimitExceeded: true,
          totalLimit: true
        });
      }
      
      // Check daily budget limit
      if (dailyCost > DAILY_LIMIT) {
        return res.status(429).json({
          error: 'Daily budget exceeded',
          message: 'Free tier temporarily unavailable. Please use your own API key.',
          dailyLimitExceeded: true
        });
      }
      
      apiKey = process.env.ANTHROPIC_API_KEY;
      usingSharedKey = true;
      
      if (!apiKey) {
        return res.status(500).json({ 
          error: 'Server configuration error',
          message: 'Shared API key not configured. Please provide your own API key.'
        });
      }
      
      console.log(`Using shared key - Remaining: ${rateCheck.remaining} requests`);
    }

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model || 'claude-3-5-haiku-20241022',
        max_tokens: max_tokens || 2000,
        system,
        messages
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Claude API Error:', errorData);
      
      // Check if it's an invalid API key error
      if (response.status === 401) {
        return res.status(401).json({ 
          error: 'Invalid API key',
          message: 'The API key provided is invalid. Please check your key and try again.',
          invalidApiKey: true
        });
      }
      
      return res.status(response.status).json({ 
        error: errorData.error?.message || 'Claude API request failed' 
      });
    }

    const data = await response.json();
    
    // Track cost for shared key
    if (usingSharedKey) {
      // Rough cost estimation: $0.015 per request
      dailyCost += 0.015;
      console.log(`Daily cost: $${dailyCost.toFixed(3)}`);
      
      // Add rate limit info to response
      const currentLimit = rateLimits.get(clientIP);
      data.rateLimitInfo = {
        usingSharedKey: true,
        remaining: SHARED_KEY_LIMIT - (currentLimit?.count || 0),
        limit: SHARED_KEY_LIMIT,
        totalLimit: true // No time-based reset
      };
    }
    
    res.json(data);

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// Endpoint to validate user API key
app.post('/api/validate-key', async (req, res) => {
  try {
    const { apiKey } = req.body;
    
    if (!apiKey || !apiKey.startsWith('sk-ant-')) {
      return res.json({ valid: false, message: 'Invalid key format' });
    }
    
    // Test the key with a minimal request
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Hi' }]
      })
    });
    
    if (response.ok) {
      return res.json({ valid: true, message: 'API key is valid' });
    } else {
      return res.json({ valid: false, message: 'API key is invalid' });
    }
    
  } catch (error) {
    res.status(500).json({ valid: false, message: 'Validation failed' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`🔑 Shared API Key configured: ${process.env.ANTHROPIC_API_KEY ? 'Yes' : 'No'}`);
});
