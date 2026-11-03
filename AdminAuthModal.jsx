import { X, Lock } from 'lucide-react';

export default function AdminAuthModal({ 
  show, 
  onClose, 
  passwordInput, 
  setPasswordInput, 
  error, 
  onAuth 
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="bg-[#0e0e18] border border-amber-400/30 rounded-3xl max-w-md w-full p-6 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 text-amber-400 mb-4">
          <Lock className="w-6 h-6" />
          <h3 className="text-lg font-serif font-bold text-white">Admin Authentication</h3>
        </div>

        <p className="text-xs text-neutral-400 mb-4 font-mono">
          Enter passcode to access CMS upload capabilities, edit cuts, and copy client Drive links.
        </p>

        <form onSubmit={onAuth} className="space-y-4 font-mono">
          <div>
            <input 
              type="password" 
              value={passwordInput} 
              onChange={(e) => setPasswordInput(e.target.value)} 
              placeholder="Passcode (e.g. admin123)" 
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-[#00f2fe] outline-none" 
            />
            {error && <span className="text-red-400 text-[11px] mt-1 block">{error}</span>}
          </div>

          <button 
            type="submit" 
            className="w-full py-3 rounded-xl bg-amber-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-amber-300 transition-colors"
          >
            Authenticate Admin
          </button>
        </form>
      </div>
    </div>
  );
}