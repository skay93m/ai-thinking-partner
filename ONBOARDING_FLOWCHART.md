# Visual Onboarding Flowchart

## Complete Onboarding Flow (Updated)

```
                    USER LANDS ON APP
                           |
                           v
        ┌──────────────────────────────────────┐
        │     STEP 0: WARNING                  │
        │                                      │
        │  ⚠️  Brutally Honest AI             │
        │  Calls you on your BS               │
        │  Challenges your patterns           │
        │                                      │
        │  [I Understand. Let's Do This]      │
        └──────────────────────────────────────┘
                           |
                           v
        ┌──────────────────────────────────────┐
        │  STEP 1: MENTAL HEALTH DISCLAIMER   │
        │                                      │
        │  🚨 NOT Therapy                     │
        │  NOT a Therapist                    │
        │  If in crisis → Get help            │
        │                                      │
        │  [I Understand. Continue]           │
        └──────────────────────────────────────┘
                           |
                           v
        ┌──────────────────────────────────────┐
        │    STEP 2: DATA & PRIVACY           │
        │                                      │
        │  💾 Stored locally in browser       │
        │  ⚠️  Export regularly!              │
        │                                      │
        │  [Got It. Let's Set Up]             │
        └──────────────────────────────────────┘
                           |
                           v
        ┌──────────────────────────────────────┐
        │    STEP 3: INITIAL SETUP            │
        │                                      │
        │  What should I call you?            │
        │  ┌────────────────────────────────┐ │
        │  │ [Your name]                    │ │
        │  └────────────────────────────────┘ │
        │                                      │
        │  [Continue]                         │
        └──────────────────────────────────────┘
                           |
                           v
        ┌──────────────────────────────────────┐
        │ ⭐ STEP 4: API KEY SETUP (NEW!)    │
        │                                      │
        │  🔑 Choose your experience:         │
        │                                      │
        │  ┌────────────────────────────────┐ │
        │  │ OPTION 1: FREE TIER            │ │
        │  │ ✓ 10 requests/hour             │ │
        │  │ ✓ No key needed                │ │
        │  │ ✓ Start now                    │ │
        │  └────────────────────────────────┘ │
        │                                      │
        │  ┌────────────────────────────────┐ │
        │  │ OPTION 2: YOUR KEY             │ │
        │  │ ✓ Unlimited                    │ │
        │  │ ✓ ~$0.01-0.03/chat             │ │
        │  │                                │ │
        │  │ 🔗 How to get key:             │ │
        │  │ 1. console.anthropic.com       │ │
        │  │ 2. Sign up/login               │ │
        │  │ 3. Create API Key              │ │
        │  │ 4. Copy key                    │ │
        │  │ 5. Paste below                 │ │
        │  │                                │ │
        │  │ ┌──────────────────────────┐   │ │
        │  │ │ sk-ant-...               │   │ │
        │  │ └──────────────────────────┘   │ │
        │  └────────────────────────────────┘ │
        │                                      │
        │  [← Back] [Let's Go! 🚀]            │
        └──────────────────────────────────────┘
                           |
            ┌──────────────┴──────────────┐
            |                             |
            v                             v
    ┌────────────────┐         ┌────────────────┐
    │  EMPTY KEY     │         │   WITH KEY     │
    │  (Free Tier)   │         │  (Unlimited)   │
    └────────────────┘         └────────────────┘
            |                             |
            |         ┌───────────────────┤
            |         |                   |
            |         v                   |
            |  ┌──────────────┐          |
            |  │  Format      │          |
            |  │  Valid?      │          |
            |  └──────────────┘          |
            |         |                   |
            |    No   |   Yes             |
            |    ┌────┴────┐              |
            |    v         v              |
            | [Alert]  [Validate]         |
            |    |         |              |
            |    └─────┬───┘              |
            |          |                  |
            |          v                  |
            |    ┌──────────┐             |
            |    │  Valid?  │             |
            |    └──────────┘             |
            |          |                  |
            |     No   |   Yes            |
            |     ┌────┴────┐             |
            |     v         |             |
            |  [Choice]     |             |
            |  Try/Skip     |             |
            |     |         |             |
            └─────┴─────────┴─────────────┘
                           |
                           v
              ┌────────────────────────┐
              │      DASHBOARD         │
              │                        │
              │  Welcome, [Name]!      │
              │                        │
              │  API Status:           │
              │  • Free Tier (8/10)    │
              │    OR                  │
              │  • Using your key ✓    │
              └────────────────────────┘
```

## Decision Tree at Step 4

