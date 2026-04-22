import { ArrowDown, Camera, Brain, Lightbulb, CheckCircle, Smartphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const steps = [
  {
    number: "1",
    title: "Upload Crop Image",
    description: "Farmer captures leaf image using mobile/web camera",
    icon: Camera,
    color: "text-blue-500"
  },
  {
    number: "2",
    title: "AI Analysis",
    description: "CNN model processes image and detects disease",
    icon: Brain,
    color: "text-purple-500"
  },
  {
    number: "3",
    title: "Get Recommendations",
    description: "Receive treatment steps + prevention tips",
    icon: Lightbulb,
    color: "text-yellow-500"
  },
  {
    number: "4",
    title: "Check Weather",
    description: "Get weather forecast + spray timing advice",
    icon: Smartphone,
    color: "text-green-500"
  },
  {
    number: "5",
    title: "Take Action",
    description: "Buy supplies, rent equipment, apply for schemes",
    icon: CheckCircle,
    color: "text-emerald-500"
  }
];

export default function HowItWorks() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="container px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 space-y-4">
          <Badge variant="outline" className="mx-auto">
            <ArrowDown className="w-3 h-3 mr-1" />
            System Workflow
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
            How FarmConnect Works
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Complete workflow from disease detection to action
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx}>
                <div className="flex gap-6 md:gap-8 mb-8">
                  {/* Step Number Circle */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center border-4 border-white shadow-lg`}>
                      <Icon className={`w-7 h-7 md:w-8 md:h-8 ${step.color}`} />
                    </div>
                    {idx !== steps.length - 1 && (
                      <div className="w-1 h-12 md:h-16 bg-gradient-to-b from-green-400 to-gray-200 mt-2" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="pb-8">
                    <div className="flex items-baseline gap-3">
                      <span className="text-2xl md:text-3xl font-bold text-green-600">Step {step.number}</span>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900">{step.title}</h3>
                    </div>
                    <p className="text-base text-gray-600 mt-2 max-w-lg">{step.description}</p>
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
