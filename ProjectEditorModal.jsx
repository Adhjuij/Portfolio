import { useState } from 'react';
import { X, Save } from 'lucide-react';

const CATEGORIES = ['All', 'Documentary', 'Video Editing', '3D Design', 'Motion Graphics', 'Experiments'];

export default function ProjectEditorModal({ project, isCreating, onClose, onSave }) {
  const [formData, setFormData] = useState(
    project || {
      title: '',
      category: 'Documentary',
      thumbnail: '',
      videoUrl: '',
      duration: '05:00',
      description: '',
      client: '',
      year: new Date().getFullYear().toString(),
      tools: ['Premiere Pro', 'DaVinci Resolve'],
      tags: ['Documentary'],
      featured: false,
      published: true
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl overflow-y-auto">
      <div className="bg-[#0c0c16] border border-white/15 rounded-3xl max-w-2xl w-full p-6 md:p-8 relative my-auto shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold font-serif text-white mb-6">
          {isCreating ? 'Add New Cut Entry' : 'Edit Project Entry'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div>
            <label className="text-neutral-400 block mb-1">Project Title</label>
            <input 
              type="text" 
              required 
              value={formData.title} 
              onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white font-sans text-sm" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-neutral-400 block mb-1">Category</label>
              <select 
                value={formData.category} 
                onChange={(e) => setFormData({ ...formData, category: e.target.value })} 
                className="w-full bg-[#141422] border border-white/10 rounded-xl p-3 text-white"
              >
                {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-neutral-400 block mb-1">Duration</label>
              <input 
                type="text" 
                value={formData.duration} 
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })} 
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white" 
              />
            </div>
          </div>

          <div>
            <label className="text-neutral-400 block mb-1">Thumbnail Image URL</label>
            <input 
              type="text" 
              required 
              value={formData.thumbnail} 
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })} 
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white" 
            />
          </div>

          <div>
            <label className="text-neutral-400 block mb-1">Video Stream URL (MP4)</label>
            <input 
              type="text" 
              required 
              value={formData.videoUrl} 
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })} 
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white" 
            />
          </div>

          <div>
            <label className="text-neutral-400 block mb-1">Description</label>
            <textarea 
              rows={3} 
              value={formData.description} 
              onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white font-sans" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-neutral-400 block mb-1">Client</label>
              <input 
                type="text" 
                value={formData.client} 
                onChange={(e) => setFormData({ ...formData, client: e.target.value })} 
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white" 
              />
            </div>
            <div>
              <label className="text-neutral-400 block mb-1">Year</label>
              <input 
                type="text" 
                value={formData.year} 
                onChange={(e) => setFormData({ ...formData, year: e.target.value })} 
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white" 
              />
            </div>
          </div>

          <div className="flex items-center space-x-6 pt-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={formData.published} 
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })} 
                className="rounded border-white/10 bg-white/5 text-[#00f2fe]" 
              />
              <span className="text-white">Published</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={formData.featured} 
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} 
                className="rounded border-white/10 bg-white/5 text-amber-400" 
              />
              <span className="text-white">Featured Cut</span>
            </label>
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-white/10 text-neutral-400">Cancel</button>
            <button type="submit" className="px-6 py-2.5 rounded-xl bg-[#00f2fe] text-black font-bold uppercase flex items-center space-x-2">
              <Save className="w-4 h-4" />
              <span>Save Entry</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}