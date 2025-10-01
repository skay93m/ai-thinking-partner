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
      value: "At 17, achieved high grades but faced rejection that shattered identity. Spent years chasing credentials to prove worth.",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      category: "context",
      key: "adhd_traits",
      value: "ADHD makes novelty more rewarding than sustained effort. When things get boring/hard, triggers old wounds.",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      category: "pattern",
      key: "project_switching",
      value: "Tends to abandon projects when they require sustained effort or when initial excitement wears off.",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      category: "strength",
      key: "rapid_learning",
      value: "Exceptional at quickly grasping new concepts and making creative connections between ideas.",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]
};

const EXAMPLE_PROJECTS = {
  projects: [
    {
      id: "demo-1",
      title: "AI Thinking Partner App",
      status: "active",
      definition_of_done: "Build a working app that helps challenge my thought patterns and provides brutally honest feedback",
      progress_notes: "Making good progress on UI. Need to focus on AI integration next. Resisting urge to add too many features.",
      pattern_flags: ["scope_creep_risk"],
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      last_accessed_at: new Date().toISOString(),
      completed_at: null
    },
    {
      id: "demo-2", 
      title: "Learn React Native",
      status: "parked",
      definition_of_done: "Build one complete mobile app and understand the ecosystem",
      progress_notes: "Started with enthusiasm but got stuck on navigation. Parking until I finish current web project.",
      pattern_flags: ["shiny_object_syndrome", "difficulty_avoidance"],
      created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      last_accessed_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      completed_at: null
    },
    {
      id: "demo-3",
      title: "Morning Routine Optimization",
      status: "completed",
      definition_of_done: "Maintain consistent 6am wake-up for 30 days with energizing routine",
      progress_notes: "Successfully built habit! Key was linking it to coffee and immediate small win.",
      pattern_flags: [],
      created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      last_accessed_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      completed_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "demo-4",
      title: "Side Hustle: Design Consulting", 
      status: "active",
      definition_of_done: "Land 3 paying clients and generate $2000 in revenue",
      progress_notes: "Got first client! Working on portfolio site. Need to resist perfectionism and just ship.",
      pattern_flags: ["perfectionism"],
      created_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      last_accessed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      completed_at: null
    },
    {
      id: "demo-5",
      title: "Master TypeScript",
      status: "parked", 
      definition_of_done: "Feel confident using advanced TS features in production",
      progress_notes: "Got overwhelmed by generic constraints. Will revisit after gaining more JS experience.",
      pattern_flags: ["depth_avoidance", "comparison_trigger"],
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      last_accessed_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      completed_at: null
    }
  ]
};

