import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Brain,
  Cloud,
  Tractor,
  ArrowRight
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import heroImage from "@/assets/hero-farm.jpg";
import VoiceInterface from "@/components/VoiceInterface";

export default function HeroSection() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <section className="relative overflow-hidden flex items-center min-h-screen md:min-h-[90vh]">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Smart farming technology"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-950/95 via-green-900/90 to-emerald-900/80" />
        
        {/* Animated Gradient Orbs */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-green-500 opacity-20 blur-3xl animate-pulse" />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 py-6 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">
          {/* LEFT: Content */}
          <div className="space-y-6 animate-in slide-in-from-left duration-700">
            {/* Badge */}
            <Badge 
              variant="outline" 
              className="bg-white/10 text-white backdrop-blur-md border-white/20 px-4 py-2 text-xs sm:text-sm uppercase tracking-wide w-fit"
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 text-yellow-400" />
              AI-Powered Agriculture Platform
            </Badge>

            {/* Main Heading */}
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-white tracking-tight">
                AI-Powered Smart Farming <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-green-300 to-emerald-300">
                  Ecosystem for Indian Farmers
                </span>
              </h1>
              {/* Subheading */}
              <p className="text-sm sm:text-base md:text-lg text-white/85 leading-relaxed max-w-2xl">
                Detect crop diseases with AI, access real-time weather, rent machinery, and apply for government schemes — all in one intelligent platform optimized for rural connectivity.
              </p>
            </div>

            {/* 3 Quick Badges */}
            <div className="flex flex-wrap gap-3 sm:gap-4 py-4">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 sm:px-4 py-2 rounded-lg border border-white/20">
                <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                <span className="text-xs sm:text-sm text-white font-medium">AI Disease Detection</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 sm:px-4 py-2 rounded-lg border border-white/20">
                <Cloud className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                <span className="text-xs sm:text-sm text-white font-medium">Weather + Advisory</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 sm:px-4 py-2 rounded-lg border border-white/20">
                <Tractor className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
                <span className="text-xs sm:text-sm text-white font-medium">Machinery Marketplace</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Button
                size="lg"
                className="h-12 sm:h-14 px-8 text-sm sm:text-base bg-green-500 hover:bg-green-600 text-white shadow-xl shadow-green-500/30 rounded-xl transition-all hover:scale-105 active:scale-95"
                onClick={() => navigate("/disease-detection")}
              >
                <Brain className="w-5 h-5 mr-2" />
                Try Disease Detection
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-4 sm:pt-8 border-t border-white/10">
              <div className="space-y-1">
                <div className="text-xl sm:text-3xl font-bold text-yellow-300">95%</div>
                <div className="text-xs sm:text-sm text-white/70">Disease Accuracy</div>
              </div>
              <div className="space-y-1">
                <div className="text-xl sm:text-3xl font-bold text-green-300">12+</div>
                <div className="text-xs sm:text-sm text-white/70">Languages</div>
              </div>
              <div className="space-y-1">
                <div className="text-xl sm:text-3xl font-bold text-blue-300">Offline</div>
                <div className="text-xs sm:text-sm text-white/70">PWA Ready</div>
              </div>
            </div>
          </div>

          {/* RIGHT: Visual Demo */}
          <div className="animate-in slide-in-from-right duration-700 delay-200 relative hidden lg:block">
            {/* Glow Effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-green-500/30 to-blue-500/30 blur-2xl rounded-full opacity-50" />

            <div className="relative bg-white/10 backdrop-blur-md rounded-2xl md:rounded-3xl p-6 border border-white/20 shadow-2xl">
              <div className="absolute -top-6 -right-6 bg-yellow-400 text-black px-3 sm:px-4 py-2 rounded-full font-bold shadow-lg transform rotate-12 text-xs sm:text-sm z-20">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                Try Voice Input
              </div>

              <VoiceInterface onVoiceQuery={() => {}} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
