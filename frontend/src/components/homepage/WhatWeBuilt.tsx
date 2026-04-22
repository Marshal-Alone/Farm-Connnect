import { Brain, Radio, ShoppingCart, Smartphone, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const pillars = [
  {
    title: "AI Engine",
    description: "Disease Detection",
    tech: "CNN / TensorFlow / Groq LLM",
    details: "Identifies crop diseases from leaf images with 95% accuracy using deep learning",
    icon: Brain,
    color: "from-red-500 to-red-600"
  },
  {
    title: "Data Integration",
    description: "Real-time Insights",
    tech: "WeatherAPI.com / Government APIs",
    details: "7-day forecasts + government schemes + advisory recommendations",
    icon: Radio,
    color: "from-blue-500 to-blue-600"
  },
  {
    title: "Marketplace",
    description: "Machinery Rental",
    tech: "MongoDB / Node.js Express",
    details: "Full booking system with owner approval workflow and rating system",
    icon: ShoppingCart,
    color: "from-orange-500 to-orange-600"
  },
  {
    title: "PWA App",
    description: "Offline Access",
    tech: "React 18 / Service Workers",
    details: "Works offline for farmers in rural areas with low connectivity",
    icon: Smartphone,
    color: "from-purple-500 to-purple-600"
  }
];

export default function WhatWeBuilt() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-slate-50">
      <div className="container px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 space-y-4">
          <Badge variant="outline" className="mx-auto mb-2">
            <ArrowRight className="w-3 h-3 mr-1" />
            System Architecture
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
            What Makes FarmConnect a<br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
              Complete Smart Farming System
            </span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
            FarmConnect isn't just a website—it's an integrated AI ecosystem with 4 core pillars solving real farming problems.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <Card key={idx} className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                {/* Gradient Background */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${pillar.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />

                <CardHeader className="relative">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${pillar.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">{pillar.title}</CardTitle>
                  <p className="text-sm text-gray-600 font-medium">{pillar.description}</p>
                </CardHeader>

                <CardContent className="relative space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Tech Stack</p>
                    <p className="text-sm text-green-700 font-mono bg-green-50 px-3 py-2 rounded-md">{pillar.tech}</p>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{pillar.details}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
