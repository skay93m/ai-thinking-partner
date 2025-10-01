# Updated Onboarding Flow - API Key Setup

## What Changed?

The onboarding flow now includes an **API Key Setup** page after the user enters their name, giving new users a clear choice between:
1. **Free Tier** - Quick start with 10 requests/hour
2. **Own API Key** - Unlimited access with their own Anthropic key

## New Onboarding Flow

```
Step 0: WARNING
  ↓
Step 1: MENTAL HEALTH DISCLAIMER
  ↓
Step 2: DATA & PRIVACY
  ↓
Step 3: INITIAL SETUP (Name)
  ↓
Step 4: API KEY SETUP ← NEW!
  ↓
Dashboard
```

## Step 4: API Key Setup (New)

### What Users See

```
┌─────────────────────────────────────────────────────────┐
│ 🔑 API KEY SETUP                                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Choose how you want to use the AI thinking partner:    │
│                                                         │
│ ┌─────────────────────────────────────────────────┐   │
│ │ Option 1: Free Tier (Quick Start)              │   │
│ │                                                 │   │
│ │ ✓ 10 AI requests per hour                      │   │
│ │ ✓ No API key required                          │   │
│ │ ✓ Perfect for trying out                       │   │
│ │ ✓ Start using immediately                      │   │
│ │                                                 │   │
│ │ Rate limits reset every hour                   │   │
│ └─────────────────────────────────────────────────┘   │
│                                                         │
│ ┌─────────────────────────────────────────────────┐   │
│ │ Option 2: Your API Key (Recommended)           │   │
│ │                                                 │   │
│ │ ✓ Unlimited requests                           │   │
│ │ ✓ Cost: ~$0.01-0.03 per conversation           │   │
│ │ ✓ Full control over your usage                 │   │
│ │ ✓ Secure (stored in memory only)               │   │
│ │                                                 │   │
│ │ ┌───────────────────────────────────────────┐ │   │
│ │ │ 🔗 How to get your API key:               │ │   │
│ │ │                                           │ │   │
│ │ │ 1. Visit console.anthropic.com           │ │   │
│ │ │ 2. Sign up or log in                     │ │   │
│ │ │ 3. Navigate to "API Keys"                │ │   │
│ │ │ 4. Click "Create Key"                    │ │   │
│ │ │ 5. Copy the key (starts with "sk-ant-") │ │   │
│ │ │ 6. Paste it below                        │ │   │
│ │ └───────────────────────────────────────────┘ │   │
│ │                                                 │   │
│ │ Enter Your Anthropic API Key (Optional)        │   │
│ │ ┌─────────────────────────────────────────┐   │   │
│ │ │ sk-ant-api03-...                        │   │   │
│ │ └─────────────────────────────────────────┘   │   │
│ │ Leave empty to use free tier                   │   │
│ └─────────────────────────────────────────────────┘   │
│                                                         │
│ [← Back]  [Let's Go, John! 🚀 / Start with Free Tier] │
│                                                         │
│ 💡 Tip: You can add or change your API key later      │
└─────────────────────────────────────────────────────────┘
```

## User Flows

### Flow 1: New User Chooses Free Tier

```
1. Enter name: "John"
2. See API key setup page
3. Read options
4. Leave API key field empty
5. Click "Start with Free Tier"
   → Goes to dashboard
   → Can use 10 requests/hour
   → Can add key later from dashboard
```

### Flow 2: New User Adds Their Key

```
1. Enter name: "Sarah"
2. See API key setup page
3. Read instructions
4. Visit console.anthropic.com
5. Create API key
6. Paste key (sk-ant-...)
7. Click "Let's Go, Sarah! 🚀"
   → Key is validated
   → Goes to dashboard
   → Has unlimited access
```

### Flow 3: User Enters Invalid Key

```
1. Enter name: "Mike"
2. Enter wrong key format (e.g., "abc123")
3. Click continue
   → Alert: "Invalid API key format. Keys should start with 'sk-ant-'"
   → Can correct or skip to use free tier
```

### Flow 4: User's Key Fails Validation

```
1. Enter name: "Lisa"
2. Enter key with correct format but invalid
3. Click continue
   → Backend validates
   → Alert: "API key validation failed. This key may not work."
   → Options: Try anyway OR use free tier
```

## Features

