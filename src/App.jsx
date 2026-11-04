import { useState, useEffect, useMemo } from 'react';
import { 
  ArrowUpRight, Plus, Eye, Film, Sparkles, Send, Lock, 
  ChevronRight, Clapperboard, Disc, Download, Share2, HardDrive, Menu, X
} from 'lucide-react';

import { CATEGORIES, INITIAL_PROJECTS } from './data/initialProjects';
import ThreeCanvas from './components/ThreeCanvas';
import ProjectCard from './components/ProjectCard';
import ProjectDetailModal from './components/ProjectDetailModal';
import DriveScreeningModal from './components/DriveScreeningModal';
import ProjectEditorModal from './components/ProjectEditorModal';
import AdminAuthModal from './components/AdminAuthModal';

export default function App() {
  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem('portfolio_projects_v3');
      return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  });

  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const [screeningProject, setScreeningProject] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminError, setAdminError] = useState('');
  const [editingProject, setEditingProject] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Custom Cursor state
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [cursorHovered, setCursorHovered] = useState(false);

  // Form State
  const [contactForm, setContactForm] = useState({ name: '', email: '', service: 'Documentary Editing', budget: '$10k - $25k', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const reviewId = params.get('review');
      if (reviewId) {
        const found = projects.find(p => p.id === reviewId);
        if (found) {
          setTimeout(() => setScreeningProject(found), 0);
        }
      }
    } catch {
      // Catch block
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem('portfolio_projects_v3', JSON.stringify(projects));
    } catch {
      // Catch block
    }
  }, [projects]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      if (!isAdmin && !p.published) return false;
      if (activeCategory === 'All') return true;
      return p.category === activeCategory;
    });
  }, [projects, activeCategory, isAdmin]);

  const handleAdminAuth = (e) => {
    e.preventDefault();
    if (adminPasswordInput === 'admin123' || adminPasswordInput === 'create') {
      setIsAdmin(true);
      setShowAdminModal(false);
      setAdminPasswordInput('');
      setAdminError('');
    } else {
      setAdminError('Invalid Passcode. Use "admin123" for demo access.');
    }
  };

  const handleSaveProject = (projectData) => {
    if (editingProject) {
      setProjects(prev => prev.map(p => p.id === projectData.id ? projectData : p));
    } else {
      const newProj = {
        ...projectData,
        id: 'p_' + Date.now(),
        views: '1.0k',
        fileSize: projectData.fileSize || '2.5 GB',
        codec: projectData.codec || 'ProRes 422 HQ',
        fps: '23.976 fps',
        audio: 'Stereo 48kHz',
        reviewNotes: []
      };
      setProjects(prev => [newProj, ...prev]);
    }
    setEditingProject(null);
    setIsCreating(false);
  };

  const handleDeleteProject = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setProjects(prev => prev.filter(p => p.id !== id));
      if (selectedProject?.id === id) setSelectedProject(null);
      if (screeningProject?.id === id) setScreeningProject(null);
    }
  };

  const togglePublished = (id) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, published: !p.published } : p));
  };

  const toggleFeatured = (id) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, featured: !p.featured } : p));
  };

  const handleAddComment = (projectId, noteText, timestamp) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const newNotes = [
          ...(p.reviewNotes || []),
          { id: 'c_' + Date.now(), author: 'Client Reviewer', timestamp: timestamp || '00:00', text: noteText }
        ];
        return { ...p, reviewNotes: newNotes };
      }
      return p;
    }));
  };

  return (
    <div className="min-h-screen bg-[#08080c] text-[#e2e2e8] font-sans selection:bg-[#00f2fe] selection:text-[#08080c] relative overflow-x-hidden">
      {/* Dynamic Cursor Halo (Desktop Only) */}
      <div 
        className={`fixed top-0 left-0 w-8 h-8 rounded-full border border-[#00f2fe]/60 pointer-events-none z-[9999] transition-transform duration-75 ease-out -translate-x-1/2 -translate-y-1/2 hidden md:block ${cursorHovered ? 'scale-[2.2] bg-[#00f2fe]/10 border-[#00f2fe]' : ''}`}
        style={{ transform: `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0) scale(${cursorHovered ? 2 : 1})` }}
      />
      <div 
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-[#00f2fe] pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 hidden md:block"
        style={{ transform: `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0)` }}
      />

      {/* BACKGROUND GRAPHICS & AMBIENT GLOW */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[70vw] sm:w-[50vw] h-[70vw] sm:h-[50vw] rounded-full bg-radial from-[#00f2fe]/10 via-transparent to-transparent blur-3xl opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[80vw] sm:w-[60vw] h-[80vw] sm:h-[60vw] rounded-full bg-radial from-[#7928ca]/10 via-transparent to-transparent blur-3xl opacity-40" />
        <div className="absolute top-[40%] left-[30%] w-[50vw] sm:w-[40vw] h-[50vw] sm:h-[40vw] rounded-full bg-radial from-[#4facfe]/5 via-transparent to-transparent blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3rem_3rem] sm:bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      {/* NAVIGATION BAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#08080c]/80 border-b border-white/10 px-4 sm:px-6 py-3.5 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <a 
            href="#hero" 
            className="group flex items-center space-x-2.5 sm:space-x-3 text-base sm:text-lg font-bold tracking-tight text-white"
            onMouseEnter={() => setCursorHovered(true)}
            onMouseLeave={() => setCursorHovered(false)}
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-[#00f2fe] to-[#4facfe] flex items-center justify-center font-mono font-black text-black shadow-lg shadow-[#00f2fe]/20 group-hover:rotate-6 transition-transform text-sm sm:text-base">
              AM
            </div>
            <div className="flex flex-col">
              <span className="san-serif tracking-wider text-sm sm:text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-neutral-400">
                ANJAL MORANG
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-[#00f2fe] uppercase">Documentary Editor</span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium tracking-wider uppercase text-neutral-400">
            {['Work', 'Drive Hub', 'About', 'Contact'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="hover:text-[#00f2fe] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#00f2fe] hover:after:w-full after:transition-all"
                onMouseEnter={() => setCursorHovered(true)}
                onMouseLeave={() => setCursorHovered(false)}
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {isAdmin ? (
              <div className="flex items-center space-x-1.5 sm:space-x-2 bg-amber-500/10 border border-amber-500/30 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-mono text-amber-400">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="hidden sm:inline">ADMIN ACTIVE</span>
                <span className="sm:hidden">ADMIN</span>
                <button 
                  onClick={() => setIsAdmin(false)} 
                  className="ml-1 sm:ml-2 hover:text-white"
                  title="Exit Admin Mode"
                >
                  <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowAdminModal(true)}
                className="p-1.5 sm:p-2 rounded-full bg-white/5 border border-white/10 hover:border-[#00f2fe]/40 hover:text-[#00f2fe] transition-colors text-neutral-400"
                title="Admin Dashboard Access"
                onMouseEnter={() => setCursorHovered(true)}
                onMouseLeave={() => setCursorHovered(false)}
              >
                <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            )}

            <a 
              href="#contact" 
              className="hidden sm:inline-flex items-center justify-center px-4 sm:px-5 py-1.5 sm:py-2 overflow-hidden font-mono text-[10px] sm:text-xs tracking-widest font-semibold text-black uppercase rounded-full bg-gradient-to-r from-[#00f2fe] to-[#4facfe] shadow-lg shadow-[#00f2fe]/20 hover:shadow-[#00f2fe]/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              onMouseEnter={() => setCursorHovered(true)}
              onMouseLeave={() => setCursorHovered(false)}
            >
              <span>Collaborate</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-1.5" />
            </a>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:text-[#00f2fe]"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-3 border-t border-white/10 mt-3 space-y-3 px-2">
            {['Work', 'Drive Hub', 'About', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-mono tracking-wider uppercase text-neutral-300 hover:text-[#00f2fe] py-1"
              >
                {item}
              </a>
            ))}
            <a 
              href="#contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex w-full items-center justify-center px-4 py-2 font-mono text-xs tracking-widest font-semibold text-black uppercase rounded-full bg-gradient-to-r from-[#00f2fe] to-[#4facfe] shadow-md shadow-[#00f2fe]/20 mt-2"
            >
              <span>Collaborate</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-1.5" />
            </a>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section id="hero" className="relative min-h-screen pt-28 sm:pt-32 pb-16 flex items-center justify-center z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 z-20 text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-[#00f2fe]/30 bg-[#00f2fe]/5 text-[#00f2fe] text-[10px] sm:text-xs font-mono tracking-widest uppercase backdrop-blur-md">
              <Clapperboard className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Documentary Film & Drive Portal</span>
            </div>

            <h1 className="text-4xl sm:text-7xl xl:text-8xl font-extrabold tracking-tight font-serif text-white leading-[1.05] sm:leading-[0.95]">
              REALITY <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00f2fe] via-cyan-200 to-[#7928ca] italic font-light">
                CRAFTED
              </span> IN <br />
              LIGHT & GRAIN.
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-neutral-400 max-w-xl font-light leading-relaxed">
              Weaving non-fiction narratives, investigative archival edits, and cinematic pacing—complete with a private Drive-style screening room for client review and master downloads.
            </p>

            <div className="pt-2 sm:pt-4 flex flex-wrap gap-2 sm:gap-3 text-[11px] sm:text-xs font-mono text-neutral-400">
              <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-white/5 rounded-md border border-white/10 flex items-center gap-1.5">
                <Film className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00f2fe]" /> Feature Documentaries
              </span>
              <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-white/5 rounded-md border border-white/10 flex items-center gap-1.5">
                <HardDrive className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300" /> Direct Drive Transfer
              </span>
              <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-white/5 rounded-md border border-white/10 flex items-center gap-1.5">
                <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-300" /> ProRes Master Downloads
              </span>
            </div>

            <div className="pt-4 sm:pt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <a 
                href="#work" 
                className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-white text-black text-center font-semibold text-xs sm:text-sm tracking-wider uppercase hover:bg-[#00f2fe] transition-all transform hover:scale-105 shadow-xl shadow-white/10"
                onMouseEnter={() => setCursorHovered(true)}
                onMouseLeave={() => setCursorHovered(false)}
              >
                Watch Reels & Edits
              </a>
              <a 
                href="#drive-hub" 
                className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-full border border-amber-400/40 text-amber-300 text-center font-semibold text-xs sm:text-sm tracking-wider uppercase hover:bg-amber-400/10 transition-all flex items-center justify-center gap-2"
                onMouseEnter={() => setCursorHovered(true)}
                onMouseLeave={() => setCursorHovered(false)}
              >
                <HardDrive className="w-4 h-4" /> Client Drive Screening
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 h-[320px] sm:h-[450px] lg:h-[600px] relative flex items-center justify-center mt-6 lg:mt-0">
            <ThreeCanvas />
            
            <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 bg-black/60 backdrop-blur-xl border border-white/10 p-3 sm:p-4 rounded-2xl max-w-[200px] sm:max-w-xs shadow-2xl pointer-events-none hidden sm:block">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-1">
                <Disc className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#00f2fe] animate-spin-slow" />
                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#00f2fe]">Interactive Prism</span>
              </div>
              <p className="text-[10px] sm:text-xs text-neutral-400 font-mono">Interactive Abstraction.</p>
            </div>
          </div>

        </div>
      </section>

      {/* PORTFOLIO SHOWCASE */}
      <section id="work" className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 border-b border-white/10 pb-6 sm:pb-8 gap-4">
          <div>
            <span className="text-xs font-mono tracking-widest text-[#00f2fe] uppercase">Curated Edits</span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold font-serif text-white mt-1">Selected Documentaries & Explainers</h2>
          </div>

          <div className="flex items-center justify-between md:justify-end space-x-4">
            {isAdmin && (
              <button
                onClick={() => { setIsCreating(true); setEditingProject(null); }}
                className="flex items-center space-x-2 px-3.5 py-2 bg-[#00f2fe] text-black font-semibold text-xs tracking-wider uppercase rounded-lg hover:bg-cyan-300 transition-colors shadow-lg shadow-[#00f2fe]/20"
              >
                <Plus className="w-4 h-4" />
                <span>Add Film Entry</span>
              </button>
            )}

            <div className="text-xs font-mono text-neutral-500">
              Showing <span className="text-white font-bold">{filteredProjects.length}</span> Cuts
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-8 sm:mb-10 touch-pan-x scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-mono tracking-wider uppercase whitespace-nowrap transition-all duration-300 ${
                activeCategory === cat 
                  ? 'bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black font-bold shadow-lg shadow-[#00f2fe]/25 scale-105' 
                  : 'bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:border-white/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProjects.map((proj) => (
            <ProjectCard 
              key={proj.id} 
              project={proj} 
              onSelect={() => setSelectedProject(proj)}
              onOpenScreening={() => setScreeningProject(proj)}
              isAdmin={isAdmin}
              onEdit={() => { setEditingProject(proj); setIsCreating(false); }}
              onDelete={() => handleDeleteProject(proj.id)}
              onTogglePublish={() => togglePublished(proj.id)}
              onToggleFeature={() => toggleFeatured(proj.id)}
            />
          ))}
        </div>
      </section>

      {/* CLIENT DRIVE HUB */}
      <section id="drive-hub" className="py-16 sm:py-24 bg-[#0a0a12] border-t border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 border-b border-white/10 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest">
                <HardDrive className="w-4 h-4" /> Client Storage & Review Portal
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-white mt-1">
                Documentary Master Drive
              </h2>
            </div>
          </div>

          <div className="bg-[#0f0f1c] rounded-2xl border border-white/10 overflow-hidden shadow-2xl divide-y divide-white/5">
            {projects.map((proj) => (
              <div key={proj.id} className="p-3.5 sm:p-4 hover:bg-white/5 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-14 h-9 sm:w-16 sm:h-10 rounded-lg overflow-hidden bg-black relative flex-shrink-0 cursor-pointer" onClick={() => setScreeningProject(proj)}>
                    <img 
                      src={proj.thumbnail} 
                      alt={proj.title} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=600&auto=format&fit=crop';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Eye className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                  <div>
                    <h4 onClick={() => setScreeningProject(proj)} className="text-xs sm:text-sm font-bold text-white hover:text-[#00f2fe] cursor-pointer line-clamp-1">{proj.title}</h4>
                    <span className="text-[11px] sm:text-xs font-mono text-neutral-400">{proj.client} • {proj.duration} • {proj.fileSize}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2 sm:space-x-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                  {isAdmin ? (
                    <button 
                      onClick={() => {
                        const link = `${window.location.origin}${window.location.pathname}?review=${proj.id}`;
                        navigator.clipboard.writeText(link);
                        alert('Share link copied!');
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] sm:text-xs font-mono border border-emerald-500/30"
                    >
                      <Share2 className="w-3 h-3 inline mr-1" /> Copy Share
                    </button>
                  ) : (
                    <button 
                      onClick={() => setShowAdminModal(true)}
                      className="px-2.5 py-1.5 rounded-lg bg-white/5 opacity-50 text-neutral-400 text-[10px] sm:text-xs font-mono border border-white/10"
                    >
                      <Lock className="w-3 h-3 inline mr-1 text-amber-400" /> Share Link
                    </button>
                  )}

                  <button 
                    onClick={() => setScreeningProject(proj)}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#00f2fe] hover:text-black text-white text-[10px] sm:text-xs font-mono border border-white/10"
                  >
                    <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 inline mr-1" /> Preview
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-5 relative max-w-md mx-auto lg:max-w-none w-full">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-white/15 bg-neutral-900 shadow-2xl relative">
              <img 
                src="https://res.cloudinary.com/ni1ratnz/image/upload/v1793758028/anjal.jpg" 
                alt="Anjal Morang" 
                className="w-full h-full object-cover filter grayscale contrast-125 hover:grayscale-0 transition-all duration-700" 
                onError={(e) => {
                  if (!e.target.dataset.tried) {
                    e.target.dataset.tried = "1";
                    e.target.src = "/assets/anjal.jpeg";
                  } else {
                    e.target.onerror = null;
                    e.target.src = 'https://res.cloudinary.com/ni1ratnz/image/upload/v1793758028/anjal.jpg';
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08080c] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
                <span className="text-xs font-mono text-[#00f2fe] uppercase">Anjal Morang</span>
                <h4 className="text-lg sm:text-xl font-serif font-bold text-white">Documentary Editor</h4>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            <span className="text-xs font-mono tracking-widest text-[#00f2fe] uppercase">Editorial Craft & Vision</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-white">
              Shifting Truth From Archival Fragments
            </h2>
            <p className="text-neutral-300 font-light leading-relaxed text-sm sm:text-base">
              Specializing in non-fiction storytelling, investigative documentary edits, and cultural feature cutdowns. My editing methodology centers around narrative balance, deliberate rhythmic pacing, and seamless integration of spatial audio and 3D graphics.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10 font-mono text-xs">
              <div>
                <span className="text-[#00f2fe] font-bold block mb-1">Editing NLEs</span>
                <span className="text-neutral-400">Premiere Pro, DaVinci Resolve, After Effects</span>
              </div>
              <div>
                <span className
