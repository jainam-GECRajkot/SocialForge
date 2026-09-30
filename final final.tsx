import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, FileText, Settings, Tags, CheckCircle2, AlertTriangle, 
  ChevronRight, ChevronLeft, Upload, Loader2, Copy, RefreshCw, 
  Smartphone, Monitor, Zap, Hash, AtSign, AlignLeft, Layout, 
  Instagram, Facebook, Linkedin, Twitter, Youtube, MessageCircle, Play,
  Plus, X, Share2, Download, Image as ImageIcon, Video, Trash2
} from 'lucide-react';

// --- CONSTANTS & DEFAULT DATA ---

const DEFAULT_TAGTITLES = [
  {
    id: '1',
    keyword: 'TECH',
    name: 'Tech & Innovation Style',
    prompt: 'Write energetic but intelligent technology-event content. Sound like a student technologist speaking naturally. Avoid corporate clichés. Use concise hooks, modern language and subtle technical vocabulary.',
    tone: 'Technical & Energetic'
  },
  {
    id: '2',
    keyword: 'COLLEGE',
    name: 'Campus Life Style',
    prompt: 'Create youthful college-event content. Energetic, social and welcoming, but not childish. Emphasize participation, memories, achievement and community.',
    tone: 'Youthful & Friendly'
  },
  {
    id: '3',
    keyword: 'PROFESSIONAL',
    name: 'Corporate & Networking',
    prompt: 'Use polished professional communication suitable for LinkedIn. Focus on knowledge, outcomes, collaboration and credibility. Maintain a respectful and authoritative voice.',
    tone: 'Professional'
  }
];

const DEMO_EVENT = {
  name: 'Tech Arena 2026 Phase 2',
  description: 'After the excitement of Phase 1, we’re bringing another day packed with technology, competition, creativity and community. Includes Hackathons, Tech Quizzes, and a Surprise Guest Speaker.',
  date: '5 December 2026',
  time: '10:00 AM',
  venue: 'Christ College, Rajkot',
  audience: 'College students, developers, tech enthusiasts',
  handles: '@ChristCollegeRajkot @TechArena',
  tone: 'Energetic',
  language: 'English',
  media: [
    { id: 1, type: 'image', description: 'Main event poster with big bold text' },
    { id: 2, type: 'image', description: 'Action shot of students collaborating from last year' }
  ]
};

const PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-600' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' },
  { id: 'threads', name: 'Threads', icon: AtSign, color: 'text-neutral-100' },
  { id: 'x', name: 'X (Twitter)', icon: Twitter, color: 'text-neutral-100' },
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'text-red-500' }
];

// --- MAIN APPLICATION COMPONENT ---

