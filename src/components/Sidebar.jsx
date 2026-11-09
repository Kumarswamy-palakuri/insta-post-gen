import React from 'react';
import {
  LayoutDashboard,
  Code2,
  Palette,
  Bookmark,
  Settings as SettingsIcon,
  Moon,
  Sun,
  X,
  Layers,
  Sparkles
} from 'lucide-react';

export default function Sidebar({
  currentPage,
  onNavigate,
  isOpen,
  onClose,
  isDarkMode,
  onToggleTheme,
}) {
  const navItems = [
    { id: 'generate', label: 'JSON to Frame', icon: Code2, badge: 'Studio' },
    { id: 'templates', label: 'Post Templates', icon: Palette, count: 8 },
    { id: 'home', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'saved', label: 'Saved Projects', icon: Bookmark },
    { id: 'settings', label: 'Branding & Setup', icon: SettingsIcon },
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
            onClick={() => onNavigate('generate')}
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
                <span className="text-brand-400 text-xs px-1.5 py-0.5 rounded bg-brand-500/20 border border-brand-500/30">
                  JSON
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                JSON to Frame Studio
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
          {/* Studio Status Pill */}
          <div
            onClick={() => onNavigate('settings')}
            className="p-3 rounded-xl border cursor-pointer transition bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 text-slate-200"
          >
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-brand-400" />
              <div className="text-[11px] font-bold">
                JSON to Frame Active
              </div>
            </div>
            <div className="text-[10px] text-slate-400 mt-1 pl-6">
              8 Instagram Templates Ready
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
            <span className="text-[10px] font-mono text-slate-500">v2.0 JSON</span>
          </div>
        </div>
      </aside>
    </>
  );
}
