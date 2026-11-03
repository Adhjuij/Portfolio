import { X, HardDrive, Share2 } from 'lucide-react';

export default function ProjectDetailModal({ project, onClose, onOpenScreening, isAdmin, setShowAdminModal }) {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-2xl overflow-y-auto">
      <div className="bg-[#0b0b14] border border-white/15 rounded-3xl max-w-5xl w-full overflow-hidden shadow-2xl relative my-auto">
        <button onClick={onClose} className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black">
          <X className="w-5 h-5" />
        </button>

        <div className="relative aspect-video w-full bg-black">
          <video src={project.videoUrl} controls autoPlay className="w-full h-full object-contain" />
        </div>

        <div className="p-6 md:p-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="text-xs font-mono text-[#00f2fe] uppercase">{project.category} • {project.year}</span>
              <h2 className="text-2xl md:text-4xl font-bold font-serif text-white mt-1">{project.title}</h2>
              <span className="text-xs font-mono text-neutral-400 mt-1 block">Client: {project.client}</span>
            </div>

            <div className="flex items-center space-x-3">
              {isAdmin ? (
                <button 
                  onClick={() => {
                    const link = `${window.location.origin}${window.location.pathname}?review=${project.id}`;
                    navigator.clipboard.writeText(link);
                    alert('Share link copied!');
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono flex items-center space-x-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Copy Share Link (Admin)</span>
                </button>
              ) : (
                <button 
                  onClick={() => setShowAdminModal(true)}
                  className="px-4 py-2 rounded-xl bg-white/5 opacity-50 text-neutral-400 border border-white/10 text-xs font-mono flex items-center space-x-2"
                >
                  <Share2 className="w-4 h-4 text-amber-400" />
                  <span>Share Link (Admin Only)</span>
                </button>
              )}

              <button 
                onClick={() => { onClose(); onOpenScreening(project); }}
                className="px-4 py-2 rounded-xl bg-amber-400/10 text-amber-300 border border-amber-400/30 text-xs font-mono flex items-center space-x-2"
              >
                <HardDrive className="w-4 h-4" />
                <span>Open Drive Hub</span>
              </button>
            </div>
          </div>

          <p className="text-neutral-300 text-sm md:text-base leading-relaxed font-light">{project.description}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white/5 p-4 rounded-xl text-xs font-mono">
            <div>
              <span className="text-neutral-500 block">Codec Specs</span>
              <span className="text-white font-bold">{project.codec || 'ProRes 422 HQ'}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Frame Rate</span>
              <span className="text-white font-bold">{project.fps || '23.976 fps'}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">File Size</span>
              <span className="text-white font-bold">{project.fileSize || '2.5 GB'}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Audio Spec</span>
              <span className="text-white font-bold">{project.audio || 'Stereo 48kHz'}</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-mono text-neutral-400 uppercase mb-2">Software Tools</h4>
            <div className="flex flex-wrap gap-2">
              {project.tools?.map(tool => (
                <span key={tool} className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-xs font-mono text-[#00f2fe]">
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}