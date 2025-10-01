import React, { useState } from 'react';
import { FileDown, FileUp, Settings, MessageSquare, List, Calendar, Edit3, RotateCcw, Save, X, Key, AlertTriangle } from 'lucide-react';

// Reusable Demo Banner Component
const DemoBanner = () => (
  <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
    <div className="max-w-4xl mx-auto">
      <p className="text-blue-800 text-sm">
        💡 This is a design/UI demonstration. The repo is available on{' '}
        <a 
          href="https://github.com/skay93m/ai-thinking-partner" 
          target="_blank" 
          rel="noopener noreferrer"
          className="font-semibold underline hover:text-blue-600"
        >
          GitHub
        </a>{' '}
        - clone it and add your Claude API key if you'd like full functionality. Built to demonstrate approach to ADHD-friendly thinking partner tools.
      </p>
    </div>
  </div>
);

const DEFAULT_PROMPT = `**Your Role: Strategic Thinking Partner & Board of Directors**

You are my thinking partner who helps me refine and develop my ideas through deep questioning and collaborative exploration. Your primary job is NOT to provide answers, but to help me think better.

**Core Principles:**

1. **Go deeper first, answer later** - When I share a thought, goal, or problem, your first instinct should be to understand the fuller picture before offering any solutions or advice.
2. **Understand the context systematically** - Before we explore any idea, help me establish:
    - Where is this coming from? (What sparked this thought/goal?)
    - What's my current situation? (Status quo - where am I now?)
    - What have I already tried or considered?
    - What constraints am I working within? (Time, money, obligations, skills)
    - What does success actually look like to me?
    - What am I afraid of or uncertain about?
3. **Make your assumptions explicit** - If you need to make any assumptions about my situation, goals, or context, state them clearly: "I'm assuming X... is that right?" This lets me correct you early.
4. **Ask one or two good questions at a time** - Don't overwhelm me with a wall of questions. Ask thoughtfully, let me respond, then drill deeper based on what I share.
5. **Challenge my thinking constructively:**
    - Point out contradictions or tensions in my reasoning
    - Ask "Why?" multiple times to get past surface-level motivations
    - Suggest alternative framings: "Have you considered viewing this as..."
    - Identify assumptions I'm making unconsciously
    - Play devil's advocate when useful
6. **Help me explore before concluding:**
    - Map out different paths and their implications
    - Discuss trade-offs explicitly
    - Consider second-order effects: "If you do X, what happens next?"
    - Use frameworks when helpful (opportunity cost, reversibility of decisions, etc.)
7. **Be direct but collaborative** - Challenge me genuinely, but remember I'm leading this. You're my board of advisors, not my boss.

**When to shift modes:**
- If I explicitly ask for direct advice or answers, provide them
- If we've thoroughly explored something, help me synthesize
- If I'm stuck in analysis paralysis, help me identify next small steps

**Tone:** Sharp, curious colleague who cares about helping me think clearly. Conversational but intellectually rigorous.`;