const DEMO_CONVERSATIONS = [
  {
    id: "conv-1",
    projectId: "demo-1",
    messages: [
      {
        role: "user",
        content: "I want to build an AI thinking partner that challenges my ADHD patterns. I keep starting projects but never finishing them."
      },
      {
        role: "assistant", 
        content: "Interesting timing on this thought. You say you 'never finish' projects, but you're currently planning to start another one. Let's dig into this pattern first.\n\nWhat happened with the last 3 projects you abandoned? Not just 'I got bored' - what was the specific moment you stopped working on each one?"
      },
      {
        role: "user",
        content: "Well, the React Native thing got hard when I couldn't figure out navigation. The TypeScript project felt overwhelming with all the advanced concepts. And I stopped the design course when I saw someone younger than me already doing amazing work."
      },
      {
        role: "assistant",
        content: "Now we're getting somewhere. I see three different triggers here:\n\n1. **Technical difficulty** (React Native navigation)\n2. **Cognitive overload** (TypeScript complexity) \n3. **Comparison wound** (younger designer)\n\nHere's the brutal truth: You're not actually quitting because of ADHD. You're quitting because these projects are triggering a core wound around not being 'good enough.' \n\nThe ADHD brain seeking novelty is just the convenient excuse. The real pattern is: when something challenges your identity as competent, you flee to something new where you can feel smart again.\n\nSo before we build another 'solution,' what if this AI thinking partner idea is just another way to avoid dealing with the fact that you stop when things get real?"
      },
      {
        role: "user",
        content: "Ouch. That hits hard because... you're probably right. I do feel smart when I'm learning something new, and then when it gets difficult I start doubting myself. But isn't this different? I mean, I'm trying to solve the actual problem."
      },
      {
        role: "assistant",
        content: "I hear you saying 'isn't this different?' - that's exactly what you told yourself about the React Native project, the TypeScript learning, and the design course. Each time felt like 'solving the actual problem.'\n\nThe pattern isn't about the projects themselves. It's about what happens when your competence gets challenged. You're incredibly good at the beginning phases - research, planning, initial excitement. But when you hit the 'messy middle' where you're not immediately good at something, that 17-year-old wounded part of you panics.\n\nSo here's my challenge: What if instead of building a tool to 'solve' your pattern, you committed to finishing ONE of your abandoned projects first? Prove to yourself you can push through the discomfort of not being immediately competent.\n\nWhich one scares you the most to go back to?"
      },
      {
        role: "user", 
        content: "The React Native one. I spent two weeks on that navigation issue and felt so stupid. Every tutorial seemed to assume knowledge I didn't have."
      },
      {
        role: "assistant",
        content: "Perfect. You just identified your growth edge. That 'feeling stupid' is exactly the sensation you've been running from your whole life.\n\nHere's what's really happening: Your ADHD brain is wired to seek novelty and avoid sustained effort on difficult things. But underneath that, there's a 17-year-old who learned that 'not getting it immediately' means 'I'm not good enough.'\n\nReact Native navigation isn't the real problem. The real problem is you've never learned to sit with feeling incompetent long enough to become competent.\n\nSo here's my proposal: Before you build one more 'solution,' go back to that React Native project. Spend one hour on it. Not to solve it, but to practice feeling stupid without running away. Can you do that?"
      }
    ],
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "conv-2", 
    projectId: "demo-4",
    messages: [
      {
        role: "user",
        content: "Got my first design client! But now I'm spending way too much time perfecting my portfolio site instead of just launching it."
      },
      {
        role: "assistant",
        content: "Congratulations on the client! Now let's talk about this portfolio perfectionism.\n\nYou already have a paying client, which means your work is good enough to generate revenue. Yet you're polishing a portfolio instead of serving that client or finding the next one.\n\nWhat's really happening here? Are you afraid that if you launch an 'imperfect' portfolio, you'll be exposed as a fraud? Or is perfectionism a way to delay the scary work of actually running a business?\n\nHere's a reality check: Your portfolio's job is to get you clients, not win design awards. You literally already have proof it works.\n\nWhat would happen if you launched it today, exactly as it is?"
      },
      {
        role: "user",
        content: "I guess... people might think I'm not as good as I seem? The client hired me based on some rough work I showed them, but the portfolio feels like it needs to be more polished to represent me 'officially.'"
      },
      {
        role: "assistant", 
        content: "There it is. 'Not as good as I seem' - that's the fear driving this whole perfectionism spiral.\n\nLet me get brutal for a second: You're not actually perfecting the portfolio. You're procrastinating on business development because that's where the real rejection risk lives. \n\nEvery hour you spend tweaking fonts and adjusting margins is an hour you're not:\n- Reaching out to potential clients\n- Delivering excellence to your current client  \n- Building systems to handle more work\n\nYour ADHD brain loves the 'perfecting' work because it feels productive but doesn't risk real failure. But here's the thing: your rough work already got you paid. That's more validation than any perfect portfolio will ever give you.\n\nSo what are you really avoiding by hiding behind portfolio perfectionism?"
      }
    ],
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  }
];

// Demo prompts for guided typing simulation
const DEMO_PROMPTS = [
  "I've been thinking about starting a new project but I'm worried I'll abandon it like the others...",
  "I keep procrastinating on this important task and I don't understand why.",
  "I got some feedback today that really bothered me and I can't stop thinking about it.",
  "I want to make a major life change but I'm scared of making the wrong decision.",
  "I've been comparing myself to others a lot lately and it's making me feel terrible.",
  "I'm excited about this new opportunity but I keep finding reasons to delay starting.",
  "I finished something important but instead of celebrating, I'm already worried about the next thing."
];