### ✅ Clear Options
- Two distinct options with visual separation
- Benefits clearly listed for each option
- No confusion about what to choose

### ✅ Helpful Instructions
- Step-by-step guide to get API key
- Direct link to Anthropic console
- Visual formatting for easy reading

### ✅ Validation
- Format check (must start with "sk-ant-")
- Backend validation (tests if key actually works)
- Clear error messages
- Option to skip if issues arise

### ✅ Flexibility
- Can skip and use free tier
- Can go back to change name
- Can add/change key later from dashboard
- Tip reminds users they can change later

### ✅ Smart UX
- Button text changes based on choice:
  - With key: "Let's Go, [Name]! 🚀"
  - Without key: "Start with Free Tier"
- Loading state during validation
- Back button to fix name if needed

## Technical Details

### State Management
```javascript
// Existing state used:
- userName (from step 3)
- userApiKey (API key input)
- isLoading (during validation)
- onboardingStep (now goes to 4)
```

### Validation Flow
```javascript
1. Check if key is empty
   → Empty: Skip to dashboard (free tier)
   
2. Check key format
   → Must start with "sk-ant-"
   → If not: Show alert, stay on page
   
3. Call backend validation
   → POST /api/validate-key
   → If valid: Proceed to dashboard
   → If invalid: Offer choice to try anyway or skip
   
4. Handle errors
   → If backend unreachable: Warning but allow to proceed
```

### Code Location
File: `frontend/src/App.jsx`
- Line ~483: New Step 4 (API Key Setup)
- Includes:
  - Free tier option display
  - Own key option display
  - Instructions for getting key
  - Input field for API key
  - Validation logic
  - Back/Continue buttons

## Benefits of This Approach

### For New Users
✅ **Informed Choice** - Clear understanding of both options
✅ **No Pressure** - Free tier is equally prominent
✅ **Easy Setup** - Step-by-step instructions
✅ **Flexibility** - Can skip and decide later

### For Power Users
✅ **Early Setup** - Can configure unlimited access from start
✅ **Clear Benefits** - Understand cost and advantages
✅ **Validated** - Key tested before proceeding
✅ **Professional** - Shows app takes security seriously

### For You (Developer)
✅ **More Conversions** - Some users will add keys immediately
✅ **Reduced Load** - Power users use own keys from day 1
✅ **Better UX** - Users make informed decisions
✅ **Clear Costs** - Users understand what they're getting

## Testing Checklist

- [ ] Step 3 → Step 4 transition works
- [ ] Free tier button (empty key) goes to dashboard
- [ ] Invalid format shows alert
- [ ] Valid key validates successfully
- [ ] Invalid key shows validation error
- [ ] "Try anyway" option works
- [ ] Back button returns to name input
- [ ] Tip text displays at bottom
- [ ] Link to console.anthropic.com opens
- [ ] Loading state shows during validation

## Screenshots (Conceptual)

### Before (Old Flow)
```
Step 3: Name Input → Dashboard
```

### After (New Flow)
```
Step 3: Name Input → Step 4: API Key Setup → Dashboard
                                ↓
                        Choice: Free Tier or Own Key
                                ↓
                        Instructions + Validation
```

## User Education

The new step educates users about:
1. **Free tier limits** - 10 requests/hour
2. **Own key benefits** - Unlimited, low cost
3. **How to get a key** - Clear 6-step process
4. **Security** - Stored in memory only
5. **Flexibility** - Can change later

## Analytics Opportunities

Track these metrics:
- % choosing free tier vs own key
- % who add key during onboarding vs later
- Validation failure rate
- Back button usage (indicates confusion?)

## Future Enhancements

Potential improvements:
- [ ] Video tutorial link for getting API key
- [ ] Estimated cost calculator
- [ ] Option to test connection before proceeding
- [ ] Remember choice for next session (localStorage)
- [ ] A/B test different copy/layouts

## Migration Notes

### Existing Users
- Onboarding step numbers shift (3 → 4)
- New users see new flow
- Existing users (who've onboarded) unaffected

### Deployment
1. Deploy to dev/staging first
2. Test complete onboarding flow
3. Verify validation works
4. Check both paths (free tier and own key)
5. Deploy to production

---

**Status**: ✅ Implemented and Ready to Test
**Files Modified**: `frontend/src/App.jsx`
**New Step**: Step 4 - API Key Setup
**Testing**: Recommended before production deployment
