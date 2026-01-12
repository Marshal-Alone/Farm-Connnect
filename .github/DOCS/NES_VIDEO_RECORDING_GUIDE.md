# 🎬 NES Innovation Award - Complete Video Recording Guide

> **Project**: Farm Connect: Pathway to Progress  
> **Duration**: 60 seconds  
> **Video Name**: `Farm Connect - Pathway to Progress.mp4`

---

## 📹 COMPLETE VISUAL FLOW

---

### **(0–5 sec) INTRO**

| Script Line | Show On Screen | Type |
|-------------|----------------|------|
| "Hello, I'm [Your Name] from Nagpur Institute of Technology." | **Your webcam / face** OR **Farm Connect logo** | 🎥 LIVE |
| "Our project is Farm Connect – an AI-powered agricultural support platform for Indian farmers." | **Homepage hero section** with tagline visible | 🖥️ UI |

---

### **(5–15 sec) TECH STACK**

| Script Line | Show On Screen | Type |
|-------------|----------------|------|
| "The frontend is built using React 18 with TypeScript..." | **`package.json`** - zoom to lines 62-90 showing React, TypeScript, Tailwind versions | 💻 CODE |
| "...styled using Tailwind CSS, and designed as a Progressive Web App." | **Browser "Install App" button** OR show PWA icon on desktop | 🖥️ UI |
| "The backend uses Node.js with Express..." | **`backend/index.js`** - zoom to lines 1-21 showing Express imports | 💻 CODE |
| "...and MongoDB for database management." | **`backend/config/database.js`** - zoom to lines 10-26 showing MongoClient | 💻 CODE |
| "Authentication is handled using JWT." | **`backend/api/users.js`** - zoom to lines 3-22 showing jwt.sign() | 💻 CODE |

**Files to open beforehand:**
- `package.json`
- `backend/index.js`
- `backend/config/database.js`
- `backend/api/users.js`

---

### **(15–30 sec) AI MODEL & LOGIC**

| Script Line | Show On Screen | Type |
|-------------|----------------|------|
| "For AI features, we integrated Groq LLM using LLaMA..." | **`frontend/src/lib/groq.ts`** - zoom to line 83: `model: "meta-llama/llama-4-scout..."` | 💻 CODE |
| "...with optional Google Gemini Vision AI." | **`frontend/src/lib/gemini.ts`** - zoom to line 159: `model: 'gemini-2.5-flash'` | 💻 CODE |
| "In the disease detection module, farmers upload a crop image..." | **Navigate to Disease Detection page** → click Upload button | 🖥️ UI |
| "...which is converted to base64 and sent to the AI model." | **`frontend/src/lib/groq.ts`** - zoom to lines 92-97 showing `image_url: { url: imageBase64 }` | 💻 CODE |
| "The model returns disease name, severity, confidence..." | **Show actual AI analysis results** on Disease Detection page with disease details | 🖥️ UI |

**Files to open beforehand:**
- `frontend/src/lib/groq.ts`
- `frontend/src/lib/gemini.ts`

---

### **(30–45 sec) CORE FUNCTIONAL MODULES**

| Script Line | Show On Screen | Type |
|-------------|----------------|------|
| "The platform also includes a real-time weather dashboard..." | **Navigate to Weather page** - show current weather + 7-day forecast | 🖥️ UI |
| "...using WeatherAPI, enhanced with AI farming insights." | **Scroll to AI recommendations** section on weather page | 🖥️ UI |
| "We developed a machinery rental marketplace..." | **Navigate to Machinery Marketplace page** - show equipment cards | 🖥️ UI |
| "...where farmers can list, book, message, and review equipment." | **Click on any machinery** → show booking calendar → scroll to reviews | 🖥️ UI |
| "A government schemes portal consolidates verified agricultural schemes..." | **Navigate to Schemes page** - show scheme cards with search/filter | 🖥️ UI |

**Pages to pre-open in tabs:**
- Weather Dashboard
- Machinery Marketplace
- Government Schemes

---

### **(45–55 sec) VOICE & MULTILINGUAL**

| Script Line | Show On Screen | Type |
|-------------|----------------|------|
| "To improve accessibility, we implemented a voice-based AI chatbot..." | **Open Voice Interface** (find it on homepage or chatbot section) | 🖥️ UI |
| "...using the Web Speech API..." | **`frontend/src/components/VoiceInterface.tsx`** - zoom to lines 56-58 showing `webkitSpeechRecognition` | 💻 CODE |
| "...supporting five Indian languages." | **Show language dropdown** - Hindi, Marathi, Malayalam, Punjabi, English visible | 🖥️ UI |
| (Optional demo) | **Click microphone** → show "Listening..." badge | 🖥️ UI |

**Files to open beforehand:**
- `frontend/src/components/VoiceInterface.tsx`

---

### **(55–60 sec) OUTCOME**

| Script Line | Show On Screen | Type |
|-------------|----------------|------|
| "Farm Connect delivers a single digital ecosystem..." | **Quick montage** - rapidly show 3-4 pages (Homepage → Disease → Weather → Machinery) | 🖥️ UI |
| "...that improves decision-making, reduces crop loss, and empowers farmers through AI." | **Return to Homepage** OR show final Team Credits screen | 🖥️ UI |
| "Thank you." | **Your face** OR **Project title card with team names** | 🎥 LIVE |

---

## 📁 FILES TO OPEN BEFORE RECORDING

### Code Files (in VS Code tabs):
1. `package.json`
2. `backend/index.js`
3. `backend/config/database.js`
4. `backend/api/users.js`
5. `frontend/src/lib/groq.ts`
6. `frontend/src/lib/gemini.ts`
7. `frontend/src/components/VoiceInterface.tsx`

### Browser Tabs (in order):
1. Homepage
2. Disease Detection
3. Weather Dashboard
4. Machinery Marketplace
5. Government Schemes

---

## 🎯 RECORDING TIPS

1. **Practice switching** between VS Code and browser 2-3 times
2. **Use Ctrl + Mouse Wheel** to zoom into code
3. **Pre-position** each code file at the exact line you need
4. **Keep browser tabs in order** of the script flow
5. **Record at 1080p** minimum for code visibility
6. **Speak at moderate pace** - you have exactly 60 seconds

---

## ✅ PRE-RECORDING CHECKLIST

- [ ] All 7 code files opened in VS Code
- [ ] All 5 browser tabs opened and logged in
- [ ] Disease Detection has a sample image ready
- [ ] Dev server running (`npm run dev`)
- [ ] Backend server running (`npm run server`)
- [ ] Screen recording software ready
- [ ] Microphone tested

---

**Good luck! 🏆**
