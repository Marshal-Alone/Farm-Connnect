import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Brain,
  Users,
  CheckCircle,
  Languages
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import heroImage from "@/assets/hero-farm.jpg";
import VoiceInterface from "@/components/VoiceInterface";

export default function HeroSection() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleVoiceQuery = (query: string, language: string) => {
    console.log("Voice query:", query, language);
  };

  return (
    <section className="min-h-screen relative overflow-hidden flex items-center">
      {/* Background Image with Green Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Modern farming landscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 via-green-800/80 to-green-900/40" />
      </div>

      <div className="container relative z-10 px-6 py-12 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column: Content */}
          <div className="space-y-8 animate-in slide-in-from-left duration-700">
            <div className="space-y-6">
              <Badge variant="outline" className="bg-white/10 text-white backdrop-blur-md border-white/20 px-4 py-1.5 text-sm uppercase tracking-wide">
                <Sparkles className="w-4 h-4 mr-2 text-yellow-400" />
                AI-Powered Agriculture Platform
              </Badge>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white tracking-tight">
                Welcome to FarmConnect: <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-green-400">
                  The Future of Smart Farming
                </span>
              </h1>

              <p className="text-xl text-white/80 leading-relaxed max-w-xl">
                Empower your farm with FarmConnect, the leading AI platform for crop disease detection, machinery rental, and agricultural weather insights.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button
                size="lg"
                className="h-14 px-8 text-lg bg-green-500 hover:bg-green-600 text-white shadow-xl shadow-green-500/20 rounded-xl transition-all hover:scale-105"
                onClick={() => navigate("/disease-detection")}
              >
                <Brain className="w-6 h-6 mr-2" />
                Try Disease Detection
              </Button>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
              <div className="space-y-1">
                <div className="flex items-center text-yellow-400 mb-1">
                  <Users className="w-5 h-5 mr-1" />
                </div>
                <div className="text-2xl font-bold text-white">50K+</div>
                <div className="text-sm text-white/60">Active Farmers</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center text-green-400 mb-1">
                  <CheckCircle className="w-5 h-5 mr-1" />
                </div>
                <div className="text-2xl font-bold text-white">95%</div>
                <div className="text-sm text-white/60">AI Accuracy</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center text-blue-400 mb-1">
                  <Languages className="w-5 h-5 mr-1" />
                </div>
                <div className="text-2xl font-bold text-white">12+</div>
                <div className="text-sm text-white/60">Languages</div>
              </div>
            </div>
          </div>

          {/* Right Column: Voice Assistant */}
          <div className="animate-in slide-in-from-right duration-700 delay-200 relative">
            {/* Glow Effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-green-500/30 to-blue-500/30 blur-2xl rounded-full opacity-50" />

            <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl">
              <div className="absolute -top-6 -right-6 bg-yellow-400 text-black px-4 py-2 rounded-full font-bold shadow-lg transform rotate-12 flex items-center text-sm z-20">
                <Sparkles className="w-4 h-4 mr-1" />
                Try saying "Hello"
              </div>

              <VoiceInterface onVoiceQuery={handleVoiceQuery} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