const EXAMPLE_FACTS = {
  facts: [
    {
      category: "pattern",
      key: "core_wound",
      value: "Example: At 17, achieved high grades but faced rejection that shattered identity. Spent years chasing credentials to prove worth.",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      category: "context",
      key: "adhd_traits",
      value: "Example: ADHD makes novelty more rewarding than sustained effort. When things get boring/hard, triggers old wounds.",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]
};

const EXAMPLE_PROJECTS = {
  projects: [
    {
      id: "example-1",
      title: "Example: Certification Project",
      status: "parked",
      definition_of_done: "Pass exam, complete 3 months of study without switching focus",
      progress_notes: "Realized this was pattern-chasing after reflection. Parking to reassess genuine interest.",
      pattern_flags: ["credential_chasing", "triggered_by_comparison"],
      created_at: new Date().toISOString(),
      last_accessed_at: new Date().toISOString(),
      completed_at: null
    }
  ]
};

function App() {
  const [currentView, setCurrentView] = useState('onboarding');
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [facts, setFacts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [aiPrompt, setAiPrompt] = useState(DEFAULT_PROMPT);
  const [promptHistory, setPromptHistory] = useState([
    { prompt: DEFAULT_PROMPT, timestamp: new Date().toISOString(), label: 'Original' }
  ]);
  const [lastCheckIn, setLastCheckIn] = useState(new Date().toISOString());
  const [userName, setUserName] = useState('');
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [currentMessages, setCurrentMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingPrompt, setEditingPrompt] = useState(false);
  const [tempPrompt, setTempPrompt] = useState(aiPrompt);
  const [showDocs, setShowDocs] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  
  // API Key Management - Removed for demo
  // const [userApiKey, setUserApiKey] = useState('');
  // const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  // const [rateLimitInfo, setRateLimitInfo] = useState(null);

  const exportData = () => {
    const data = {
      version: '1.0',
      exported_at: new Date().toISOString(),
      user_name: userName,
      facts,
      projects,
      conversations,
      ai_prompt: aiPrompt,
      prompt_history: promptHistory,
      last_check_in: lastCheckIn
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `thinking-partner-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyDataToClipboard = async () => {
    const data = {
      version: '1.0',
      exported_at: new Date().toISOString(),
      user_name: userName,
      facts,
      projects,
      conversations,
      ai_prompt: aiPrompt,
      prompt_history: promptHistory,
      last_check_in: lastCheckIn
    };
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    } catch (err) {
      alert('Failed to copy to clipboard. Try the download option.');
    }
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.facts) setFacts(data.facts);
        if (data.projects) setProjects(data.projects);
        if (data.conversations) setConversations(data.conversations);
        if (data.ai_prompt) setAiPrompt(data.ai_prompt);
        if (data.prompt_history) setPromptHistory(data.prompt_history);
        if (data.last_check_in) setLastCheckIn(data.last_check_in);
        if (data.user_name) setUserName(data.user_name);
        alert('Data imported successfully!');
      } catch (err) {
        setError('Failed to import data. Check file format.');
      }
    };
    reader.readAsText(file);
  };

  const importFacts = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!data.facts || !Array.isArray(data.facts)) {
          throw new Error('Invalid format: expected {facts: [...]}');
        }
        data.facts.forEach((fact, i) => {
          if (!fact.category || !fact.key || !fact.value) {
            throw new Error(`Fact at index ${i} missing required fields`);
          }
        });
        setFacts([...facts, ...data.facts]);
        alert(`${data.facts.length} facts imported!`);
      } catch (err) {
        setError(`Failed to import facts: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  const importProjects = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!data.projects || !Array.isArray(data.projects)) {
          throw new Error('Invalid format: expected {projects: [...]}');
        }
        data.projects.forEach((project, i) => {
          if (!project.title || !project.status) {
            throw new Error(`Project at index ${i} missing required fields`);
          }
          if (!project.id) project.id = `imported-${Date.now()}-${i}`;
        });
        setProjects([...projects, ...data.projects]);
        alert(`${data.projects.length} projects imported!`);
      } catch (err) {
        setError(`Failed to import projects: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  const exportFacts = () => {
    const blob = new Blob([JSON.stringify({ facts }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `facts-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportProjects = () => {
    const blob = new Blob([JSON.stringify({ projects }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `projects-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const savePrompt = () => {
    const newHistory = [
      { prompt: tempPrompt, timestamp: new Date().toISOString(), label: 'Modified' },
      ...promptHistory.slice(0, 2)
    ];
    setPromptHistory(newHistory);
    setAiPrompt(tempPrompt);
    setEditingPrompt(false);
  };

  const restoreDefaultPrompt = () => {
    setTempPrompt(DEFAULT_PROMPT);
    setAiPrompt(DEFAULT_PROMPT);
    setEditingPrompt(false);
  };

  // Mock API responses for demonstration
  const MOCK_RESPONSES = [
    "Interesting thought! Before we dive into solutions, I'd like to understand the context better. What sparked this particular idea for you right now? Was there something you experienced recently, or have you been mulling this over for a while?",
    
    "That's helpful context. Now I'm curious about your current situation - where are you with this area of your life right now? What's working, what isn't, and what have you already tried or considered?",
    
    "I'm noticing a pattern here that might be worth exploring. You mentioned wanting to start something new, but I'm wondering - what other projects or commitments do you currently have on your plate? Sometimes our brain craves novelty when we're avoiding something difficult in what we're already working on.",
    
    "Hold on - let me challenge you on something. You've described this new idea with a lot of enthusiasm, but I'm hearing some familiar patterns. How is this different from the last three projects you started? What makes you confident this won't end up in the same 'started but not finished' pile?",
    
    "Fair point. Let's dig deeper into what success actually looks like for you here. If we fast-forward 6 months and this has gone really well, what would be different in your life? Be specific - not just 'I'll feel better' but what tangible changes would you see?",
    
    "Now here's the hard question: What are you afraid will happen if you don't pursue this? I suspect there might be something underneath driving the urgency you're feeling about this idea."
  ];

  let mockResponseIndex = 0;

  const sendMessageToClaude = async (messages) => {
    setIsLoading(true);
    setError(null);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    try {
      // Get a mock response - cycle through different responses
      const assistantMessage = MOCK_RESPONSES[mockResponseIndex % MOCK_RESPONSES.length];
      mockResponseIndex++;
      
      const newMessages = [...messages, { role: 'assistant', content: assistantMessage }];
      setCurrentMessages(newMessages);
      
      if (currentProjectId) {
        const existingConv = conversations.find(c => c.project_id === currentProjectId);
        if (existingConv) {
          setConversations(conversations.map(c => 
            c.project_id === currentProjectId ? { ...c, messages: newMessages } : c
          ));
        } else {
          setConversations([...conversations, {
            id: `conv-${Date.now()}`,
            project_id: currentProjectId,
            messages: newMessages,
            created_at: new Date().toISOString()
          }]);
        }
        setProjects(projects.map(p => 
          p.id === currentProjectId ? { ...p, last_accessed_at: new Date().toISOString() } : p
        ));
      }
      setIsLoading(false);
    } catch (err) {
      setError(`Failed: ${err.message}`);
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    const newMessages = [...currentMessages, { role: 'user', content: userInput }];
    sendMessageToClaude(newMessages);
    setUserInput('');
  };

  const startNewThought = () => {
    setCurrentProjectId(null);
    setCurrentMessages([]);
    setCurrentView('conversation');
    
    // Send initial structured prompt to guide the conversation (Bug #2 fix)
    const initialPrompt = `I want to start exploring a new thought or project. Help me think through this systematically by:

1. Understanding what sparked this thought
2. Clarifying my current situation and context
3. Identifying what I've already considered
4. Exploring what success would look like
5. Discussing any concerns or uncertainties I have

Let's start with: What's on my mind right now?`;
    
    const initialMessages = [{ role: 'user', content: initialPrompt }];
    sendMessageToClaude(initialMessages);
  };

  const openExistingThought = (projectId) => {
    setCurrentProjectId(projectId);
    const conv = conversations.find(c => c.project_id === projectId);
    setCurrentMessages(conv?.messages || []);
    setCurrentView('conversation');
    const project = projects.find(p => p.id === projectId);
    if (project && (!conv || conv.messages.length === 0)) {
      const summaryPrompt = `Existing project: "${project.title}"\n\nStatus: ${project.status}\nDoD: ${project.definition_of_done || 'Not defined'}\nProgress: ${project.progress_notes}\n\nProvide a brief summary and ONE reflection prompt.`;
      sendMessageToClaude([{ role: 'user', content: summaryPrompt }]);
    }
  };

  const createProject = () => {
    const title = prompt('What should we call this thought/project?');
    if (!title) return;
    const newProject = {
      id: `project-${Date.now()}`,
      title,
      status: 'active',
      definition_of_done: '',
      progress_notes: '',
      pattern_flags: [],
      created_at: new Date().toISOString(),
      last_accessed_at: new Date().toISOString(),
      completed_at: null
    };
    setProjects([...projects, newProject]);
    setCurrentProjectId(newProject.id);
    alert(`Project "${title}" created!`);
  };

  const updateProjectStatus = (projectId, newStatus) => {
    setProjects(projects.map(p => 
      p.id === projectId ? { 
        ...p, 
        status: newStatus,
        completed_at: newStatus === 'completed' ? new Date().toISOString() : p.completed_at
      } : p
    ));
  };

  const dailyCheckIn = () => {
    const daysSinceCheckIn = Math.floor((new Date() - new Date(lastCheckIn)) / (1000 * 60 * 60 * 24));
    const activeCount = projects.filter(p => p.status === 'active').length;
    let checkInPrompt = `Daily check-in.\n\n`;
    if (daysSinceCheckIn > 1) {
      checkInPrompt += `Haven't checked in for ${daysSinceCheckIn} days. What's been going on?\n\n`;
    }
    if (activeCount >= 10) {
      checkInPrompt += `You're juggling ${activeCount} active thoughts. Want to synthesize?\n\n`;
    }
    checkInPrompt += `Quick pulse check on active projects:\n${projects.filter(p => p.status === 'active').map(p => `- ${p.title}`).join('\n')}`;
    setCurrentProjectId(null);
    setCurrentMessages([]);
    setCurrentView('conversation');
    sendMessageToClaude([{ role: 'user', content: checkInPrompt }]);
    setLastCheckIn(new Date().toISOString());
  };

  // Onboarding View
  if (currentView === 'onboarding') {
    return (
      <div className="min-h-screen bg-black text-white">
        <DemoBanner />
        
        <div className="p-8">
          <div className="max-w-3xl mx-auto">
          {onboardingStep === 0 && (
            <div className="space-y-8">
              <div className="border-4 border-yellow-500 p-8 bg-yellow-500 bg-opacity-10">
                <h1 className="text-4xl font-black mb-4 text-yellow-500">WARNING</h1>
                <p className="text-xl font-bold mb-4">This tool will be brutally honest with you.</p>
                <p className="text-lg mb-4">It will call you on your bullshit. It will challenge your patterns. It will not let you lie to yourself.</p>
                <p className="text-lg font-bold text-yellow-500">Why? Because you asked for it.</p>
                <p className="text-lg mt-4">Your ADHD brain thrives on novelty and gets bored with the hard middle parts. This tool helps you break that pattern.</p>
              </div>
              <button 
                onClick={() => setOnboardingStep(1)}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 px-8 text-xl"
              >
                I Understand. Let's Do This.
              </button>
            </div>
          )}
          {onboardingStep === 1 && (
            <div className="space-y-8">
              <div className="border-2 border-red-600 p-8">
                <h2 className="text-3xl font-black mb-6 text-red-600">MENTAL HEALTH DISCLAIMER</h2>
                <div className="space-y-4 text-lg">
                  <p className="font-bold">This is NOT therapy. I am NOT a therapist.</p>
                  <p>I'm an AI thinking partner designed to challenge your patterns.</p>
                  <p className="text-red-500 font-bold">If you are experiencing crisis, STOP and get professional help immediately.</p>
                </div>
              </div>
              <button 
                onClick={() => setOnboardingStep(2)}
                className="w-full bg-white hover:bg-gray-200 text-black font-black py-4 px-8 text-xl"
              >
                I Understand. Continue.
              </button>
            </div>
          )}
          {onboardingStep === 2 && (
            <div className="space-y-8">
              <div className="border-2 border-gray-500 p-8">
                <h2 className="text-3xl font-black mb-6">DATA & PRIVACY</h2>
                <div className="space-y-4 text-lg">
                  <p className="font-bold">Everything is stored locally in your browser session.</p>
                  <p className="text-yellow-500 font-bold">Export your data regularly or you'll lose it!</p>
                </div>
              </div>
              <button 
                onClick={() => setOnboardingStep(3)}
                className="w-full bg-white hover:bg-gray-200 text-black font-black py-4 px-8 text-xl"
              >
                Got It. Let's Set Up.
              </button>
            </div>
          )}
          {onboardingStep === 3 && (
            <div className="space-y-8">
              <h2 className="text-3xl font-black mb-6">INITIAL SETUP</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-bold mb-2">What should I call you?</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full bg-gray-900 border-2 border-gray-700 p-3 text-xl"
                    placeholder="Your name"
                  />
                </div>
                <button 
                  onClick={() => {
                    if (!userName.trim()) {
                      alert('Please enter your name');
                      return;
                    }
                    setOnboardingStep(4);
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-4 px-8 text-xl"
                >
                  {userName.trim() ? 'Continue' : "Next"}
                </button>
              </div>
            </div>
          )}
          {onboardingStep === 4 && (
            <div className="space-y-8">
              <div className="border-2 border-blue-500 p-8">
                <h2 className="text-3xl font-black mb-6 text-blue-500 flex items-center gap-2">
                  <Key size={32} /> API KEY SETUP
                </h2>
                <p className="text-lg mb-6">
                  Choose how you want to use the AI thinking partner:
                </p>
                
                {/* Free Tier Option */}
                <div className="bg-gray-800 border-2 border-gray-600 p-6 mb-4">
                  <h3 className="text-2xl font-black mb-3 text-yellow-500">Option 1: Free Tier (Quick Start)</h3>
                  <ul className="space-y-2 text-lg mb-4">
                    <li>✓ <strong>10 AI requests total</strong></li>
                    <li>✓ No API key required</li>
                    <li>✓ Perfect for trying out</li>
                    <li>✓ Start using immediately</li>
                  </ul>
                  <p className="text-gray-400 text-sm">Total lifetime limit - no reset</p>
                </div>

                {/* Own Key Option */}
                <div className="bg-gray-800 border-2 border-green-600 p-6 mb-6">
                  <h3 className="text-2xl font-black mb-3 text-green-500">Option 2: Your API Key (Recommended)</h3>
                  <ul className="space-y-2 text-lg mb-4">
                    <li>✓ <strong>Unlimited requests</strong></li>
                    <li>✓ Cost: ~$0.01-0.03 per conversation</li>
                    <li>✓ Full control over your usage</li>
                    <li>✓ Secure (stored in memory only)</li>
                  </ul>
                  
                  <div className="bg-black p-4 rounded mb-4">
                    <p className="text-sm font-bold text-blue-400 mb-2">🔗 How to get your API key:</p>
                    <ol className="text-sm space-y-1 list-decimal list-inside text-gray-300">
                      <li>Visit <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">console.anthropic.com</a></li>
                      <li>Sign up or log in to your account</li>
                      <li>Navigate to "API Keys" section</li>
                      <li>Click "Create Key" or "New API Key"</li>
                      <li>Copy the key (starts with "sk-ant-")</li>
                      <li>Paste it below</li>
                    </ol>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-bold">
                      Enter Your Anthropic API Key (Optional)
                    </label>
                    <input
                      type="password"
                      value=""
                      onChange={() => {}}
                      placeholder="Demo mode - see GitHub for live functionality"
                      className="w-full bg-gray-900 border-2 border-gray-700 p-3 text-lg font-mono opacity-50 cursor-not-allowed"
                      disabled={true}
                    />
                    <p className="text-xs text-gray-400">
                      Demo mode: To enable API key functionality, clone the repo and add your key.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setOnboardingStep(3)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-8 text-xl"
                >
                  ← Back
                </button>
                <button 
                  onClick={() => setCurrentView('dashboard')}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-black py-4 px-8 text-xl"
                >
                  Continue to Demo
                </button>
              </div>
              
              <div className="border-t-2 border-gray-700 pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  <p className="text-sm text-yellow-400 font-semibold">Demo Mode</p>
                </div>
                <p className="text-xs text-gray-400">
                  This is a UI mockup demonstrating the concept. The AI responses are simulated examples showing how the thinking partner would challenge and guide you through your thoughts.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    );
  }

  // Settings View
  if (currentView === 'settings') {
    return (
      <div className="min-h-screen bg-black text-white">
        <DemoBanner />
        
        <div className="p-8">
          <div className="fixed bottom-6 right-6 z-50">
          {copySuccess && (
            <div className="absolute bottom-full right-0 mb-2 bg-green-600 text-white px-4 py-2 rounded font-bold whitespace-nowrap">
              ✓ Copied to clipboard!
            </div>
          )}
          {showExportMenu && (
            <div className="absolute bottom-full right-0 mb-2 bg-gray-900 border-2 border-blue-500 rounded shadow-lg">
              <button 
                onClick={() => { exportData(); setShowExportMenu(false); }}
                className="block w-full text-left px-6 py-3 hover:bg-gray-800 font-bold border-b border-gray-700"
              >
                <FileDown size={18} className="inline mr-2" />
                Download File
              </button>
              <button 
                onClick={() => { copyDataToClipboard(); setShowExportMenu(false); }}
                className="block w-full text-left px-6 py-3 hover:bg-gray-800 font-bold"
              >
                📋 Copy to Clipboard
              </button>
            </div>
          )}
          <button 
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-4 rounded-full shadow-lg flex items-center gap-2"
          >
            <FileDown size={24} />
          </button>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-black">SETTINGS</h1>
            <button onClick={() => setCurrentView('dashboard')} className="bg-gray-800 hover:bg-gray-700 px-6 py-2 font-bold">
              Back
            </button>
          </div>
          {error && <div className="bg-red-900 border-2 border-red-600 p-4 mb-6"><p className="font-bold">{error}</p></div>}
          <div className="space-y-8">
            <div className="border-2 border-yellow-500 p-6">
              <h2 className="text-2xl font-black mb-4 text-yellow-500">AI CONFIGURATION</h2>
              {!editingPrompt ? (
                <div className="space-y-4">
                  <div className="bg-gray-900 p-4 max-h-40 overflow-y-auto">
                    <pre className="text-sm whitespace-pre-wrap">{aiPrompt.substring(0, 300)}...</pre>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => { setTempPrompt(aiPrompt); setEditingPrompt(true); }}
                      className="bg-yellow-600 hover:bg-yellow-700 px-6 py-2 font-bold flex items-center gap-2">
                      <Edit3 size={18} /> Edit
                    </button>
                    <button onClick={restoreDefaultPrompt}
                      className="bg-gray-700 hover:bg-gray-600 px-6 py-2 font-bold flex items-center gap-2">
                      <RotateCcw size={18} /> Restore Default
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <textarea value={tempPrompt} onChange={(e) => setTempPrompt(e.target.value)}
                    className="w-full bg-gray-900 border-2 border-gray-700 p-4 text-sm h-96 font-mono"/>
                  <div className="flex gap-3">
                    <button onClick={savePrompt} className="bg-green-600 hover:bg-green-700 px-6 py-2 font-bold flex items-center gap-2">
                      <Save size={18} /> Save
                    </button>
                    <button onClick={() => { setTempPrompt(aiPrompt); setEditingPrompt(false); }}
                      className="bg-gray-700 hover:bg-gray-600 px-6 py-2 font-bold flex items-center gap-2">
                      <X size={18} /> Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="border-2 border-gray-700 p-6">
              <h2 className="text-2xl font-black mb-4">DATA MANAGEMENT</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-3">Full Backup</h3>
                  <div className="flex gap-3">
                    <button onClick={exportData} className="bg-blue-600 hover:bg-blue-700 px-6 py-2 font-bold flex items-center gap-2">
                      <FileDown size={18} /> Export All
                    </button>
                    <label>
                      <span className="bg-blue-600 hover:bg-blue-700 px-6 py-2 font-bold cursor-pointer inline-flex items-center gap-2">
                        <FileUp size={18} /> Import All
                        <input type="file" accept=".json" onChange={importData} className="hidden" />
                      </span>
                    </label>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Facts Database</h3>
                  <div className="flex gap-3 flex-wrap">
                    <label>
                      <span className="bg-gray-700 hover:bg-gray-600 px-6 py-2 font-bold cursor-pointer inline-flex items-center gap-2">
                        <FileUp size={18} /> Import Facts
                        <input type="file" accept=".json" onChange={importFacts} className="hidden" />
                      </span>
                    </label>
                    <button onClick={exportFacts} className="bg-gray-700 hover:bg-gray-600 px-6 py-2 font-bold flex items-center gap-2">
                      <FileDown size={18} /> Export Facts
                    </button>
                    <button onClick={() => setShowDocs('facts')} className="bg-gray-700 hover:bg-gray-600 px-6 py-2 font-bold">
                      View Format
                    </button>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">Facts: {facts.length} entries</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Projects Database</h3>
                  <div className="flex gap-3 flex-wrap">
                    <label>
                      <span className="bg-gray-700 hover:bg-gray-600 px-6 py-2 font-bold cursor-pointer inline-flex items-center gap-2">
                        <FileUp size={18} /> Import Projects
                        <input type="file" accept=".json" onChange={importProjects} className="hidden" />
                      </span>
                    </label>
                    <button onClick={exportProjects} className="bg-gray-700 hover:bg-gray-600 px-6 py-2 font-bold flex items-center gap-2">
                      <FileDown size={18} /> Export Projects
                    </button>
                    <button onClick={() => setShowDocs('projects')} className="bg-gray-700 hover:bg-gray-600 px-6 py-2 font-bold">
                      View Format
                    </button>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">Projects: {projects.length} ({projects.filter(p => p.status === 'active').length} active)</p>
                </div>
              </div>
            </div>
            {showDocs && (
              <div className="border-2 border-blue-500 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-black text-blue-500">DOCUMENTATION</h2>
                  <button onClick={() => setShowDocs(false)} className="text-gray-400 hover:text-white">
                    <X size={24} />
                  </button>
                </div>
                {showDocs === 'facts' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold">Facts JSON Format</h3>
                    <pre className="bg-gray-900 p-4 overflow-x-auto text-sm">{JSON.stringify(EXAMPLE_FACTS, null, 2)}</pre>
                  </div>
                )}
                {showDocs === 'projects' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold">Projects JSON Format</h3>
                    <pre className="bg-gray-900 p-4 overflow-x-auto text-sm">{JSON.stringify(EXAMPLE_PROJECTS, null, 2)}</pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* API Key Modal - Removed for demo */}
      </div>
      </div>
    );
  }

  // Conversation View
  if (currentView === 'conversation') {
    return (
      <div className="min-h-screen bg-black text-white">
        <DemoBanner />
        
        <div className="p-8">
          <div className="fixed bottom-6 right-6 z-50">
          {copySuccess && (
            <div className="absolute bottom-full right-0 mb-2 bg-green-600 text-white px-4 py-2 rounded font-bold whitespace-nowrap">
              ✓ Copied to clipboard!
            </div>
          )}
          {showExportMenu && (
            <div className="absolute bottom-full right-0 mb-2 bg-gray-900 border-2 border-blue-500 rounded shadow-lg">
              <button 
                onClick={() => { exportData(); setShowExportMenu(false); }}
                className="block w-full text-left px-6 py-3 hover:bg-gray-800 font-bold border-b border-gray-700"
              >
                <FileDown size={18} className="inline mr-2" />
                Download File
              </button>
              <button 
                onClick={() => { copyDataToClipboard(); setShowExportMenu(false); }}
                className="block w-full text-left px-6 py-3 hover:bg-gray-800 font-bold"
              >
                📋 Copy to Clipboard
              </button>
            </div>
          )}
          <button 
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-4 rounded-full shadow-lg flex items-center gap-2"
          >
            <FileDown size={24} />
          </button>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-black">
              {currentProjectId ? projects.find(p => p.id === currentProjectId)?.title : 'New Thought'}
            </h1>
            <div className="flex gap-3">
              {currentProjectId && (
                <button onClick={() => {
                  const project = projects.find(p => p.id === currentProjectId);
                  const action = prompt(`Current: ${project.status}\n\nChange to:\n1. active\n2. parked\n3. completed\n\nEnter number:`);
                  if (action === '1') updateProjectStatus(currentProjectId, 'active');
                  if (action === '2') updateProjectStatus(currentProjectId, 'parked');
                  if (action === '3') updateProjectStatus(currentProjectId, 'completed');
                }} className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 font-bold text-sm">
                  Change Status
                </button>
              )}
              {!currentProjectId && currentMessages.length > 0 && (
                <button onClick={createProject} className="bg-green-600 hover:bg-green-700 px-4 py-2 font-bold text-sm">
                  Track as Project
                </button>
              )}
              <button onClick={() => setCurrentView('dashboard')} className="bg-gray-800 hover:bg-gray-700 px-6 py-2 font-bold">
                Back
              </button>
            </div>
          </div>
          
          {/* Demo Notice */}
          <div className="bg-blue-500 bg-opacity-10 border-2 border-blue-500 p-3 mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-blue-400" />
            <div>
              <p className="font-bold text-sm text-blue-400">Demo Mode</p>
              <p className="text-xs text-gray-400">AI responses are simulated examples</p>
            </div>
          </div>
          
          {error && <div className="bg-red-900 border-2 border-red-600 p-4 mb-6"><p className="font-bold">{error}</p></div>}
          <div className="space-y-6 mb-6">
            {currentMessages.map((msg, idx) => (
              <div key={idx} className={`p-6 border-2 ${msg.role === 'user' ? 'border-blue-500 bg-blue-500 bg-opacity-10' : 'border-yellow-500 bg-yellow-500 bg-opacity-10'}`}>
                <div className="font-black text-sm mb-2 text-gray-400">{msg.role === 'user' ? 'YOU' : 'AI THINKING PARTNER'}</div>
                <div className="prose prose-invert max-w-none">
                  {msg.content.split('\n').map((line, i) => {
                    if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold mt-4 mb-2">{line.substring(4)}</h3>;
                    if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold mt-4 mb-2">{line.substring(3)}</h2>;
                    if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold mt-4 mb-2">{line.substring(2)}</h1>;
                    
                    const boldRegex = /\*\*(.+?)\*\*/g;
                    const parts = [];
                    let lastIndex = 0;
                    let match;
                    
                    while ((match = boldRegex.exec(line)) !== null) {
                      if (match.index > lastIndex) {
                        parts.push(line.substring(lastIndex, match.index));
                      }
                      parts.push(<strong key={`bold-${i}-${match.index}`}>{match[1]}</strong>);
                      lastIndex = match.index + match[0].length;
                    }
                    
                    if (lastIndex < line.length) {
                      parts.push(line.substring(lastIndex));
                    }
                    
                    if (line.trim() === '') return <br key={i} />;
                    if (line.trim().startsWith('- ')) {
                      return <li key={i} className="ml-4">{line.substring(line.indexOf('- ') + 2)}</li>;
                    }
                    
                    return <p key={i} className="mb-2">{parts.length > 0 ? parts : line}</p>;
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <textarea value={userInput} onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && e.ctrlKey) handleSendMessage(); }}
              placeholder="Demo mode - see GitHub to enable functionality"
              className="w-full bg-gray-900 border-2 border-gray-700 p-4 text-lg h-40 resize-y opacity-50 cursor-not-allowed" disabled={true}/>
            <div className="relative">
              <button 
                disabled={true}
                className="w-full bg-gray-400 text-gray-600 font-black py-4 px-8 text-xl cursor-not-allowed"
                title="Demo mode - see GitHub to enable"
              >
                Send Message (Demo Mode)
              </button>
            </div>
          </div>
        </div>
        
        {/* API Key Modal - Removed for demo */}
      </div>
      </div>
    );
  }

  // Projects List View
  // Projects List View
  if (currentView === 'projectsList') {
    const activeProjects = projects.filter(p => p.status === 'active');
    const parkedProjects = projects.filter(p => p.status === 'parked');
    const completedProjects = projects.filter(p => p.status === 'completed');
    return (
      <div className="min-h-screen bg-black text-white">
        <DemoBanner />
        
        <div className="p-8">
          <div className="fixed bottom-6 right-6 z-50">
          {copySuccess && (
            <div className="absolute bottom-full right-0 mb-2 bg-green-600 text-white px-4 py-2 rounded font-bold whitespace-nowrap">
              ✓ Copied to clipboard!
            </div>
          )}
          {showExportMenu && (
            <div className="absolute bottom-full right-0 mb-2 bg-gray-900 border-2 border-blue-500 rounded shadow-lg">
              <button 
                onClick={() => { exportData(); setShowExportMenu(false); }}
                className="block w-full text-left px-6 py-3 hover:bg-gray-800 font-bold border-b border-gray-700"
              >
                <FileDown size={18} className="inline mr-2" />
                Download File
              </button>
              <button 
                onClick={() => { copyDataToClipboard(); setShowExportMenu(false); }}
                className="block w-full text-left px-6 py-3 hover:bg-gray-800 font-bold"
              >
                📋 Copy to Clipboard
              </button>
            </div>
          )}
          <button 
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-4 rounded-full shadow-lg flex items-center gap-2"
          >
            <FileDown size={24} />
          </button>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-black">YOUR THOUGHTS</h1>
            <button onClick={() => setCurrentView('dashboard')} className="bg-gray-800 hover:bg-gray-700 px-6 py-2 font-bold">Back</button>
          </div>
          {projects.length === 0 ? (
            <div className="border-2 border-gray-700 p-8 text-center">
              <p className="text-xl text-gray-400">No thoughts tracked yet.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {activeProjects.length > 0 && (
                <div>
                  <h2 className="text-2xl font-black mb-4 text-green-500">
                    ACTIVE ({activeProjects.length})
                    {activeProjects.length >= 10 && <span className="text-yellow-500 text-lg ml-3">⚠️ Getting crowded</span>}
                  </h2>
                  <div className="space-y-3">
                    {activeProjects.map(project => (
                      <div key={project.id} onClick={() => openExistingThought(project.id)}
                        className="border-2 border-green-500 p-4 hover:bg-green-500 hover:bg-opacity-10 cursor-pointer">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold">{project.title}</h3>
                            {project.definition_of_done && <p className="text-sm text-gray-400 mt-1">DoD: {project.definition_of_done}</p>}
                            {project.pattern_flags && project.pattern_flags.length > 0 && (
                              <div className="flex gap-2 mt-2">
                                {project.pattern_flags.map(flag => (
                                  <span key={flag} className="bg-red-600 text-xs px-2 py-1 font-bold">{flag}</span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="text-right text-sm text-gray-400">
                            <p>Last: {new Date(project.last_accessed_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {parkedProjects.length > 0 && (
                <div>
                  <h2 className="text-2xl font-black mb-4 text-yellow-500">PARKED ({parkedProjects.length})</h2>
                  <div className="space-y-3">
                    {parkedProjects.map(project => (
                      <div key={project.id} onClick={() => openExistingThought(project.id)}
                        className="border-2 border-yellow-500 p-4 hover:bg-yellow-500 hover:bg-opacity-10 cursor-pointer">
                        <h3 className="text-xl font-bold">{project.title}</h3>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {completedProjects.length > 0 && (
                <div>
                  <h2 className="text-2xl font-black mb-4 text-blue-500">ACTUALLY FINISHED ({completedProjects.length}) 🎉</h2>
                  <div className="space-y-3">
                    {completedProjects.map(project => (
                      <div key={project.id} onClick={() => openExistingThought(project.id)}
                        className="border-2 border-blue-500 p-4 hover:bg-blue-500 hover:bg-opacity-10 cursor-pointer">
                        <h3 className="text-xl font-bold">{project.title}</h3>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* API Key Modal - Removed for demo */}
      </div>
      </div>
    );
  }

  // Dashboard View
  return (
    <div className="min-h-screen bg-black text-white">
      <DemoBanner />
      
      <div className="p-8">
        <div className="fixed bottom-6 right-6 z-50">
        {copySuccess && (
          <div className="absolute bottom-full right-0 mb-2 bg-green-600 text-white px-4 py-2 rounded font-bold whitespace-nowrap">
            ✓ Copied to clipboard!
          </div>
        )}
        {showExportMenu && (
          <div className="absolute bottom-full right-0 mb-2 bg-gray-900 border-2 border-blue-500 rounded shadow-lg">
            <button 
              onClick={() => { exportData(); setShowExportMenu(false); }}
              className="block w-full text-left px-6 py-3 hover:bg-gray-800 font-bold border-b border-gray-700"
            >
              <FileDown size={18} className="inline mr-2" />
              Download File
            </button>
            <button 
              onClick={() => { copyDataToClipboard(); setShowExportMenu(false); }}
              className="block w-full text-left px-6 py-3 hover:bg-gray-800 font-bold"
            >
              📋 Copy to Clipboard
            </button>
          </div>
        )}
        <button 
          onClick={() => alert('Demo: This would export your data and conversations. Clone the repo to enable data management!')}
          className="bg-gray-600 hover:bg-gray-500 text-white font-bold p-4 rounded-full shadow-lg flex items-center gap-2 opacity-75"
          title="Demo mode - see GitHub to enable"
        >
          <FileDown size={24} />
        </button>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-black">Welcome back, {userName}.</h1>
            <p className="text-gray-400 mt-2">Last check-in: {new Date(lastCheckIn).toLocaleString()}</p>
          </div>
          <button onClick={() => alert('Demo: This would open settings to customize prompts and export data. Clone the repo to enable!')}
            className="bg-gray-800 hover:bg-gray-700 px-6 py-2 font-bold flex items-center gap-2 opacity-75"
            title="Demo mode - see GitHub to enable">
            <Settings size={20} /> Settings (Demo)
          </button>
        </div>
        {error && <div className="bg-red-900 border-2 border-red-600 p-4 mb-6"><p className="font-bold">{error}</p></div>}
        <div className="grid grid-cols-1 gap-6 mb-8">
          <div className="border-2 border-gray-700 p-6">
            <h2 className="text-2xl font-black mb-2">YOUR STATUS</h2>
            <div className="flex gap-6 text-lg">
              <div><span className="text-green-500 font-black">{projects.filter(p => p.status === 'active').length}</span><span className="text-gray-400"> Active</span></div>
              <div><span className="text-yellow-500 font-black">{projects.filter(p => p.status === 'parked').length}</span><span className="text-gray-400"> Parked</span></div>
              <div><span className="text-blue-500 font-black">{projects.filter(p => p.status === 'completed').length}</span><span className="text-gray-400"> Completed</span></div>
            </div>
          </div>
          
          {/* API Key Status */}
          <div className="border-2 border-blue-500 p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-black mb-2 flex items-center gap-2">
                  <Key size={24} /> API STATUS
                </h2>
                {userApiKey ? (
                  <div>
                    <p className="text-green-500 font-bold text-lg">✓ Using your API key (unlimited)</p>
                    <p className="text-sm text-gray-400 mt-1">Your key is secure in memory</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-yellow-500 font-bold text-lg">Using Free Tier</p>
                    {rateLimitInfo && rateLimitInfo.usingSharedKey && (
                      <p className="text-sm text-gray-400 mt-1">
                        {rateLimitInfo.remaining}/{rateLimitInfo.limit} requests remaining (total lifetime limit)
                      </p>
                    )}
                  </div>
                )}
              </div>
              <button
                onClick={() => alert('Demo: This would let you add your own API key for unlimited access. Clone the repo to enable!')}
                className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 flex items-center gap-2 opacity-75"
                title="Demo mode - see GitHub to enable"
              >
                <Key size={18} />
                API Key (Demo)
              </button>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <button onClick={() => alert('Demo: This would start a new AI conversation. Clone the repo and add your API key to enable!')}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-black py-6 px-8 text-2xl flex items-center justify-center gap-3 opacity-75"
            title="Demo mode - see GitHub to enable">
            <MessageSquare size={28} /> Start a New Thought (Demo)
          </button>
          <button onClick={() => alert('Demo: This would show your existing conversations and projects. Clone the repo to enable!')}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-black py-6 px-8 text-2xl flex items-center justify-center gap-3 opacity-75"
            title="Demo mode - see GitHub to enable">
            <List size={28} /> Review Existing Thoughts (Demo)
          </button>
          <button onClick={() => alert('Demo: This would start an AI-guided daily check-in. Clone the repo and add your API key to enable!')}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-black py-6 px-8 text-2xl flex items-center justify-center gap-3 opacity-75"
            title="Demo mode - see GitHub to enable">
            <Calendar size={28} /> Daily Check-In (Demo)
          </button>
        </div>
        <div className="mt-8 border-2 border-red-600 p-4 bg-red-600 bg-opacity-10">
          <p className="text-sm text-gray-300">
            <strong className="text-red-500">REMINDER:</strong> Export your data regularly using the blue button (bottom-right)!
          </p>
        </div>
      </div>
      
      {/* API Key Modal - Removed for demo */}
    </div>
    </div>
  );
}

export default App;
