import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  Cloud,
  Tractor,
  FileText,
  Smartphone,
  ArrowRight,
  Code
} from "lucide-react";

const features = [
  {
    id: "disease-detection",
    title: "Disease Detection",
    description: "Identify crop diseases from leaf images",
    icon: Camera,
    color: "bg-gradient-to-br from-red-500 to-red-600",
    tech: {
      input: "Image Upload",
      model: "CNN / Groq Vision AI",
      output: "Disease + Treatment"
    },
    route: "/disease-detection"
  },
  {
    id: "weather",
    title: "Weather Insights",
    description: "7-day forecast + agricultural advisory",
    icon: Cloud,
    color: "bg-gradient-to-br from-sky-500 to-sky-600",
    tech: {
      input: "GPS Location",
      model: "WeatherAPI.com",
      output: "Forecast + Recommendations"
    },
    route: "/weather"
  },
  {
    id: "machinery",
    title: "Machinery Marketplace",
    description: "Rent equipment with owner approval workflow",
    icon: Tractor,
    color: "bg-gradient-to-br from-orange-500 to-orange-600",
    tech: {
      input: "Equipment Search",
      model: "MongoDB Booking System",
      output: "Confirmed Rentals"
    },
    route: "/machinery"
  },
  {
    id: "schemes",
    title: "Government Schemes",
    description: "Apply for agricultural subsidies",
    icon: FileText,
    color: "bg-gradient-to-br from-green-500 to-green-600",
    tech: {
      input: "Farmer Profile",
      model: "Schemes Database",
      output: "Eligible Programs"
    },
    route: "/schemes"
  },
  {
    id: "mobile-app",
    title: "PWA Mobile App",
    description: "Install app for offline access",
    icon: Smartphone,
    color: "bg-gradient-to-br from-purple-500 to-purple-600",
    tech: {
      input: "One Tap",
      model: "Service Workers",
      output: "Offline Enabled"
    },
    route: "/"
  }
];

export default function FeaturesWithTech() {
  const navigate = useNavigate();

  return (
    <section className="py-10 sm:py-14 md:py-24 bg-white">
      <div className="container px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16 space-y-3 sm:space-y-4">
          <Badge variant="outline" className="mx-auto">
            <Code className="w-3 h-3 mr-1" />
            Feature Breakdown
          </Badge>
          <h2 className="text-xl sm:text-3xl md:text-5xl font-bold text-gray-900">
            Features with Technical Depth
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Each module is built with production-grade architecture
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.id}
                className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => navigate(feature.route)}
              >
                <div className={`absolute top-0 right-0 w-24 h-24 ${feature.color} opacity-5 group-hover:opacity-10 transition-opacity`} />

                <CardHeader className="relative pb-2 sm:pb-3 p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2.5 sm:p-3 rounded-lg ${feature.color} shadow-lg`}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <Badge variant="secondary" className="text-[10px] sm:text-xs">System Module</Badge>
                  </div>
                  <CardTitle className="text-sm sm:text-xl text-gray-900 group-hover:text-green-600 transition-colors leading-snug">
                    {feature.title}
                  </CardTitle>
                  <p className="text-[11px] sm:text-sm text-gray-600 mt-1 line-clamp-1 sm:line-clamp-2">{feature.description}</p>
                </CardHeader>

                <CardContent className="space-y-3 sm:space-y-4 relative p-4 pt-0 sm:p-6 sm:pt-0">
                  {/* Mobile: compact summary (reduces card height) */}
                  <div className="sm:hidden rounded-lg bg-gray-50 border border-gray-100 px-3 py-2">
                    <p className="text-[11px] text-gray-600 leading-snug line-clamp-2">
                      <span className="font-semibold text-gray-800">Tech:</span>{" "}
                      <span className="font-mono text-green-700">{feature.tech.model}</span>
                    </p>
                  </div>

                  {/* sm+: full tech stack box */}
                  <div className="hidden sm:block bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Input</p>
                      <p className="text-[11px] sm:text-sm font-mono text-gray-700">{feature.tech.input}</p>
                    </div>
                    <div className="border-t border-gray-200 pt-2 sm:pt-3">
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Technology</p>
                      <p className="text-[11px] sm:text-sm font-mono text-green-700">{feature.tech.model}</p>
                    </div>
                    <div className="border-t border-gray-200 pt-2 sm:pt-3">
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Output</p>
                      <p className="text-[11px] sm:text-sm font-mono text-gray-700">{feature.tech.output}</p>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    className="w-full group-hover:bg-green-50 group-hover:text-green-600 transition-colors h-8 sm:h-10 text-xs sm:text-sm"
                  >
                    Try Now
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
