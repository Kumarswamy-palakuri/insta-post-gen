import React, { useState } from 'react';
import { TEMPLATES } from '../templates';
import { Check, Sparkles, Palette } from 'lucide-react';

export default function TemplateSelector({
  selectedTemplate = 'black-gold',
  onSelectTemplate,
  isCompact = false,
}) {
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Dark', 'Light', 'High Contrast'];

  const filteredTemplates = TEMPLATES.filter((t) => {
    if (filter === 'All') return true;
    if (filter === 'Dark') return t.id.includes('black') || t.id.includes('purple') || t.id.includes('orange') || t.id.includes('minimal');
    if (filter === 'Light') return t.id.includes('white');
    if (filter === 'High Contrast') return t.id.includes('yellow') || t.id.includes('exam') || t.id.includes('green');
    return true;
  });

  return (
    <div className="w-full">
      {!isCompact && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center space-x-2">
            <Palette className="w-5 h-5 text-brand-400" />
            <h3 className="text-sm sm:text-base font-bold text-white">Instagram Post Templates</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
              8 Styles
            </span>
          </div>

          <div className="flex items-center space-x-1 bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-2.5 py-1 rounded-lg font-medium transition whitespace-nowrap ${
                  filter === cat
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grid of Templates */}
      <div className={`grid gap-3 sm:gap-4 ${isCompact ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'}`}>
        {filteredTemplates.map((template) => {
          const isSelected = selectedTemplate === template.id;

          return (
            <div
              key={template.id}
              onClick={() => onSelectTemplate(template.id)}
              className={`group relative rounded-xl border-2 cursor-pointer transition-all duration-200 overflow-hidden flex flex-col ${
                isSelected
                  ? 'border-brand-500 ring-2 ring-brand-500/30 bg-slate-800/90 shadow-xl'
                  : 'border-slate-700/80 hover:border-slate-600 bg-slate-800/40 hover:bg-slate-800/80'
              }`}
            >
              {/* Miniature Visual Mockup Banner */}
              <div
                className={`h-24 w-full bg-gradient-to-br ${template.previewColor} p-3 flex flex-col justify-between relative overflow-hidden`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider"
                    style={{
                      backgroundColor: `${template.accentColor}30`,
                      color: template.accentColor,
                      border: `1px solid ${template.accentColor}50`,
                    }}
                  >
                    {template.category}
                  </span>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-brand-500 text-white flex items-center justify-center shadow-md">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="h-2 w-3/4 bg-white/20 rounded" />
                  <div className="grid grid-cols-2 gap-1 pt-1">
                    <div className="h-2.5 rounded bg-white/10" />
                    <div className="h-2.5 rounded bg-white/10" />
                  </div>
                </div>
              </div>

              {/* Template Info */}
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-brand-300 transition flex items-center justify-between">
                    <span>{template.name}</span>
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: template.accentColor }}
                    />
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {template.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">1080px Optimized</span>
                  <span className={`font-semibold ${isSelected ? 'text-brand-400' : 'text-slate-400'}`}>
                    {isSelected ? 'Active' : 'Apply'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

