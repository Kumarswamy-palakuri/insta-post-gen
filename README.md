# QuizCraft AI - Instagram Quiz Post Generator

A modern, responsive, frontend-only web application built with **React.js**, **Vite**, and **Tailwind CSS**. It generates random educational multiple-choice quiz questions on any topic using Google Gemini API and formats them into high-converting Instagram posts (Question Post + Answer Reveal) ready for instant PNG, JPG, or bulk ZIP export.

---

## 🚀 Key Features

### 1. Pure Frontend Architecture
- **No Backend Required**: Runs 100% inside the browser using direct Gemini REST API calls.
- **LocalStorage Persistence**: Saves API credentials, questions, history, templates, and branding preferences locally.
- **Zero Configuration Setup**: Includes an offline demo mode with sample quiz questions across multiple categories for immediate testing without an API key.

### 2. Google Gemini API Integration (`src/services/aiService.js`)
- **Direct REST Calls**: Connects straight to `https://generativelanguage.googleapis.com/v1beta/models/...`.
- **Model Choice**: Supports `Gemini 1.5 Flash` (recommended & ultra-fast), `Gemini 2.0 Flash`, and `Gemini 1.5 Pro`.
- **Structured JSON Engine**: Enforces strict JSON schema validation, automatic duplicate prevention, and distraction option balancing.
- **Single Question Regeneration**: Regenerate any question independently with AI.
- **Connection Diagnostics**: Test API connection with real-time latency and status feedback in Settings.

### 3. Instagram Post Generator & 8 Premium Templates
Supports all standard Instagram formats:
- **Square (1:1)**: `1080 × 1080 px`
- **Portrait (4:5)**: `1080 × 1350 px`
- **Story / Reel (9:16)**: `1080 × 1920 px`

#### 8 Reusable React Templates (`src/templates/`):
1. **Black and Gold** (`BlackGold.jsx`): Luxury dark theme, obsidian backdrop with metallic gold accents.
2. **Dark Blue and Yellow** (`BlueYellow.jsx`): High contrast ed-tech style popular for UPSC & civil exam preparation.
3. **Purple Gradient** (`PurpleGradient.jsx`): Vibrant Instagram gradient, violet glow & glassmorphism.
4. **White and Blue** (`WhiteBlue.jsx`): Clean modern academic daytime reading theme.
5. **Orange and Black** (`OrangeBlack.jsx`): High-energy creator aesthetic with bold highlights.
6. **Green and White** (`GreenWhite.jsx`): Emerald nature and intellectual focus palette.
7. **Modern Minimal** (`Minimal.jsx`): Swiss typographic style with matte charcoal and hairline borders.
8. **Premium Exam Style** (`ExamStyle.jsx`): Authentic competitive test series sheet with OMR option bubbles.

### 4. Dual Post Generation
Every question generates two complementary cards:
- **Image 1: Question Post**: "Quiz Time" header, question text, 4 options, topic badge, "Comment Your Answer", and branding.
- **Image 2: Answer Reveal**: Original question, correct option highlighted in green with checkmark badge, comprehensive explanation, and branding.

### 5. Live Customization Editor (`src/components/QuizEditor.jsx`)
- Live edit Question text, options (A, B, C, D), correct answer, and explanation.
- Custom fonts: Plus Jakarta / Inter, Outfit, Playfair Display, JetBrains Mono, and Noto Sans Telugu.
- Custom background colors and text color overrides.
- Custom logo upload (local file to Base64) or remote URL.
- Custom handle (default: `learn_in_a_minute`) and call-to-action text.
- Instant real-time preview of both posts as you type.

### 6. Export & Download Manager (`src/utils/imageExport.js` & `DownloadManager.jsx`)
- Export individual Question or Answer card as **PNG** or **JPG**.
- Export both Question + Answer pair in one click.
- **Bulk ZIP Download**: Uses `JSZip` to compile all questions and answer reveals into a structured `.zip` carousel pack.
- True 1080px export resolution with 2x pixel ratio for razor-sharp social media display.

---

## 🛠️ Project Structure

```
src/
  components/
    Sidebar.jsx          # Responsive SaaS navigation with dark/light mode toggle
    Dashboard.jsx        # Stats overview, quick random generator, recent history
    QuizGenerator.jsx    # Topic inputs, category pills, difficulty & language controls
    QuizPreview.jsx      # Live preview of Question and Answer reveal posts
    QuizEditor.jsx       # Real-time customization panel for typography, content & branding
    TemplateSelector.jsx # Visual gallery and category filter for the 8 templates
    QuestionCard.jsx     # Post 1 (Question) wrapper with action bar and export buttons
    AnswerCard.jsx       # Post 2 (Answer Reveal) wrapper with explanation and export buttons
    Settings.jsx         # Gemini API key configuration, model selector, data reset
    DownloadManager.jsx  # Modal for bulk ZIP downloads and format selection

  templates/
    BlackGold.jsx        # Template 1
    BlueYellow.jsx       # Template 2
    PurpleGradient.jsx   # Template 3
    WhiteBlue.jsx        # Template 4
    OrangeBlack.jsx      # Template 5
    GreenWhite.jsx       # Template 6
    Minimal.jsx          # Template 7
    ExamStyle.jsx        # Template 8
    index.js             # Template registry and exports

  services/
    aiService.js         # Direct Gemini REST API integration & offline fallback pool

  utils/
    imageExport.js       # html-to-image and JSZip exporter
    storage.js           # LocalStorage helpers for keys, history, and branding
    quizValidator.js     # AI output JSON parser and structure sanitizer

  pages/
    Home.jsx             # Dashboard view
    Generate.jsx         # Studio view with generator, editor, and live preview
    Templates.jsx        # Templates showcase and selection
    SavedQuizzes.jsx     # Saved quizzes library and inspector
    Settings.jsx         # Settings view

  App.jsx                # Root application state, notifications & layout
  main.jsx               # Entry point
  index.css              # Tailwind CSS directives & global scrollbar styling
```

---

## 🏃 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### Installation
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### Build for Production
```bash
npm run build
```

---

## 🔑 AI API Configuration

1. Open the application and navigate to **API & Settings** in the sidebar.
2. Enter your **Google Gemini API Key** (get a free key from [Google AI Studio](https://aistudio.google.com/app/apikey)).
3. Click **Test Connection** to verify your key.
4. Click **Save Key**. It will be saved securely in your browser's LocalStorage.

> **Security Note**: This application runs entirely on the frontend. The API key is stored in your browser's LocalStorage and is never sent to any intermediary server. This setup is intended for personal and creator workflows.

