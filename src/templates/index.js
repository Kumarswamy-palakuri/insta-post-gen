import BlackGold from './BlackGold';
import BlueYellow from './BlueYellow';
import PurpleGradient from './PurpleGradient';
import WhiteBlue from './WhiteBlue';
import OrangeBlack from './OrangeBlack';
import GreenWhite from './GreenWhite';
import Minimal from './Minimal';
import ExamStyle from './ExamStyle';

export const TEMPLATES = [
  {
    id: 'black-gold',
    name: 'Black & Gold',
    description: 'Luxury obsidian with metallic gold accents',
    category: 'Premium Dark',
    previewColor: 'from-neutral-950 via-zinc-900 to-black',
    accentColor: '#F59E0B',
    component: BlackGold,
  },
  {
    id: 'blue-yellow',
    name: 'Dark Blue & Yellow',
    description: 'High contrast ed-tech standard for civil & competitive exams',
    category: 'High Contrast',
    previewColor: 'from-[#0a192f] via-[#0f284e] to-[#071324]',
    accentColor: '#FBBF24',
    component: BlueYellow,
  },
  {
    id: 'purple-gradient',
    name: 'Purple Gradient',
    description: 'Vibrant neon purple and violet glassmorphism',
    category: 'Viral Social',
    previewColor: 'from-[#180928] via-[#2a0e44] to-[#0d0417]',
    accentColor: '#E879F9',
    component: PurpleGradient,
  },
  {
    id: 'white-blue',
    name: 'White & Blue',
    description: 'Clean academic daytime reading with corporate blue',
    category: 'Light Theme',
    previewColor: 'from-slate-50 via-blue-50 to-slate-100',
    accentColor: '#2563eb',
    component: WhiteBlue,
  },
  {
    id: 'orange-black',
    name: 'Orange & Black',
    description: 'Bold energetic creator aesthetic with high engagement',
    category: 'Creator Bold',
    previewColor: 'from-[#121113] via-[#1a181c] to-[#0d0c0e]',
    accentColor: '#f97316',
    component: OrangeBlack,
  },
  {
    id: 'green-white',
    name: 'Green & White',
    description: 'Fresh emerald nature & intellectual focus palette',
    category: 'Emerald Modern',
    previewColor: 'from-[#062419] via-[#0d3f2d] to-[#041710]',
    accentColor: '#10b981',
    component: GreenWhite,
  },
  {
    id: 'minimal',
    name: 'Modern Minimal',
    description: 'Swiss typographic style, matte charcoal, hairline details',
    category: 'Editorial Minimal',
    previewColor: 'from-[#121214] to-[#1a1a1e]',
    accentColor: '#ffffff',
    component: Minimal,
  },
  {
    id: 'exam-style',
    name: 'Premium Exam Style',
    description: 'Official test series paper with OMR bubble options',
    category: 'OMR Test Series',
    previewColor: 'from-[#181d28] to-[#0f131a]',
    accentColor: '#818cf8',
    component: ExamStyle,
  },
];

export const getTemplateById = (id) => {
  return TEMPLATES.find((t) => t.id === id) || TEMPLATES[0];
};

export {
  BlackGold,
  BlueYellow,
  PurpleGradient,
  WhiteBlue,
  OrangeBlack,
  GreenWhite,
  Minimal,
  ExamStyle,
};