export default function SocialForgeApp() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [tagTitles, setTagTitles] = useState(DEFAULT_TAGTITLES);
  const [savedCampaigns, setSavedCampaigns] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Generator State
  const [eventData, setEventData] = useState({
    name: '', description: '', date: '', time: '', venue: '', 
    audience: '', handles: '', tone: 'Energetic', language: 'English',
    media: [{ id: Date.now(), type: 'image', description: '' }]
  });
  const [selectedTagTitles, setSelectedTagTitles] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState(['instagram', 'linkedin', 'x']);
  const [generatedResults, setGeneratedResults] = useState(null);

  // Load from local storage
  useEffect(() => {
    const savedTags = localStorage.getItem('socialforge_tags');
    if (savedTags) setTagTitles(JSON.parse(savedTags));
    
    const savedCamps = localStorage.getItem('socialforge_campaigns');
    if (savedCamps) setSavedCampaigns(JSON.parse(savedCamps));
  }, []);

  const loadDemo = () => {
    setEventData(DEMO_EVENT);
    setCurrentScreen('generate');
  };

  const resetGenerator = () => {
    setEventData({
      name: '', description: '', date: '', time: '', venue: '', 
      audience: '', handles: '', tone: 'Energetic', language: 'English',
      media: [{ id: Date.now(), type: 'image', description: '' }]
    });
    setSelectedTagTitles([]);
    setGeneratedResults(null);
    setCurrentScreen('generate');
  };

  return (
    <div className={`flex h-screen overflow-hidden font-sans transition-colors duration-300 ${isDarkMode ? 'bg-neutral-950 text-neutral-100' : 'bg-neutral-50 text-neutral-900'}`}>
      
      {/* SIDEBAR NAVIGATION (Desktop) */}
      <aside className={`hidden md:flex flex-col w-64 border-r ${isDarkMode ? 'border-neutral-800 bg-neutral-900/50' : 'border-neutral-200 bg-white'}`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Zap className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">SocialForge</h1>
              <p className="text-[10px] uppercase tracking-widest opacity-60 font-semibold">AI Architect</p>
            </div>
          </div>

          <nav className="space-y-2">
            <NavItem icon={Home} label="Home" active={currentScreen === 'home'} onClick={() => setCurrentScreen('home')} />
            <NavItem icon={Play} label="Generate" active={currentScreen === 'generate' || currentScreen === 'results'} onClick={() => setCurrentScreen('generate')} />
            <NavItem icon={Tags} label="TagTitles" active={currentScreen === 'tags'} onClick={() => setCurrentScreen('tags')} />
            <NavItem icon={Layout} label="Saved Campaigns" active={currentScreen === 'saved'} onClick={() => setCurrentScreen('saved')} />
          </nav>
        </div>
        <div className="mt-auto p-6">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-colors ${isDarkMode ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'}`}
          >
            {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto relative custom-scrollbar">
        {currentScreen === 'home' && <ScreenHome onGenerate={resetGenerator} onDemo={loadDemo} savedCount={savedCampaigns.length} tagCount={tagTitles.length} isDark={isDarkMode} />}
        {currentScreen === 'tags' && <ScreenTagTitles tagTitles={tagTitles} setTagTitles={setTagTitles} isDark={isDarkMode} />}
        {currentScreen === 'generate' && (
          <ScreenWizard 
            eventData={eventData} setEventData={setEventData}
            tagTitles={tagTitles} selectedTagTitles={selectedTagTitles} setSelectedTagTitles={setSelectedTagTitles}
            selectedPlatforms={selectedPlatforms} setSelectedPlatforms={setSelectedPlatforms}
            onComplete={(results) => {
              setGeneratedResults(results);
              setCurrentScreen('results');
            }}
            isDark={isDarkMode}
          />
        )}
        {currentScreen === 'results' && (
          <ScreenResults 
            results={generatedResults} 
            eventData={eventData}
            isDark={isDarkMode} 
            onBack={() => setCurrentScreen('generate')}
            onSave={() => {
              const newCampaign = { id: Date.now(), name: eventData.name, date: new Date().toISOString(), platforms: Object.keys(generatedResults.platforms).length };
              const updated = [newCampaign, ...savedCampaigns];
              setSavedCampaigns(updated);
              localStorage.setItem('socialforge_campaigns', JSON.stringify(updated));
              alert('Campaign saved to local storage!');
            }}
          />
        )}
        {currentScreen === 'saved' && (
          <div className="p-8 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Saved Campaigns</h2>
            {savedCampaigns.length === 0 ? (
               <div className={`p-12 text-center rounded-2xl border border-dashed ${isDarkMode ? 'border-neutral-800 bg-neutral-900/30 text-neutral-500' : 'border-neutral-300 bg-neutral-50 text-neutral-400'}`}>
                 No campaigns saved yet. Generate one to see it here!
               </div>
            ) : (
              <div className="grid gap-4">
                {savedCampaigns.map(c => (
                  <div key={c.id} className={`p-6 rounded-2xl border flex justify-between items-center ${isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'}`}>
                    <div>
                      <h3 className="font-bold text-lg">{c.name}</h3>
                      <p className="text-sm opacity-60">Generated on {new Date(c.date).toLocaleDateString()} • {c.platforms} platforms</p>
                    </div>
                    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors">View</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* MOBILE BOTTOM NAV */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 border-t flex justify-around p-3 z-50 ${isDarkMode ? 'bg-neutral-950/90 border-neutral-800 backdrop-blur-md' : 'bg-white/90 border-neutral-200 backdrop-blur-md'}`}>
        <MobileNavItem icon={Home} label="Home" active={currentScreen === 'home'} onClick={() => setCurrentScreen('home')} />
        <MobileNavItem icon={Play} label="Generate" active={currentScreen === 'generate' || currentScreen === 'results'} onClick={() => setCurrentScreen('generate')} />
        <MobileNavItem icon={Tags} label="Tags" active={currentScreen === 'tags'} onClick={() => setCurrentScreen('tags')} />
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: ${isDarkMode ? '#333' : '#ccc'}; border-radius: 10px; }
      `}} />
    </div>
  );
}

// --- SUB-COMPONENTS ---

function NavItem({ icon: Icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${active ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'hover:bg-neutral-800/50 hover:text-white text-neutral-400'}`}>
      <Icon className="w-5 h-5" />
      <span className="font-semibold text-sm">{label}</span>
    </button>
  );
}

function MobileNavItem({ icon: Icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center p-2 rounded-lg transition-colors ${active ? 'text-indigo-500' : 'text-neutral-500'}`}>
      <Icon className="w-6 h-6 mb-1" />
      <span className="text-[10px] font-bold">{label}</span>
    </button>
  );
}

// --- SCREEN: HOME ---
function ScreenHome({ onGenerate, onDemo, savedCount, tagCount, isDark }) {
  return (
    <div className="p-6 md:p-12 max-w-5xl mx-auto pb-24">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
          One event.<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Every platform gets its own voice.</span>
        </h1>
        <p className={`text-lg max-w-2xl font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
          Generate high-quality, platform-specific social media campaigns using intelligent TagTitles. Stop copying and pasting the same caption.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <button onClick={onGenerate} className={`group p-8 rounded-3xl border-2 transition-all duration-300 text-left hover:-translate-y-1 shadow-lg ${isDark ? 'bg-gradient-to-br from-indigo-900/40 to-neutral-900 border-indigo-500/30 hover:border-indigo-400 shadow-indigo-900/20' : 'bg-gradient-to-br from-indigo-50 to-white border-indigo-200 hover:border-indigo-400 shadow-indigo-100'}`}>
          <div className="w-14 h-14 rounded-2xl bg-indigo-500 text-white flex items-center justify-center mb-6 shadow-md">
            <Play className="w-7 h-7 fill-current" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Create New Campaign</h2>
          <p className={`font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>Start from scratch. Enter event details, apply TagTitles, and generate tailored posts.</p>
        </button>

        <button onClick={onDemo} className={`group p-8 rounded-3xl border transition-all duration-300 text-left hover:-translate-y-1 ${isDark ? 'bg-neutral-900/50 border-neutral-800 hover:border-neutral-600' : 'bg-white border-neutral-200 hover:border-neutral-400 shadow-sm'}`}>
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${isDark ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-100 text-neutral-600'}`}>
            <Zap className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Run Quick Demo</h2>
          <p className={`font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>Load the "Tech Arena 2026" example to see the TagTitle engine in action instantly.</p>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-6 rounded-2xl border ${isDark ? 'bg-neutral-900/30 border-neutral-800' : 'bg-white border-neutral-200'}`}>
          <div className="flex items-center gap-3 mb-2">
            <Tags className="w-5 h-5 text-purple-500" />
            <h3 className="font-bold">Active TagTitles</h3>
          </div>
          <p className="text-3xl font-extrabold">{tagCount}</p>
        </div>
        <div className={`p-6 rounded-2xl border ${isDark ? 'bg-neutral-900/30 border-neutral-800' : 'bg-white border-neutral-200'}`}>
          <div className="flex items-center gap-3 mb-2">
            <Layout className="w-5 h-5 text-blue-500" />
            <h3 className="font-bold">Saved Campaigns</h3>
          </div>
          <p className="text-3xl font-extrabold">{savedCount}</p>
        </div>
      </div>
    </div>
  );
}

// --- SCREEN: TAG TITLES ---
function ScreenTagTitles({ tagTitles, setTagTitles, isDark }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importCode, setImportCode] = useState('');
  const [newTag, setNewTag] = useState({ keyword: '', name: '', tone: 'Energetic', prompt: '' });

  const handleCreate = () => {
    if (!newTag.keyword || !newTag.prompt) return alert('Keyword and Prompt are required!');
    const tag = { ...newTag, id: Date.now().toString(), keyword: newTag.keyword.toUpperCase() };
    const updated = [...tagTitles, tag];
    setTagTitles(updated);
    localStorage.setItem('socialforge_tags', JSON.stringify(updated));
    setIsCreateOpen(false);
    setNewTag({ keyword: '', name: '', tone: 'Energetic', prompt: '' });
  };

  const handleShare = (tag) => {
    const code = btoa(JSON.stringify(tag));
    const shareStr = `SF_TAG_${code}`;
    navigator.clipboard.writeText(shareStr);
    alert('TagTitle Share Code copied to clipboard! Send this code to anyone to let them use this specific style.');
  };

  const handleImport = () => {
    try {
      const cleanCode = importCode.replace('SF_TAG_', '').trim();
      const tag = JSON.parse(atob(cleanCode));
      tag.id = Date.now().toString(); // Ensure unique ID locally
      const updated = [...tagTitles, tag];
      setTagTitles(updated);
      localStorage.setItem('socialforge_tags', JSON.stringify(updated));
      setIsImportOpen(false);
      setImportCode('');
      alert('TagTitle imported successfully!');
    } catch (e) {
      alert('Invalid Share Code. Please make sure you copied the exact code starting with SF_TAG_');
    }
  };

  return (
    <div className="p-6 md:p-12 max-w-5xl mx-auto pb-24 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Tags className="text-purple-500" /> TagTitles Master Styles
          </h1>
          <p className={`font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
            Teach the AI your custom writing styles. Share them with your team for consistent event branding.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsImportOpen(true)}
            className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors ${isDark ? 'bg-neutral-800 hover:bg-neutral-700 text-white' : 'bg-neutral-200 hover:bg-neutral-300 text-neutral-800'}`}>
            <Download className="w-4 h-4" /> Import Code
          </button>
          <button 
            onClick={() => setIsCreateOpen(true)}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-lg shadow-purple-500/20 flex items-center gap-2 transition-colors">
            <Plus className="w-4 h-4" /> Create New
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tagTitles.map(tag => (
          <div key={tag.id} className={`p-6 rounded-3xl border transition-all flex flex-col h-full ${isDark ? 'bg-neutral-900 border-neutral-800 hover:border-purple-500/50' : 'bg-white border-neutral-200 hover:border-purple-300 shadow-sm'}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-widest mb-3 ${isDark ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-purple-100 text-purple-700 border border-purple-200'}`}>
                  KEYWORD: {tag.keyword}
                </span>
                <h3 className="text-xl font-bold">{tag.name}</h3>
              </div>
              <span className={`text-xs px-2 py-1 rounded-md font-semibold ${isDark ? 'bg-neutral-800 text-neutral-400' : 'bg-neutral-100 text-neutral-500'}`}>{tag.tone}</span>
            </div>
            <div className={`flex-1 p-4 rounded-xl text-sm font-medium leading-relaxed italic border ${isDark ? 'bg-neutral-950 border-neutral-800 text-neutral-400' : 'bg-neutral-50 border-neutral-200 text-neutral-600'}`}>
              "{tag.prompt}"
            </div>
            <div className="mt-4 flex gap-2">
              <button 
                onClick={() => handleShare(tag)}
                className={`flex-1 flex justify-center items-center gap-2 text-sm font-bold px-3 py-2 rounded-xl transition-colors ${isDark ? 'bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400' : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600'}`}>
                <Share2 className="w-4 h-4" /> Share with Team
              </button>
              <button 
                onClick={() => setTagTitles(tagTitles.filter(t => t.id !== tag.id))}
                className={`p-2 rounded-xl transition-colors ${isDark ? 'bg-neutral-800 hover:bg-red-500/20 text-red-400' : 'bg-neutral-100 hover:bg-red-50 text-red-500'}`}>
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODALS */}
      {(isCreateOpen || isImportOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-lg p-6 rounded-3xl shadow-2xl border ${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'}`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{isCreateOpen ? 'Create New TagTitle' : 'Import TagTitle'}</h2>
              <button onClick={() => { setIsCreateOpen(false); setIsImportOpen(false); }} className={`p-2 rounded-full ${isDark ? 'hover:bg-neutral-800' : 'hover:bg-neutral-100'}`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {isCreateOpen && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-70">Keyword Trigger (e.g. COLLEGE)</label>
                  <input type="text" value={newTag.keyword} onChange={e => setNewTag({...newTag, keyword: e.target.value})} 
                    className={`w-full p-3 rounded-xl border outline-none ${isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`} />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-70">Descriptive Name</label>
                  <input type="text" value={newTag.name} onChange={e => setNewTag({...newTag, name: e.target.value})} placeholder="E.g. Casual Campus Style"
                    className={`w-full p-3 rounded-xl border outline-none ${isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`} />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-70">System Prompt / Instructions</label>
                  <textarea value={newTag.prompt} onChange={e => setNewTag({...newTag, prompt: e.target.value})} rows="4" placeholder="Tell the AI exactly how to write when this tag is active..."
                    className={`w-full p-3 rounded-xl border outline-none resize-none ${isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`} />
                </div>
                <button onClick={handleCreate} className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold mt-4 shadow-lg shadow-purple-500/20">
                  Save TagTitle
                </button>
              </div>
            )}

            {isImportOpen && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-70">Paste Share Code</label>
                  <textarea value={importCode} onChange={e => setImportCode(e.target.value)} rows="4" placeholder="SF_TAG_..."
                    className={`w-full p-3 rounded-xl border outline-none resize-none font-mono text-sm ${isDark ? 'bg-neutral-950 border-neutral-800 text-indigo-400' : 'bg-neutral-50 border-neutral-200 text-indigo-600'}`} />
                </div>
                <button onClick={handleImport} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold mt-4 shadow-lg shadow-indigo-500/20">
                  Import & Save
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// --- SCREEN: GENERATION WIZARD ---
function ScreenWizard({ eventData, setEventData, tagTitles, selectedTagTitles, setSelectedTagTitles, selectedPlatforms, setSelectedPlatforms, onComplete, isDark }) {
  const [step, setStep] = useState(1);
  const [detectedTags, setDetectedTags] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genStatus, setGenStatus] = useState('Understanding event...');

  // Auto-detect TagTitles based on event name
  useEffect(() => {
    if (eventData.name.length > 2) {
      const detected = tagTitles.filter(t => eventData.name.toUpperCase().includes(t.keyword.toUpperCase()));
      setDetectedTags(detected);
      // Auto-select if detected and not already selected
      const newSelected = [...selectedTagTitles];
      let changed = false;
      detected.forEach(tag => {
        if (!newSelected.find(s => s.id === tag.id)) {
          newSelected.push(tag);
          changed = true;
        }
      });
      if (changed) setSelectedTagTitles(newSelected);
    } else {
      setDetectedTags([]);
    }
  }, [eventData.name, tagTitles]);

  const handleInput = (e) => setEventData({...eventData, [e.target.name]: e.target.value});

  const togglePlatform = (id) => {
    if (selectedPlatforms.includes(id)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== id));
    } else {
      setSelectedPlatforms([...selectedPlatforms, id]);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Fake progress for UX
    setTimeout(() => setGenStatus('Applying TagTitles...'), 1000);
    setTimeout(() => setGenStatus('Adapting to platforms...'), 2500);
    setTimeout(() => setGenStatus('Generating hashtags...'), 4000);

    // Construct the massive prompt for Gemini
    const activeTagsStr = selectedTagTitles.map(t => `[${t.keyword} STYLE]: ${t.prompt}`).join('\n');
    const mediaContextStr = eventData.media && eventData.media.length > 0 
      ? eventData.media.map((m, i) => `Media ${i+1} (${m.type}): ${m.description || 'General event visual'}`).join('\n') 
      : 'No specific media described.';
    
    const prompt = `
      You are SocialForge AI. Generate a comprehensive social media campaign based on these facts.
      DO NOT invent dates, speakers, registration links, or handles. If missing, leave them out or use placeholders.
      
      EVENT FACTS:
      Name: ${eventData.name}
      Date: ${eventData.date} | Time: ${eventData.time}
      Venue: ${eventData.venue}
      Target Audience: ${eventData.audience}
      Description: ${eventData.description}
      Official Handles: ${eventData.handles}
      Requested Tone: ${eventData.tone} | Language: ${eventData.language}

      ATTACHED MEDIA FILES CONTEXT:
      ${mediaContextStr}
      (Use this media context to plan carousels, suggest multiple images, and generate accurate Alt Texts for each attached item. Note: X allows up to 4 images, Instagram allows carousels, Threads allows multiple images).

      ${activeTagsStr ? `CRITICAL STYLE INSTRUCTIONS (TAGTITLES APPLIED):\n${activeTagsStr}\nThese styles MUST heavily influence the output tone.` : ''}

      PLATFORM RULES:
      - Instagram: Energetic, visual hook, emojis, CTA. Strongly suggest carousel formats if multiple media are attached.
      - Facebook: Community-oriented, informative, moderate length.
      - LinkedIn: Professional, networking-focused, insightful.
      - X (Twitter): MAX 280 CHARS. Punchy hook.
      - Threads: Conversational, witty, short.
      - YouTube: Title (<100 chars), Detailed Description with pseudo-timestamps.

      OUTPUT FORMAT:
      You MUST return ONLY valid JSON matching this exact structure (no markdown blocks, no extra text):
      {
        "platforms": {
          "instagram": { "caption": "...", "hashtags": ["#a"], "mentions": ["@b"], "altTexts": ["alt for media 1", "alt for media 2"], "mediaAdvice": "e.g. Post as a 2-slide carousel." },
          "facebook": { "caption": "...", "hashtags": [], "mentions": [], "cta": "...", "altTexts": [], "mediaAdvice": "..." },
          "linkedin": { "caption": "...", "hashtags": [], "mentions": [], "altTexts": [], "mediaAdvice": "..." },
          "x": { "caption": "...", "hashtags": [], "altTexts": [], "mediaAdvice": "..." },
          "threads": { "caption": "...", "hashtags": [], "altTexts": [], "mediaAdvice": "..." },
          "youtube": { "title": "...", "description": "...", "hashtags": [], "mediaAdvice": "..." }
        },
        "storyVariants": ["Energetic short text", "Professional short text", "Minimal text"],
        "factChecks": ["Missing registration link", "Speaker identity unknown"]
      }
    `;

    try {
      const apiKey = ""; // Canvas handles this natively
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { response_mime_type: "application/json", temperature: 0.4 }
        })
      });
      
      const data = await response.json();
      const rawText = data.candidates[0].content.parts[0].text;
      
      // Clean JSON if needed
      let cleanJson = rawText;
      if (rawText.startsWith('```json')) {
        cleanJson = rawText.replace(/```json\n/, '').replace(/\n```$/, '');
      }
      
      const parsedResults = JSON.parse(cleanJson);
      setIsGenerating(false);
      onComplete(parsedResults);

    } catch (err) {
      console.error(err);
      alert("Error generating content. Please try again.");
      setIsGenerating(false);
    }
  };

  if (isGenerating) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-full border-4 border-indigo-500/30 animate-ping absolute"></div>
          <div className="w-24 h-24 rounded-full bg-indigo-500 flex items-center justify-center relative z-10 shadow-xl shadow-indigo-500/40">
            <Loader2 className="w-10 h-10 text-white animate-spin" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2">Architecting Campaign</h2>
        <p className={`font-medium ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>{genStatus}</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-12 max-w-4xl mx-auto pb-32">
      {/* STEPS INDICATOR */}
      <div className="flex items-center justify-between mb-12 relative">
        <div className="absolute left-0 top-1/2 w-full h-1 bg-neutral-200 dark:bg-neutral-800 -z-10 rounded-full transform -translate-y-1/2"></div>
        {[1, 2, 3].map(num => (
          <div key={num} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= num ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : isDark ? 'bg-neutral-800 text-neutral-500' : 'bg-neutral-200 text-neutral-400'}`}>
            {num}
          </div>
        ))}
      </div>

      {/* STEP 1: EVENT FACTS */}
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <div>
            <h2 className="text-3xl font-bold mb-2">Event Truth</h2>
            <p className={`font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>Provide the factual details. The AI will not invent information.</p>
          </div>
          
          <div className={`p-6 md:p-8 rounded-3xl border shadow-sm space-y-8 ${isDark ? 'bg-neutral-900/50 border-neutral-800' : 'bg-white border-neutral-200'}`}>
            {/* TEXT DETAILS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-70">Event Name *</label>
                <input type="text" name="name" value={eventData.name} onChange={handleInput} placeholder="e.g. Tech Arena 2026 Phase 2" 
                  className={`w-full p-4 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none transition-colors ${isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`} />
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-70">Date</label>
                <input type="text" name="date" value={eventData.date} onChange={handleInput} placeholder="5 Dec 2026" 
                  className={`w-full p-4 rounded-xl border outline-none ${isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`} />
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-70">Venue</label>
                <input type="text" name="venue" value={eventData.venue} onChange={handleInput} placeholder="Christ College, Rajkot" 
                  className={`w-full p-4 rounded-xl border outline-none ${isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`} />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-70">Description / Key Highlights</label>
                <textarea name="description" value={eventData.description} onChange={handleInput} rows="3" placeholder="Hackathons, guest speaker, food stalls..." 
                  className={`w-full p-4 rounded-xl border outline-none resize-none ${isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`} />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-70">Official Handles (Mentions)</label>
                <input type="text" name="handles" value={eventData.handles} onChange={handleInput} placeholder="@ChristCollegeRajkot @TechArena" 
                  className={`w-full p-4 rounded-xl border outline-none ${isDark ? 'bg-neutral-950 border-neutral-800 text-indigo-400' : 'bg-neutral-50 border-neutral-200 text-indigo-600'}`} />
              </div>
            </div>

            {/* MULTI-MEDIA UPLOADS (SIMULATED) */}
            <div className={`pt-8 border-t ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-bold">Media Attachments Strategy</h3>
                  <p className="text-xs opacity-60">Describe the images/videos you plan to post so the AI can write relevant captions and Alt Text.</p>
                </div>
                <button 
                  onClick={() => setEventData({ ...eventData, media: [...(eventData.media || []), { id: Date.now(), type: 'image', description: '' }] })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${isDark ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'}`}>
                  <Plus className="w-3 h-3" /> Add Media File
                </button>
              </div>

              <div className="space-y-3">
                {eventData.media && eventData.media.map((item, index) => (
                  <div key={item.id} className={`flex items-start gap-3 p-3 rounded-xl border ${isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
                    <select 
                      value={item.type}
                      onChange={(e) => setEventData({...eventData, media: eventData.media.map(m => m.id === item.id ? {...m, type: e.target.value} : m)})}
                      className={`p-2.5 rounded-lg border outline-none text-sm font-semibold w-28 shrink-0 appearance-none ${isDark ? 'bg-neutral-900 border-neutral-700' : 'bg-white border-neutral-300'}`}>
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                    <input 
                      type="text" 
                      value={item.description}
                      onChange={(e) => setEventData({...eventData, media: eventData.media.map(m => m.id === item.id ? {...m, description: e.target.value} : m)})}
                      placeholder="E.g. Main event poster showing guest speakers..."
                      className={`flex-1 p-2.5 rounded-lg border outline-none text-sm ${isDark ? 'bg-neutral-900 border-neutral-700' : 'bg-white border-neutral-300'}`}
                    />
                    <button 
                      onClick={() => setEventData({...eventData, media: eventData.media.filter(m => m.id !== item.id)})}
                      className={`p-2.5 rounded-lg transition-colors shrink-0 ${isDark ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-50 text-red-500'}`}>
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {(!eventData.media || eventData.media.length === 0) && (
                  <div className={`p-4 text-center rounded-xl border border-dashed text-sm ${isDark ? 'border-neutral-800 text-neutral-500' : 'border-neutral-300 text-neutral-400'}`}>
                    No media attached. Posts will be text-only.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* STEP 2: STYLE & TAGTITLES */}
      {step === 2 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <div>
            <h2 className="text-3xl font-bold mb-2">Style & TagTitles</h2>
            <p className={`font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>Define the campaign's voice. The AI has detected potential styles.</p>
          </div>

          {detectedTags.length > 0 && (
            <div className={`p-6 rounded-3xl border-2 shadow-lg ${isDark ? 'bg-indigo-900/20 border-indigo-500/30' : 'bg-indigo-50 border-indigo-200'}`}>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="text-indigo-500 w-5 h-5" />
                <h3 className="font-bold text-lg text-indigo-600 dark:text-indigo-400">TagTitles Detected!</h3>
              </div>
              <p className="text-sm mb-4 opacity-80">We noticed keywords in your event name. We've auto-selected these master styles:</p>
              <div className="flex flex-wrap gap-3">
                {detectedTags.map(tag => (
                  <div key={tag.id} className="px-4 py-2 bg-indigo-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-md">
                    <Tags className="w-4 h-4"/> {tag.keyword} STYLE
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={`p-6 md:p-8 rounded-3xl border shadow-sm ${isDark ? 'bg-neutral-900/50 border-neutral-800' : 'bg-white border-neutral-200'}`}>
            <label className="block text-xs font-bold uppercase tracking-wider mb-4 opacity-70">Manual TagTitle Selection</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {tagTitles.map(tag => {
                const isSelected = selectedTagTitles.find(t => t.id === tag.id);
                return (
                  <button 
                    key={tag.id}
                    onClick={() => {
                      if (isSelected) setSelectedTagTitles(selectedTagTitles.filter(t => t.id !== tag.id));
                      else setSelectedTagTitles([...selectedTagTitles, tag]);
                    }}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${isSelected ? 'border-purple-500 bg-purple-500/10 shadow-sm' : isDark ? 'border-neutral-800 bg-neutral-950 hover:border-neutral-700' : 'border-neutral-200 bg-neutral-50 hover:border-neutral-300'}`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold">{tag.keyword}</span>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-purple-500" />}
                    </div>
                    <p className="text-xs opacity-60 line-clamp-2">{tag.prompt}</p>
                  </button>
                )
              })}
            </div>

             <div className="grid grid-cols-2 gap-6 pt-6 border-t dark:border-neutral-800">
               <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-70">General Tone</label>
                  <select name="tone" value={eventData.tone} onChange={handleInput} className={`w-full p-4 rounded-xl border outline-none appearance-none ${isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
                    <option>Energetic</option><option>Professional</option><option>Casual</option>
                  </select>
               </div>
               <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-70">Language</label>
                  <select name="language" value={eventData.language} onChange={handleInput} className={`w-full p-4 rounded-xl border outline-none appearance-none ${isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
                    <option>English</option><option>Hinglish</option><option>Hindi</option><option>Gujarati</option>
                  </select>
               </div>
             </div>
          </div>
        </div>
      )}

      {/* STEP 3: PLATFORMS */}
      {step === 3 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <div>
            <h2 className="text-3xl font-bold mb-2">Select Platforms</h2>
            <p className={`font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>Choose where this campaign will live. The AI will adapt the content uniquely for each.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {PLATFORMS.map(p => {
              const isSelected = selectedPlatforms.includes(p.id);
              return (
                <button 
                  key={p.id}
                  onClick={() => togglePlatform(p.id)}
                  className={`p-6 rounded-3xl border-2 flex flex-col items-center justify-center gap-3 transition-all ${isSelected ? `border-indigo-500 ${isDark ? 'bg-indigo-500/10' : 'bg-indigo-50'}` : isDark ? 'border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800' : 'border-neutral-200 bg-white hover:bg-neutral-50'}`}
                >
                  <p.icon className={`w-10 h-10 ${isSelected ? p.color : 'text-neutral-400'}`} />
                  <span className={`font-bold ${isSelected ? (isDark ? 'text-white' : 'text-neutral-900') : 'text-neutral-500'}`}>{p.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* NAVIGATION BUTTONS */}
      <div className="flex justify-between mt-12 pt-6 border-t dark:border-neutral-800">
        <button 
          onClick={() => setStep(step - 1)} 
          disabled={step === 1}
          className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors ${step === 1 ? 'opacity-0 pointer-events-none' : isDark ? 'bg-neutral-800 hover:bg-neutral-700 text-white' : 'bg-neutral-200 hover:bg-neutral-300 text-neutral-800'}`}
        >
          <ChevronLeft className="w-5 h-5" /> Back
        </button>
        
        {step < 3 ? (
          <button 
            onClick={() => setStep(step + 1)} 
            className="px-8 py-3 rounded-xl font-bold flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 transition-all hover:pr-6"
          >
            Next Step <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <button 
            onClick={handleGenerate} 
            disabled={selectedPlatforms.length === 0}
            className="px-8 py-3 rounded-xl font-bold flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-xl shadow-indigo-500/30 transition-all disabled:opacity-50"
          >
            Forge Campaign <Zap className="w-5 h-5 fill-current" />
          </button>
        )}
      </div>
    </div>
  );
}

// --- SCREEN: RESULTS (THE MVP) ---
function ScreenResults({ results, eventData, isDark, onBack, onSave }) {
  if (!results || !results.platforms) return null;

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-6 h-6 text-green-500" />
            <h1 className="text-3xl font-bold">Campaign Ready</h1>
          </div>
          <p className={`font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>Generated uniquely for {Object.keys(results.platforms).length} platforms based on "{eventData.name}".</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onBack} className={`px-4 py-2 rounded-xl font-semibold text-sm ${isDark ? 'bg-neutral-800 hover:bg-neutral-700' : 'bg-neutral-200 hover:bg-neutral-300'}`}>Edit Inputs</button>
          <button onClick={onSave} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/20">Save Campaign</button>
        </div>
      </div>

      {/* SMART FACT CHECK INDICATOR */}
      {results.factChecks && results.factChecks.length > 0 && (
        <div className="mb-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-amber-600 dark:text-amber-400 mb-1">Content Quality Review</h3>
            <p className="text-sm text-amber-700 dark:text-amber-300 mb-2">Some information was missing from your input, so we adapted the copy:</p>
            <ul className="list-disc pl-5 text-sm text-amber-700 dark:text-amber-300 font-medium">
              {results.factChecks.map((check, i) => <li key={i}>{check}</li>)}
            </ul>
          </div>
        </div>
      )}

      {/* STORY / STATUS VARIANTS */}
      {results.storyVariants && (
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Smartphone className="w-5 h-5"/> Story / Status One-Liners</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {results.storyVariants.map((story, i) => (
              <div key={i} className={`p-6 rounded-3xl border flex flex-col justify-center text-center min-h-[120px] ${isDark ? 'bg-gradient-to-br from-neutral-900 to-neutral-950 border-neutral-800' : 'bg-gradient-to-br from-white to-neutral-50 border-neutral-200 shadow-sm'}`}>
                <p className="font-bold text-lg leading-tight mb-4">"{story}"</p>
                <button className="mx-auto flex items-center gap-2 text-xs font-bold text-indigo-500 hover:text-indigo-400 uppercase tracking-wider"><Copy className="w-3 h-3"/> Copy</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PLATFORM CARDS */}
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Monitor className="w-5 h-5"/> Main Feed Posts</h2>
      <div className="columns-1 lg:columns-2 gap-6 space-y-6">
        {Object.entries(results.platforms).map(([platformId, content]) => {
          const pConfig = PLATFORMS.find(p => p.id === platformId) || { name: platformId, icon: Layout, color: 'text-neutral-500' };
          
          return (
            <div key={platformId} className={`break-inside-avoid p-6 md:p-8 rounded-3xl border shadow-lg ${isDark ? 'bg-neutral-900/80 border-neutral-800' : 'bg-white border-neutral-200'}`}>
              
              <div className="flex justify-between items-center mb-6 border-b pb-4 dark:border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 ${pConfig.color}`}>
                    <pConfig.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold capitalize">{pConfig.name}</h3>
                </div>
                <div className="flex gap-2">
                  <button className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-neutral-800 text-neutral-400' : 'hover:bg-neutral-100 text-neutral-500'}`} title="Regenerate this specific post"><RefreshCw className="w-4 h-4"/></button>
                  <button className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-neutral-800 text-neutral-400' : 'hover:bg-neutral-100 text-neutral-500'}`} title="Copy full text"><Copy className="w-4 h-4"/></button>
                </div>
              </div>

              {content.title && (
                 <div className="mb-4">
                   <span className="text-[10px] font-bold uppercase tracking-widest opacity-50 block mb-1">Title</span>
                   <p className="font-bold text-lg">{content.title}</p>
                 </div>
              )}

              <div className="mb-6 relative group">
                 <span className="text-[10px] font-bold uppercase tracking-widest opacity-50 block mb-1">{content.description ? 'Description' : 'Caption'}</span>
                 <textarea 
                   className={`w-full min-h-[150px] p-4 rounded-xl text-[15px] leading-relaxed resize-y border-transparent focus:border-indigo-500 outline-none transition-colors ${isDark ? 'bg-neutral-950/50 text-neutral-200' : 'bg-neutral-50 text-neutral-800'}`}
                   defaultValue={content.caption || content.description}
                 />
              </div>

              {content.mediaAdvice && (
                <div className={`mb-4 p-3 rounded-xl border text-sm font-medium flex items-start gap-2 ${isDark ? 'bg-indigo-950/30 border-indigo-500/30 text-indigo-300' : 'bg-indigo-50 border-indigo-200 text-indigo-700'}`}>
                  <ImageIcon className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{content.mediaAdvice}</p>
                </div>
              )}

              <div className="space-y-3">
                {content.hashtags && content.hashtags.length > 0 && (
                  <div className="flex items-start gap-3">
                    <Hash className="w-4 h-4 mt-0.5 opacity-50 shrink-0" />
                    <p className="text-sm font-semibold text-indigo-500 dark:text-indigo-400">{content.hashtags.join(' ')}</p>
                  </div>
                )}
                
                {content.mentions && content.mentions.length > 0 && (
                  <div className="flex items-start gap-3">
                    <AtSign className="w-4 h-4 mt-0.5 opacity-50 shrink-0" />
                    <p className="text-sm font-semibold text-purple-500 dark:text-purple-400">{content.mentions.join(' ')}</p>
                  </div>
                )}

                {content.altTexts && content.altTexts.length > 0 && (
                  <div className="mt-4 pt-4 border-t dark:border-neutral-800/50">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-50 block mb-2">Generated Alt Texts</span>
                    <div className="space-y-2">
                      {content.altTexts.map((alt, i) => (
                        <div key={i} className={`p-3 rounded-xl border text-xs font-medium italic ${isDark ? 'bg-neutral-950 border-neutral-800 text-neutral-400' : 'bg-neutral-50 border-neutral-200 text-neutral-500'}`}>
                          File {i+1}: {alt}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {content.altText && !content.altTexts && (
                  <div className={`mt-4 p-3 rounded-xl border text-sm font-medium italic ${isDark ? 'bg-neutral-950 border-neutral-800 text-neutral-400' : 'bg-neutral-50 border-neutral-200 text-neutral-500'}`}>
                    Alt Text: {content.altText}
                  </div>
                )}
              </div>

            </div>
          )
        })}
      </div>
    </div>
  );
}