import { Badge } from "@/components/ui/badge";
import { Database, Code, Cpu, Cloud, Server } from "lucide-react";

const stack = [
  {
    category: "Frontend",
    icon: Code,
    color: "text-blue-500",
    tech: ["React 18", "TypeScript", "Tailwind CSS", "Shadcn UI", "Vite"]
  },
  {
    category: "Backend",
    icon: Server,
    color: "text-purple-500",
    tech: ["Node.js", "Express.js", "RESTful API", "JWT Auth"]
  },
  {
    category: "Database",
    icon: Database,
    color: "text-green-500",
    tech: ["MongoDB", "Collections", "Aggregation"]
  },
  {
    category: "AI/ML",
    icon: Cpu,
    color: "text-red-500",
    tech: ["CNN", "TensorFlow", "Groq LLM", "Vision AI"]
  },
  {
    category: "APIs & Services",
    icon: Cloud,
    color: "text-yellow-500",
    tech: ["WeatherAPI.com", "Groq Vision", "Google Gemini", "Voice Recognition"]
  },
  {
    category: "PWA & Deployment",
    icon: Cloud,
    color: "text-indigo-500",
    tech: ["Service Workers", "Offline Mode", "Vercel", "Docker"]
  }
];

export default function TechStack() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16 space-y-4">
          <Badge variant="outline" className="mx-auto">
            <Cpu className="w-3 h-3 mr-1" />
            Technology Stack
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
            Enterprise-Grade Tech
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Built with production-ready technologies
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stack.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-200 to-blue-200 rounded-lg opacity-0 group-hover:opacity-50 blur transition duration-1000 group-hover:duration-200" />
                <div className="relative bg-white px-6 py-8 rounded-lg border border-gray-200 hover:border-green-300 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className={`w-6 h-6 ${item.color}`} />
                    <h3 className="text-lg font-bold text-gray-900">{item.category}</h3>
                  </div>
                  <div className="space-y-2">
                    {item.tech.map((t, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-sm text-gray-700 font-mono">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
