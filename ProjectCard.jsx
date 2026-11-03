import { useState, useEffect, useRef } from 'react';
import { Play, Eye, EyeOff, Star, HardDrive, Edit3, Trash2 } from 'lucide-react';

export default function ProjectCard({ 
  project, 
  onSelect, 
  onOpenScreening, 
  isAdmin, 
  onEdit, 
  onDelete, 
  onTogglePublish, 
  onToggleFeature 
}) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (isHovered && videoRef.current) {
      videoRef.current.play().catch(() => {});
    } else if (!isHovered && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isHovered]);

  return (
    <div 
      className="group relative bg-[#0f0f18] rounded-2xl border border-white/10 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-[#00f2fe]/40 hover:shadow-2xl hover:shadow-[#00f2fe]/10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {project.featured && (
        <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full bg-amber-400/90 text-black text-[10px] font-mono font-bold uppercase tracking-wider shadow-md backdrop-blur-md">
          Featured Cut
        </div>
      )}

      {isAdmin && (
        <div className="absolute top-3 right-3 z-30 flex items-center space-x-1.5 bg-black/80 backdrop-blur-md p-1.5 rounded-lg border border-white/20">
          <button 
            onClick={(e) => { e.stopPropagation(); onTogglePublish(); }} 
            className={`p-1.5 rounded hover:bg-white/20 ${project.published ? 'text-emerald-400' : 'text-neutral-500'}`}
            title={project.published ? 'Published' : 'Draft'}
          >
            {project.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleFeature(); }} 
            className={`p-1.5 rounded hover:bg-white/20 ${project.featured ? 'text-amber-400' : 'text-neutral-500'}`}
          >
            <Star className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit(); }} 
            className="p-1.5 rounded text-cyan-400 hover:bg-white/20"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(); }} 
            className="p-1.5 rounded text-red-400 hover:bg-white/20"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="relative aspect-video w-full overflow-hidden bg-neutral-900 cursor-pointer" onClick={onSelect}>
        <img 
          src={project.thumbnail} 
          alt={project.title}
          className={`w-full h-full object-cover transition-opacity duration-500 ${isHovered ? 'opacity-0' : 'opacity-100'}`} 
        />
        <video 
          ref={videoRef}
          src={project.videoUrl} 
          muted 
          loop 
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} 
        />
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-12 h-12 rounded-full bg-[#00f2fe] text-black flex items-center justify-center shadow-lg">
            <Play className="w-5 h-5 fill-black ml-0.5" />
          </div>
        </div>
        <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-2 py-1 rounded text-[10px] font-mono text-neutral-300 border border-white/10">
          {project.duration}
        </div>
      </div>

      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-[#00f2fe] uppercase">{project.category}</span>
          <span className="text-[10px] font-mono text-neutral-500">{project.year}</span>
        </div>
        <h3 className="text-lg font-bold font-serif text-white hover:text-[#00f2fe] cursor-pointer" onClick={onSelect}>
          {project.title}
        </h3>
        <p className="text-xs text-neutral-400 line-clamp-2 font-light">{project.description}</p>
        <div className="pt-2 flex items-center justify-between border-t border-white/5 text-[11px] font-mono text-neutral-500">
          <span>{project.client}</span>
          <button onClick={onOpenScreening} className="flex items-center space-x-1 text-amber-300 hover:text-white">
            <HardDrive className="w-3 h-3" />
            <span>Drive Hub</span>
          </button>
        </div>
      </div>
    </div>
  );
}