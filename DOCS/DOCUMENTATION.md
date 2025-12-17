# FarmConnect - Technical Documentation

## Project Overview
FarmConnect is a comprehensive agricultural technology platform designed for the Smart India Hackathon. The platform empowers farmers with AI-driven insights, disease detection, weather monitoring, machinery rental, and government scheme access.

## Technology Stack
### Charts — Developer note 🔧

- The project uses a small Recharts wrapper at `src/components/ui/chart.tsx` which exports `ChartContainer`, `ChartTooltipContent`, `ChartLegend`, and helpers for consistent styling and color tokens.
- Example (minimal usage):

```tsx
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegend,
} from "@/components/ui/chart"
import { LineChart, Line, XAxis } from "recharts"

<ChartContainer config={{ revenue: { label: "Revenue", color: "#10b981" } }}>
  <LineChart data={data}>
    <XAxis dataKey="name" />
    <Line dataKey="revenue" stroke="var(--color-revenue)" />
    <ChartTooltipContent />
    <ChartLegend />
  </LineChart>
</ChartContainer>
```

This wrapper is used by `src/components/AIAnalyticsDashboard.tsx` for the analytics charts.
- **HTTP Client**: Axios

## Current Features

### ✅ Core Infrastructure
- [x] React app with TypeScript
- [x] Tailwind CSS design system
- [x] Responsive layout with navigation
- [x] Route-based navigation
- [x] Authentication context
- [x] Toast notifications

### ✅ AI-Powered Features
- [x] **Disease Detection**: AI-powered crop disease identification using image upload
- [x] **Voice Interface**: Voice commands and text-to-speech responses
- [x] **AI Analytics Dashboard**: Real-time farming metrics and insights
- [x] **Smart Weather Dashboard**: Real-time weather data with location services and agricultural recommendations

### ✅ Core Pages
- [x] **Home Page**: Hero section, quick actions, AI insights
- [x] **Disease Detection**: Image upload with AI analysis
- [x] **Weather**: Weather monitoring with agricultural insights
- [x] **Machinery Marketplace**: Equipment rental platform
- [x] **Government Schemes**: Access to agricultural subsidies
- [x] **User Profile**: Personal dashboard and activity history
- [x] **Kisan Bazaar**: Marketplace for agricultural products

## API Integration

### Google AI Analysis
- **API Key**: Configured and active
- **Features**: 
  - Crop disease detection and treatment recommendations
  - Farming advice and best practices
  - Weather analysis and agricultural insights
  - Crop recommendations based on conditions

### OpenWeatherMap API
- **Integration**: Real-time weather data
- **Features**:
  - Current weather conditions
  - 5-day weather forecasts
  - Location-based weather services
  - Agricultural weather insights
  - Weather alerts and notifications

## Architecture

### File Structure
```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui base components
│   └── homepage/        # Homepage-specific components
├── contexts/            # React contexts (Auth, etc.)
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries (AI Analysis, database, utils)
├── pages/               # Route components
└── assets/              # Images and static assets
```

### Design System
- **Colors**: HSL-based semantic tokens in `index.css`
- **Components**: Variant-based design with consistent theming
- **Layout**: Responsive grid system with Tailwind CSS
- **Typography**: Hierarchical text system with semantic classes

## Development Workflow

### Branch Structure
- `main`: Production-ready code
- `feature/*`: New feature development
- `fix/*`: Bug fixes and patches

## Deployment
- **Platform**: Vercel
- **Build Tool**: Vite
- **Environment**: Production-ready with optimized builds
