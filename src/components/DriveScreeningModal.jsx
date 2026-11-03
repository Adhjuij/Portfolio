import { useState } from 'react';
import { X, HardDrive, Download, Share2, Lock, MessageSquare, Send } from 'lucide-react';

export default function DriveScreeningModal({ project, onClose, onAddComment, isAdmin, setShowAdminModal }) {
  const [commentInput, setCommentInput] = useState('');
  const [timecode, setTimecode] = useState('02:14');

  if (!project) return null;

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    onAddComment(project.id, commentInput, timecode);
    setCommentInput('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-2xl overflow-y-auto">
      <div className="bg-[#0b0b14] border border-amber-400/20 rounded-3xl max-w-6xl w-full overflow-hidden shadow-2xl relative my-auto">
        <div className="px-6 py-4 bg-amber-400/5 border-b border-amber-400/20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <HardDrive className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-mono text-amber-300 uppercase tracking-widest">Documentary Master Drive & Client Review</span>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-8 p-6 space-y-6 border-r border-white/10">
            <div className="relative aspect-video w-full bg-black rounded-xl overflow-hidden border border-white/10">
              <video src={project.videoUrl} controls className="w-full h-full object-contain" />
            </div>

            <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl">
              <div>
                <h3 className="text-lg font-serif font-bold text-white">{project.title}</h3>
                <p className="text-xs font-mono text-neutral-400">{project.codec} • {project.fps} • {project.fileSize}</p>
              </div>

              <div className="flex items-center space-x-2">
                <a 
                  href={project.videoUrl} 
                  download 
                  target="_blank" 
                  rel="noreferrer" 
                  className="px-4 py-2 rounded-xl bg-amber-400 text-black font-mono font-bold text-xs uppercase flex items-center space-x-2 hover:bg-amber-300"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Master</span>
                </a>

                {isAdmin ? (
                  <button 
                    onClick={() => {
                      const link = `${window.location.origin}${window.location.pathname}?review=${project.id}`;
                      navigator.clipboard.writeText(link);
                      alert('Share link copied!');
                    }}
                    className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                ) : (
                  <button onClick={() => setShowAdminModal(true)} className="p-2 rounded-xl bg-white/5 border border-white/10 text-neutral-500">
                    <Lock className="w-4 h-4 text-amber-400" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 p-6 bg-[#08080e] flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-neutral-400 mb-4">
                <MessageSquare className="w-4 h-4 text-[#00f2fe]" />
                <span>Timecoded Notes ({project.reviewNotes?.length || 0})</span>
              </div>

              <div className="space-y-3 max-h-[350px] overflow-y-auto no-scrollbar mb-4">
                {project.reviewNotes?.length > 0 ? (
                  project.reviewNotes.map((note) => (
                    <div key={note.id} className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-[#00f2fe] font-bold">{note.author}</span>
                        <span className="text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">{note.timestamp}</span>
                      </div>
                      <p className="text-xs text-neutral-300">{note.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs font-mono text-neutral-600 italic">No notes added yet for this edit cut.</p>
                )}
              </div>
            </div>

            <form onSubmit={handleCommentSubmit} className="space-y-2 border-t border-white/10 pt-4">
              <div className="flex items-center space-x-2">
                <input 
                  type="text" 
                  value={timecode} 
                  onChange={(e) => setTimecode(e.target.value)} 
                  className="w-20 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs font-mono text-amber-400" 
                />
                <input 
                  type="text" 
                  value={commentInput} 
                  onChange={(e) => setCommentInput(e.target.value)} 
                  placeholder="Leave note..." 
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white" 
                />
                <button type="submit" className="p-2 rounded-lg bg-[#00f2fe] text-black">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