function App() {
  const [currentView, setCurrentView] = useState('onboarding');
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [facts, setFacts] = useState(EXAMPLE_FACTS.facts);
  const [projects, setProjects] = useState(EXAMPLE_PROJECTS.projects);
  const [conversations, setConversations] = useState(DEMO_CONVERSATIONS);
  const [aiPrompt, setAiPrompt] = useState(DEFAULT_PROMPT);
  const [promptHistory, setPromptHistory] = useState([
    { prompt: DEFAULT_PROMPT, timestamp: new Date().toISOString(), label: 'Original' }
  ]);
  const [lastCheckIn, setLastCheckIn] = useState(new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
  const [userName, setUserName] = useState('Demo User');
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
  
  // API Key Management - Simulated for demo
  const [userApiKey, setUserApiKey] = useState('');
  const [rateLimitInfo, setRateLimitInfo] = useState({ 
    usingSharedKey: true, 
    remaining: 10, 
    limit: 10 
  });

  // Typing simulation state
  const [showTypingDemo, setShowTypingDemo] = useState(false);
  const [currentTypingText, setCurrentTypingText] = useState('');
  const [typingIndex, setTypingIndex] = useState(0);
  const [selectedPrompt, setSelectedPrompt] = useState('');
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
        const existingConv = conversations.find(c => c.projectId === currentProjectId);
        if (existingConv) {
          setConversations(conversations.map(c => 
            c.projectId === currentProjectId ? { ...c, messages: newMessages } : c
          ));
        } else {
          setConversations([...conversations, {
            id: `conv-${Date.now()}`,
            projectId: currentProjectId,
            messages: newMessages,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
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

  // Typing simulation functions
  const startTypingDemo = (promptText) => {
    setSelectedPrompt(promptText);
    setShowTypingDemo(true);
    setCurrentTypingText('');
    setTypingIndex(0);
    
    // Start the typing effect
    const typeText = () => {
      let index = 0;
      const typingInterval = setInterval(() => {
        if (index < promptText.length) {
          setCurrentTypingText(promptText.slice(0, index + 1));
          setTypingIndex(index + 1);
          index++;
        } else {
          clearInterval(typingInterval);
          // Auto-send after typing is complete
          setTimeout(() => {
            const newMessages = [...currentMessages, { role: 'user', content: promptText }];
            sendMessageToClaude(newMessages);
            setUserInput('');
            setShowTypingDemo(false);
            setCurrentTypingText('');
          }, 500);
        }
      }, 50 + Math.random() * 100); // Variable typing speed for realism
    };
    
    setTimeout(typeText, 500); // Small delay before starting
  };

  const cancelTypingDemo = () => {
    setShowTypingDemo(false);
    setCurrentTypingText('');
    setSelectedPrompt('');
    setTypingIndex(0);
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
    const conv = conversations.find(c => c.projectId === projectId);
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
          <div className="bg-purple-500 bg-opacity-10 border-2 border-purple-500 p-3 mb-4 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-purple-400" />
            <div>
              <p className="font-bold text-sm text-purple-400">Interactive AI Demo</p>
              <p className="text-xs text-gray-400">Click suggested prompts or type your own - get realistic AI responses</p>
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
          
          {showTypingDemo ? (
            <div className="space-y-4">
              <div className="bg-gray-900 border-2 border-blue-500 p-4 text-lg h-40 relative">
                <div className="absolute top-2 right-2">
                  <button 
                    onClick={cancelTypingDemo}
                    className="text-gray-400 hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="text-gray-300">
                  {currentTypingText}
                  <span className="animate-pulse text-blue-400">|</span>
                </div>
              </div>
              <div className="text-center text-gray-400 text-sm">
                <span className="animate-pulse">⌨️ Simulating typing...</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-900 border-2 border-gray-700 p-4 rounded">
                <h3 className="text-lg font-bold mb-3 text-blue-400">Try one of these prompts:</h3>
                <div className="grid grid-cols-1 gap-2">
                  {DEMO_PROMPTS.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => startTypingDemo(prompt)}
                      className="text-left bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-blue-500 p-3 rounded text-sm transition-colors"
                    >
                      "{prompt}"
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="text-center text-gray-500 text-sm">
                <p>Click any prompt above to see the AI thinking partner in action</p>
              </div>
              
              <div className="bg-gray-800 border border-gray-600 p-3 rounded">
                <p className="text-sm text-gray-400 mb-2">Or type your own:</p>
                <textarea 
                  value={userInput} 
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && e.ctrlKey) handleSendMessage(); }}
                  placeholder="Share what's on your mind... (Ctrl+Enter to send)"
                  className="w-full bg-gray-900 border border-gray-600 p-3 text-sm h-20 resize-none"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={!userInput.trim() || isLoading}
                  className={`w-full mt-2 font-bold py-2 px-4 text-sm ${
                    !userInput.trim() || isLoading 
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {isLoading ? 'AI is thinking...' : 'Send Your Thought'}
                </button>
              </div>
            </div>
          )}
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
          onClick={() => setShowExportMenu(!showExportMenu)}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold p-4 rounded-full shadow-lg flex items-center gap-2"
          title="Export your data and conversations"
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
          <button onClick={() => setCurrentView('settings')}
            className="bg-gray-800 hover:bg-gray-700 px-6 py-2 font-bold flex items-center gap-2"
            title="Configure AI prompts and export data">
            <Settings size={20} /> Settings
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
          <button onClick={() => {
            setCurrentProjectId(null);
            setCurrentMessages([]);
            setCurrentView('conversation');
          }}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-6 px-8 text-2xl flex items-center justify-center gap-3">
            <MessageSquare size={28} /> Start a New Thought
          </button>
          <button onClick={() => setCurrentView('projectsList')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-6 px-8 text-2xl flex items-center justify-center gap-3">
            <List size={28} /> Review Existing Thoughts
          </button>
          <button onClick={() => {
            const activeCount = projects.filter(p => p.status === 'active').length;
            const daysSinceCheckIn = Math.floor((Date.now() - new Date(lastCheckIn).getTime()) / (1000 * 60 * 60 * 24));
            
            let checkInPrompt = `Daily check-in.\n\n`;
            if (daysSinceCheckIn > 1) {
              checkInPrompt += `Haven't checked in for ${daysSinceCheckIn} days. What's been going on?\n\n`;
            }
            if (activeCount >= 3) {
              checkInPrompt += `You're juggling ${activeCount} active thoughts. Want to synthesize?\n\n`;
            }
            checkInPrompt += `Quick pulse check on active projects:\n${projects.filter(p => p.status === 'active').map(p => `- ${p.title}`).join('\n')}`;
            
            setCurrentProjectId(null);
            setCurrentMessages([
              { role: 'user', content: checkInPrompt }
            ]);
            setCurrentView('conversation');
            sendMessageToClaude([{ role: 'user', content: checkInPrompt }]);
            setLastCheckIn(new Date().toISOString());
          }}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-black py-6 px-8 text-2xl flex items-center justify-center gap-3">
            <Calendar size={28} /> Daily Check-In
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
