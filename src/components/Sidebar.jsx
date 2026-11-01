import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  Palette,
  Bookmark,
  Settings as SettingsIcon,
  Moon,
  Sun,
  ShieldCheck,
  ShieldAlert,
  X,
  Compass,
  Camera
} from 'lucide-react';

const InstagramIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export default function Sidebar({
  currentPage,
  onNavigate,
  isOpen,
  onClose,
  hasApiKey,
  isDarkMode,
  onToggleTheme,
}) {
  const navItems = [
    { id: 'home', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'generate', label: 'Quiz Generator', icon: Sparkles, badge: 'AI' },
    { id: 'templates', label: 'Post Templates', icon: Palette, count: 8 },
    { id: 'saved', label: 'Saved Quizzes', icon: Bookmark },
    { id: 'settings', label: 'API & Settings', icon: SettingsIcon },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo / Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <img
              src="/logo.png"
              alt="Brand Logo"
              className="w-10 h-10 rounded-xl object-cover shadow-lg shadow-brand-500/25 group-hover:scale-105 transition border border-brand-500/30"
            />
            <div>
              <div className="font-black text-base tracking-tight text-white flex items-center space-x-1">
                <span>QuizCraft</span>
                <span className="text-brand-400">AI</span>
              </div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Instagram Post Studio
              </div>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-3 py-1">
            Studio Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  if (onClose) onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                      isActive ? 'bg-white/20 text-white' : 'bg-brand-500/20 text-brand-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {item.count && (
                  <span
                    className={`text-[11px] font-semibold ${
                      isActive ? 'text-white/80' : 'text-slate-500'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Status & Theme Card */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          {/* API Status Pill */}
          <div
            onClick={() => onNavigate('settings')}
            className={`p-3 rounded-xl border cursor-pointer transition ${
              hasApiKey
                ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300 hover:bg-emerald-950/50'
                : 'bg-amber-950/30 border-amber-500/30 text-amber-300 hover:bg-amber-950/50'
            }`}
          >
            <div className="flex items-center space-x-2">
              {hasApiKey ? (
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-amber-400" />
              )}
              <div className="text-[11px] font-bold">
                {hasApiKey ? 'Gemini AI Connected' : 'Demo Mode (No API Key)'}
              </div>
            </div>
            <div className="text-[10px] text-slate-400 mt-1 pl-6">
              {hasApiKey ? 'Ready for infinite topics' : 'Tap to configure key in Settings'}
            </div>
          </div>

          {/* Theme Toggle & Version */}
          <div className="flex items-center justify-between pt-1 text-xs text-slate-400">
            <button
              onClick={onToggleTheme}
              className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition"
              title="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
              <span className="text-[11px] font-semibold">{isDarkMode ? 'Light UI' : 'Dark UI'}</span>
            </button>
            <span className="text-[10px] font-mono text-slate-500">v1.0.0 Frontend</span>
          </div>
        </div>
      </aside>
    </>
  );
}
