import React from 'react';
import {
  Code2,
  Palette,
  Bookmark,
  Settings as SettingsIcon,
  LayoutDashboard
} from 'lucide-react';

export default function MobileBottomNav({
  currentPage,
  onNavigate,
  isDarkMode,
}) {
  const navItems = [
    { id: 'generate', label: 'Studio', icon: Code2 },
    { id: 'templates', label: 'Templates', icon: Palette },
    { id: 'home', label: 'Home', icon: LayoutDashboard },
    { id: 'saved', label: 'Saved', icon: Bookmark },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t safe-area-bottom backdrop-blur-xl transition-colors duration-200 ${
        isDarkMode
          ? 'bg-slate-900/95 border-slate-800/80 shadow-[0_-8px_30px_rgba(0,0,0,0.5)]'
          : 'bg-white/95 border-slate-200/80 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]'
      }`}
    >
      <div className="flex items-center justify-around px-2 py-1.5 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`relative flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-2xl transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'text-brand-400 font-bold'
                  : isDarkMode
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <div
                  className={`p-1 rounded-xl transition-all ${
                    isActive
                      ? 'bg-brand-500/20 text-brand-400'
                      : 'text-inherit'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>

              {isActive && (
                <span className="absolute bottom-0 w-5 h-0.5 rounded-full bg-brand-500" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