```
                    STEP 4: API KEY SETUP
                           |
        ┌──────────────────┴──────────────────┐
        |                                     |
        v                                     v
    LEAVE EMPTY                         ENTER KEY
        |                                     |
        v                                     v
  [Start with                          Check format
   Free Tier]                                |
        |                          ┌─────────┴─────────┐
        |                          |                   |
        |                          v                   v
        |                       Valid            Invalid
        |                    (sk-ant-*)          Format
        |                          |                   |
        |                          v                   v
        |                    Validate with         [Alert]
        |                      Backend              Stay on
        |                          |                 page
        |                    ┌─────┴─────┐
        |                    |           |
        |                    v           v
        |                 Success      Failed
        |                    |           |
        |                    |           v
        |                    |      [Confirm]
        |                    |      Try anyway?
        |                    |      Skip?
        |                    |           |
        └────────────────────┴───────────┘
                           |
                           v
                      DASHBOARD
```

## User Personas & Journeys

### Persona 1: "Quick Try" Quinn

**Goal**: Just want to try the app quickly

```
Step 3: Enter "Quinn"
Step 4: See options → Skip API key input
        Click "Start with Free Tier"
        → DASHBOARD (Free Tier: 10/10)

Experience:
✓ No friction
✓ Starts in 30 seconds
✓ Can add key later if likes it
```

### Persona 2: "Power User" Paula

**Goal**: Serious about using this, wants unlimited

```
Step 3: Enter "Paula"
Step 4: See options → Read instructions
        Visit console.anthropic.com
        Create account & API key
        Return, paste key
        Click "Let's Go, Paula! 🚀"
        → Key validates ✓
        → DASHBOARD (Using your key ✓)

Experience:
✓ Clear instructions
✓ Unlimited from day 1
✓ Professional setup
```

### Persona 3: "Cautious" Carlos

**Goal**: Wants to understand before committing

```
Step 3: Enter "Carlos"
Step 4: Read both options carefully
        Clicks link to learn about pricing
        Decides to try free tier first
        Leaves key empty
        Click "Start with Free Tier"
        → DASHBOARD (Free Tier: 10/10)
        
Later: Uses 10 requests, loves it
       Clicks "Add API Key" from dashboard
       Adds key → Converts to unlimited

Experience:
✓ No pressure
✓ Clear information
✓ Easy upgrade path
```

### Persona 4: "Confused" Connie

**Goal**: Not tech-savvy, needs hand-holding

```
Step 3: Enter "Connie"
Step 4: Tries to enter key
        Types "myapikey123"
        Click continue
        → Alert: "Invalid format"
        
        Clicks back, re-reads
        Realizes can skip
        Click "Start with Free Tier"
        → DASHBOARD (Free Tier: 10/10)

Experience:
✓ Clear error message
✓ Can skip if confused
✓ Still gets to use app
```

## Key Improvements Over Old Flow

### Before
```
Step 3: Name → DASHBOARD
```
- No API key option during onboarding
- Users discover limits during use
- Have to navigate to settings to add key
- Some abandon when hitting limit

### After
```
Step 3: Name → Step 4: API Key → DASHBOARD
```
- ✅ Choice presented upfront
- ✅ Clear instructions visible
- ✅ Can set up unlimited immediately
- ✅ Better conversion rate expected

## Validation Flow Detail

```
User enters key: "sk-ant-abc123xyz"
     |
     v
Format Check (Frontend)
     |
     ├─ Starts with "sk-ant-"? → Yes
     |
     v
Backend Validation
POST /api/validate-key
     |
     ├─ Network OK?
     |  ├─ Yes → Test with Anthropic API
     |  |  ├─ Returns 200? → Valid ✓
     |  |  └─ Returns 401? → Invalid ✗
     |  └─ No → Show warning, allow proceed
     |
     v
Result
     ├─ Valid → Set userApiKey, go to dashboard
     ├─ Invalid → Offer "Try anyway" or "Use free tier"
     └─ Network error → Warning + proceed option
```

## Mobile Responsive Considerations

The new Step 4 is designed to work on mobile:
- Stacked sections (not side-by-side)
- Large touch targets
- Readable font sizes
- Scrollable instructions
- Copy/paste friendly input field

## Analytics Events to Track

```javascript
// Suggested analytics events:
onboarding_step4_viewed
onboarding_api_key_entered
onboarding_api_key_validated_success
onboarding_api_key_validated_failure
onboarding_free_tier_chosen
onboarding_own_key_chosen
onboarding_back_clicked
onboarding_completed_with_key
onboarding_completed_without_key
```

## A/B Testing Opportunities

Test variations:
1. **Order**: Free tier first vs Own key first
2. **Default**: Empty vs pre-filled with example
3. **Emphasis**: Equal weight vs recommend own key
4. **Instructions**: Inline vs expandable
5. **Validation**: Immediate vs on submit

---

**Visual Summary**: Step 4 adds a clear decision point where users choose their experience before entering the app, with helpful instructions and smart validation built in.
