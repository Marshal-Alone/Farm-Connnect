# Farm Connect - Project Roles & Responsibilities Guide

> **CONFIDENTIAL**: This document is for team internal use only. It outlines the roles needed for this project, the files each role is responsible for, and the knowledge required to answer professor questions confidently.

---

## 📋 Table of Contents

1. [Role 1: Team Leader & Full-Stack Architect](#role-1-team-leader--full-stack-architect)
2. [Role 2: UI/UX Designer & Frontend Specialist](#role-2-uiux-designer--frontend-specialist)
3. [Role 3: Backend Developer](#role-3-backend-developer)
4. [Role 4: Frontend Developer (Core Pages)](#role-4-frontend-developer-core-pages)
5. [Role 5: API Integration & Services Developer](#role-5-api-integration--services-developer)

---

## Role 1: Team Leader & Full-Stack Architect

### 📝 Responsibilities
- Overall project architecture design and coordination
- Application routing and main structure
- Authentication system implementation
- State management (Context API)
- Database schema design
- Project configuration and deployment setup

### 📁 Files Created/Maintained

| File | Purpose | Lines |
|------|---------|-------|
| `src/App.tsx` | Main application with routing | 79 |
| `src/contexts/AuthContext.tsx` | Authentication state management | 148 |
| `server.js` | Express server configuration | 173 |
| `database.js` | MongoDB connection setup | ~50 |
| `package.json` | Dependencies and scripts | - |
| `vite.config.ts` | Build configuration | ~50 |
| `tailwind.config.ts` | Styling configuration | ~100 |
| `.env.example` | Environment variables template | - |
| `vercel.json`, `netlify.toml`, `render.yaml` | Deployment configs | - |

### 🎓 Must Study & Understand

#### Core Concepts
1. **React Router DOM** - How routing works with `<Routes>` and `<Route>`
2. **React Context API** - Global state management pattern
3. **JWT Authentication** - Token-based auth flow (login → token → localStorage → header)
4. **Express.js Middleware** - CORS, JSON parsing, error handling

#### Key Code to Memorize

**App.tsx - Main Router Setup:**
```tsx
<BrowserRouter>
  <Layout>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/disease-detection" element={<DiseaseDetection />} />
      <Route path="/weather" element={<Weather />} />
      <Route path="/machinery" element={<MachineryMarketplace />} />
      {/* ... more routes */}
    </Routes>
  </Layout>
</BrowserRouter>
```

**AuthContext - Login Flow:**
```tsx
const login = async (identifier: string, password: string) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password })
  });
  const data = await response.json();
  if (data.success) {
    setUser(data.data.user);
    localStorage.setItem('FarmConnect_token', data.data.token);
  }
};
```

### ❓ Potential Viva Questions & Answers

**Q1: Explain how routing works in your application.**
> "We use React Router DOM v6. The App.tsx defines all routes using `<Route>` components wrapped in `<Routes>`. Each route maps a URL path to a page component. We also have a Layout component that wraps all pages to provide consistent header/footer."

**Q2: How does your authentication work?**
> "We use JWT (JSON Web Token) authentication. When a user logs in, the server validates credentials, generates a JWT token, and sends it back. The frontend stores this token in localStorage. For protected routes, we send this token in the Authorization header. The token contains encoded user info and expires in 7 days."

**Q3: Why did you use Context API instead of Redux?**
> "For our application size, Context API is sufficient and adds less complexity. We only need to share authentication state globally. Redux would be overkill for this use case and would add unnecessary bundle size."

**Q4: Explain the folder structure.**
> "We follow component-based architecture: `src/pages/` contains page components, `src/components/` has reusable UI components, `src/lib/` has service files for API integrations, `src/contexts/` has React Context providers, and `api/` contains Express route handlers for the backend."

---

## Role 2: UI/UX Designer & Frontend Specialist

### 📝 Responsibilities
- Overall visual design and theming (amber/orange color scheme)
- Homepage sections design and implementation
- Responsive design implementation
- Component styling with Tailwind CSS
- User experience flows and navigation
- PWA features (install prompt, offline indicator)

### 📁 Files Created/Maintained

| File | Purpose | Lines |
|------|---------|-------|
| `src/components/homepage/HeroSection.tsx` | Main landing section | ~150 |
| `src/components/homepage/QuickActions.tsx` | Quick navigation cards | ~100 |
| `src/components/homepage/MachineryRental.tsx` | Featured machinery section | ~80 |
| `src/components/Layout.tsx` | Header, footer, navigation | 200+ |
| `src/components/LoginModal.tsx` | Login/Register UI | 500+ |
| `src/components/PWAInstallPrompt.tsx` | Install app prompt | ~100 |
| `src/components/OfflineIndicator.tsx` | Offline status banner | ~30 |
| `src/index.css` | Global styles, custom CSS | ~100 |
| `src/pages/HomePage.tsx` | Landing page composition | - |

### 🎓 Must Study & Understand

#### Core Concepts
1. **Tailwind CSS** - Utility-first CSS framework
2. **Responsive Design** - `sm:`, `md:`, `lg:` breakpoints
3. **Shadcn/UI** - Component library used for buttons, cards, dialogs
4. **CSS Grid & Flexbox** - Layout techniques
5. **PWA (Progressive Web App)** - Service workers, manifest, install prompts

#### Key Code to Memorize

**Tailwind Responsive Example:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards that stack on mobile, 2 columns on tablet, 3 on desktop */}
</div>
```

**Shadcn/UI Button Usage:**
```tsx
import { Button } from "@/components/ui/button";

<Button variant="default" size="lg" className="bg-amber-600 hover:bg-amber-700">
  Get Started
</Button>
```

**Hero Section Structure:**
```tsx
<section className="relative min-h-[80vh] bg-gradient-to-br from-amber-50 to-orange-100">
  <div className="container mx-auto px-4 py-16">
    <h1 className="text-4xl md:text-6xl font-bold text-amber-900">
      Farm Connect
    </h1>
    <p className="text-xl text-amber-700 mt-4">
      Pathway to Progress for Indian Farmers
    </p>
  </div>
</section>
```

### ❓ Potential Viva Questions & Answers

**Q1: Why did you choose Tailwind CSS?**
> "Tailwind provides utility classes that allow rapid UI development without leaving the JSX. It's highly customizable, produces smaller CSS bundles through purging unused styles, and ensures design consistency across the app."

**Q2: Explain responsive design in your project.**
> "We use Tailwind's responsive prefixes. For example, `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` creates a grid that shows 1 column on mobile, 2 on tablet (768px+), and 3 on desktop (1024px+). This ensures the app works well on all devices."

**Q3: What is PWA and how did you implement it?**
> "PWA stands for Progressive Web App. It allows our web app to be installed on mobile devices like a native app. We implemented it using a service worker (`sw.js`) for caching, a manifest file for app metadata, and an install prompt component that detects when the app can be installed."

**Q4: Explain Shadcn/UI.**
> "Shadcn/UI is a collection of reusable components built on Radix UI primitives and styled with Tailwind CSS. Unlike component libraries like Material-UI, Shadcn/UI gives us the actual component code which we can customize. Components are in `src/components/ui/` folder."

---

## Role 3: Backend Developer

### 📝 Responsibilities
- REST API design and implementation
- Database operations with MongoDB
- Authentication backend (JWT, bcrypt)
- API route handlers for all features
- Server middleware (CORS, error handling)
- Data validation and security

### 📁 Files Created/Maintained

| File | Purpose | Lines |
|------|---------|-------|
| `api/users.js` | Auth routes (login, register, me) | 234 |
| `api/machinery.js` | Machinery CRUD operations | ~300 |
| `api/bookings.js` | Booking management | 400+ |
| `api/messages.js` | Chat/messaging system | ~300 |
| `api/weather.js` | Weather API proxy | ~60 |
| `api/diseases.js` | Disease detection logging | ~80 |
| `api/schemes.js` | Government schemes data | ~60 |
| `database.js` | MongoDB connection | ~50 |
| `src/lib/schemas/*.ts` | TypeScript interfaces for data | - |

### 🎓 Must Study & Understand

#### Core Concepts
1. **Express.js** - Node.js web framework
2. **MongoDB** - NoSQL database operations (CRUD)
3. **JWT (JSON Web Tokens)** - Token generation and verification
4. **bcrypt** - Password hashing
5. **REST API Design** - HTTP methods, status codes, JSON responses

#### Key Code to Memorize

**User Registration (api/users.js):**
```javascript
router.post('/register', async (req, res) => {
  const { name, email, password, phone } = req.body;
  
  // Hash password before storing
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const newUser = {
    name, email, phone,
    password: hashedPassword,
    createdAt: new Date()
  };
  
  const result = await usersCollection.insertOne(newUser);
  const token = jwt.sign({ userId: result.insertedId }, JWT_SECRET, { expiresIn: '7d' });
  
  res.status(201).json({ success: true, data: { user: newUser, token } });
});
```

**JWT Middleware (api/users.js):**
```javascript
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token required' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}
```

**MongoDB Query Example:**
```javascript
// Find user by email or phone
const user = await usersCollection.findOne({
  $or: [{ email: identifier }, { phone: identifier }]
});
```

### ❓ Potential Viva Questions & Answers

**Q1: Explain JWT authentication flow.**
> "When a user registers/logs in, we validate their credentials, then generate a JWT token using `jwt.sign()` with a secret key. This token contains the user ID and expires in 7 days. The frontend stores this token and sends it with each request in the Authorization header. Our middleware `authenticateToken` verifies this token using `jwt.verify()` before allowing access to protected routes."

**Q2: Why use bcrypt for passwords?**
> "We never store plain-text passwords. bcrypt is a secure hashing algorithm that includes salt (random data) in the hash, making it resistant to rainbow table attacks. We use `bcrypt.hash()` to hash passwords during registration and `bcrypt.compare()` to verify during login."

**Q3: Explain your API response structure.**
> "All our APIs return a consistent JSON structure: `{ success: boolean, data: {...} }` for success, or `{ success: false, error: 'message' }` for errors. This makes frontend error handling predictable and consistent."

**Q4: How does MongoDB differ from SQL databases?**
> "MongoDB is a NoSQL document database. Instead of tables with fixed schemas, we have collections of JSON-like documents. This provides flexibility - we can add new fields without migrations. We use MongoDB's `$or`, `$and` operators for complex queries and `ObjectId` for unique document identifiers."

---

## Role 4: Frontend Developer (Core Pages)

### 📝 Responsibilities
- Main feature page development
- Disease Detection page with image upload
- Weather Dashboard implementation
- Machinery Marketplace and details pages
- Government Schemes page
- User Profile page
- Form handling and validation

### 📁 Files Created/Maintained

| File | Purpose | Lines |
|------|---------|-------|
| `src/pages/DiseaseDetection.tsx` | AI crop disease analysis | 650 |
| `src/pages/Weather.tsx` | Weather display | ~50 |
| `src/pages/MachineryMarketplace.tsx` | Browse machinery | ~350 |
| `src/pages/MachineryDetail.tsx` | Single machinery view | ~500 |
| `src/pages/MachineryForm.tsx` | Add/edit machinery | 600+ |
| `src/pages/GovernmentSchemes.tsx` | Schemes listing | ~400 |
| `src/pages/UserProfile.tsx` | User dashboard | 1500+ |
| `src/pages/BookingHistory.tsx` | Booking management | ~300 |
| `src/pages/OwnerDashboard.tsx` | Owner analytics | ~700 |

### 🎓 Must Study & Understand

#### Core Concepts
1. **React Hooks** - useState, useEffect, useRef
2. **File Upload** - FileReader API, base64 encoding
3. **Form Handling** - Controlled components, validation
4. **API Integration** - fetch/axios, loading states, error handling
5. **Conditional Rendering** - Show/hide based on state

#### Key Code to Memorize

**Disease Detection - Image Upload:**
```tsx
const handleImageUpload = (file: File) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const base64 = e.target?.result as string;
    setSelectedImage(base64);
  };
  reader.readAsDataURL(file);
};
```

**Disease Detection - Analysis:**
```tsx
const startAnalysis = async () => {
  setIsAnalyzing(true);
  try {
    const result = await analyzeCropImage(selectedImage);
    setDetectionResult(result);
  } catch (error) {
    toast({ title: "Analysis failed", variant: "destructive" });
  } finally {
    setIsAnalyzing(false);
  }
};
```

**Fetching Data with useEffect:**
```tsx
const [machinery, setMachinery] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchMachinery = async () => {
    const response = await fetch('/api/machinery');
    const data = await response.json();
    if (data.success) setMachinery(data.data);
    setLoading(false);
  };
  fetchMachinery();
}, []);
```

### ❓ Potential Viva Questions & Answers

**Q1: How does your disease detection work?**
> "The user uploads a crop image which is converted to base64 using FileReader API. This base64 string is sent to our AI service (Groq or Gemini API) which analyzes the image for plant diseases. The AI returns disease name, severity, treatment suggestions, and prevention methods which we display in a user-friendly card layout."

**Q2: Explain the useState and useEffect hooks.**
> "`useState` creates state variables in functional components - when the state changes, the component re-renders. `useEffect` runs side effects like API calls. It takes a function and a dependency array - the effect runs when dependencies change. An empty array means it runs once on mount."

**Q3: How do you handle loading and error states?**
> "We use three states: `loading` (boolean), `data` (the actual data), and `error` (error message). While loading, we show a spinner. If there's an error, we show an error message with retry option. Only when data is successfully loaded, we render the main content."

**Q4: Explain how file upload works.**
> "HTML file input captures the file, which we read using FileReader.readAsDataURL() to convert to base64 string. This base64 can be directly used as image src or sent to APIs. For multiple files, we loop through the FileList. We also validate file type and size before processing."

---

## Role 5: API Integration & Services Developer

### 📝 Responsibilities
- Third-party API integrations (Groq, Gemini, WeatherAPI)
- Service layer architecture
- AI provider abstraction
- Voice interface implementation
- Weather data processing
- TypeScript interface definitions

### 📁 Files Created/Maintained

| File | Purpose | Lines |
|------|---------|-------|
| `src/lib/gemini.ts` | Google Gemini AI integration | 367 |
| `src/lib/groq.ts` | Groq LLM integration | 221 |
| `src/lib/ai.ts` | AI provider abstraction | ~200 |
| `src/lib/weather.ts` | Weather API service | 282 |
| `src/components/VoiceInterface.tsx` | Voice input/output | ~300 |
| `src/components/SmartWeatherDashboard.tsx` | Weather with AI insights | ~600 |
| `src/components/IndianFarmerWeatherDashboard.tsx` | Advanced weather UI | 1000+ |
| `src/lib/api/bookingService.ts` | Booking API service | ~150 |
| `src/lib/api/machineryService.ts` | Machinery API service | ~150 |

### 🎓 Must Study & Understand

#### Core Concepts
1. **REST API Consumption** - fetch, axios, headers, error handling
2. **Async/Await** - Promises, try/catch, loading states
3. **Web Speech API** - SpeechRecognition, SpeechSynthesis
4. **Service Patterns** - Singleton classes, API abstraction
5. **TypeScript Interfaces** - Type definitions for API responses

#### Key Code to Memorize

**Gemini AI - Disease Detection (src/lib/gemini.ts):**
```typescript
async analyzeCropImage(imageBase64: string): Promise<AICropAnalysis> {
  const response = await this.getModel().models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { 
      parts: [
        { text: "Analyze this crop image for diseases..." },
        { inlineData: { data: base64Data, mimeType: 'image/jpeg' } }
      ] 
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: diagnosisSchema
    }
  });
  return JSON.parse(response.text);
}
```

**AI Provider Abstraction (src/lib/ai.ts):**
```typescript
export async function analyzeCropImage(imageBase64: string) {
  const provider = localStorage.getItem('ai_provider') || 'groq';
  
  if (provider === 'gemini') {
    return geminiAI.analyzeCropImage(imageBase64);
  } else {
    return groqAI.analyzeCropImage(imageBase64);
  }
}
```

**Voice Interface (src/components/VoiceInterface.tsx):**
```typescript
const startListening = () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = selectedLanguage; // 'hi-IN', 'mr-IN', etc.
  
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    handleVoiceQuery(transcript);
  };
  
  recognition.start();
};

const speakResponse = (text: string, lang: string) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  speechSynthesis.speak(utterance);
};
```

**Weather Service (src/lib/weather.ts):**
```typescript
export const getCurrentWeather = async (lat: number, lon: number): Promise<WeatherData> => {
  const response = await axios.get('/api/weather/forecast', {
    params: { q: `${lat},${lon}`, days: 7 }
  });
  return mapWeatherResponse(response.data.data);
};
```

### ❓ Potential Viva Questions & Answers

**Q1: How do you switch between Groq and Gemini AI?**
> "We have an abstraction layer in `src/lib/ai.ts`. Functions like `analyzeCropImage()` check `localStorage.getItem('ai_provider')` to determine which service to use. This setting is changed in the Settings page. Both Groq and Gemini services implement the same interface, so the calling code stays the same."

**Q2: Explain how the Voice Interface works.**
> "We use the Web Speech API. `SpeechRecognition` converts voice to text - we set the language (Hindi, Marathi, etc.) and capture the transcript when the user stops speaking. The query is sent to our AI for a response. `SpeechSynthesis` then converts the AI's text response back to speech in the selected language."

**Q3: How do you handle API errors in services?**
> "All API calls are wrapped in try/catch blocks. In the catch block, we log the error for debugging and either throw a user-friendly error or return fallback data. For example, if weather API fails, we return mock data so the UI doesn't break completely."

**Q4: What's the difference between Groq and Gemini in your project?**
> "Both are AI services we use for disease detection and farming advice. Groq uses the Llama 4 model accessed via OpenAI-compatible API. Gemini is Google's AI accessed via `@google/genai` SDK. Groq is faster but Gemini has better image analysis. Users can choose their preferred provider."

---

## 📚 Common Technologies Everyone Must Know

### React Basics
- Components (functional)
- Props and children
- State (useState)
- Side effects (useEffect)
- Context (useContext)

### TypeScript
- Interface definitions
- Type annotations
- Generic types
- Optional properties (`?`)

### API Concepts
- HTTP methods: GET, POST, PUT, DELETE
- Status codes: 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 500 (Server Error)
- JSON request/response format
- Headers (Content-Type, Authorization)

### Project-Specific
- MongoDB connection with `getDatabase()`
- JWT token flow
- Image base64 encoding
- Weather API data structure
- AI prompt engineering

---

## 🔐 Important: How to Handle Professor Questions

1. **If you don't know something**: "That was handled by [another role], but from my understanding, it works by..."

2. **If asked about AI/ML**: "We're not training models - we're integrating pre-trained AI models via API calls to Groq and Gemini services. The AI does the analysis; we send the data and receive results."

3. **If asked why certain technology**: Always mention:
   - Scalability
   - Industry standard
   - Developer productivity
   - Community support

4. **If asked about testing**: "We performed manual testing of all features. We tested API endpoints using tools like Postman and verified UI functionality in multiple browsers."

---

## 📊 Quick Reference: Who Did What

| Feature | Primary Role |
|---------|-------------|
| Project Setup & Architecture | Role 1 (Leader) |
| Authentication | Role 1 + Role 3 |
| Homepage Design | Role 2 (UI/UX) |
| Styling/Theming | Role 2 (UI/UX) |
| API Routes | Role 3 (Backend) |
| Database Operations | Role 3 (Backend) |
| Disease Detection Page | Role 4 (Frontend) |
| Machinery Pages | Role 4 (Frontend) |
| Weather Dashboard | Role 4 + Role 5 |
| AI Integration | Role 5 (Services) |
| Voice Interface | Role 5 (Services) |
| Government Schemes | Role 4 (Frontend) |
| User Profile | Role 4 (Frontend) |

---

> **Remember**: Confidence is key. Speak about your role's files with authority. If asked about another area, briefly acknowledge and redirect to what you know.
