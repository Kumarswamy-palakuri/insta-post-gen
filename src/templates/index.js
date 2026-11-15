import WhiteBlue from './WhiteBlue';
import Minimal from './Minimal';
import BlackGold from './BlackGold';
import BlueYellow from './BlueYellow';
import PurpleGradient from './PurpleGradient';
import OrangeBlack from './OrangeBlack';
import GreenWhite from './GreenWhite';
import ExamStyle from './ExamStyle';

export const TEMPLATES = [
  {
    id: 'white-blue',
    name: 'Studio White & Indigo',
    description: 'Crisp pure white canvas with high-converting royal indigo & emerald accents',
    category: 'Recommended',
    previewColor: 'from-white via-blue-50 to-indigo-100 border border-slate-200',
    accentColor: '#2563eb',
    component: WhiteBlue,
  },
  {
    id: 'minimal',
    name: 'Modern Minimal White',
    description: 'Swiss typographic style, crisp pure white canvas, matte black & emerald details',
    category: 'Light Theme',
    previewColor: 'from-white via-neutral-50 to-neutral-200 border border-neutral-300',
    accentColor: '#0f172a',
    component: Minimal,
  },
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
  WhiteBlue,
  Minimal,
  BlackGold,
  BlueYellow,
  PurpleGradient,
  OrangeBlack,
  GreenWhite,
  ExamStyle,
};
