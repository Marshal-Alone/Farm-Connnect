import { BarChart3, Globe, Zap, Users } from "lucide-react";

const metrics = [
  {
    icon: BarChart3,
    value: "95%",
    label: "Disease Detection Accuracy",
    description: "CNN model trained on 5000+ plant images"
  },
  {
    icon: Globe,
    value: "12+",
    label: "Languages Supported",
    description: "Multi-language UI for Indian farmers"
  },
  {
    icon: Zap,
    value: "Offline",
    label: "PWA Works Without Internet",
    description: "Designed for rural low-network areas"
  },
  {
    icon: Users,
    value: "50K+",
    label: "Active Farmer Community",
    description: "Collaborative marketplace ecosystem"
  }
];

export default function ImpactMetrics() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
      <div className="container px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">System Impact Metrics</h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Real numbers showing the scale and quality of our smart farming solution
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <div key={idx} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <Icon className="w-10 h-10 text-yellow-300 mb-4" />
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{metric.value}</div>
                <h3 className="text-sm md:text-base font-semibold text-white mb-2">{metric.label}</h3>
                <p className="text-xs md:text-sm text-white/80">{metric.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
