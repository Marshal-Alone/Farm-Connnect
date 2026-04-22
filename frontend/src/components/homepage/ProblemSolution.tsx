import { ArrowRight, AlertCircle, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const problems = [
  {
    problem: "Farmers lack disease identification knowledge",
    solution: "AI analyzes crops instantly with 95% accuracy",
    icon: AlertCircle
  },
  {
    problem: "No real-time weather + farming advisory",
    solution: "7-day forecasts with crop-specific recommendations",
    icon: AlertCircle
  },
  {
    problem: "Difficult to access machinery resources",
    solution: "Peer-to-peer marketplace with approval workflow",
    icon: AlertCircle
  },
  {
    problem: "Unaware of government farming schemes",
    solution: "Centralized database with eligibility checker",
    icon: AlertCircle
  }
];

export default function ProblemSolution() {
  return (
    <section className="py-10 sm:py-14 md:py-24 bg-gradient-to-r from-gray-50 to-white">
      <div className="container px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12 md:mb-16 space-y-3 sm:space-y-4">
          <Badge variant="outline" className="mx-auto">
            <Zap className="w-3 h-3 mr-1" />
            Problem & Solution
          </Badge>
          <h2 className="text-xl sm:text-4xl md:text-5xl font-bold text-gray-900">
            Real Problems, Complete Solutions
          </h2>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {problems.map((item, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
              {/* Problem */}
              <div className="bg-red-50 border-l-4 border-red-500 p-4 sm:p-6 rounded-r-lg">
                <h3 className="font-bold text-base sm:text-lg text-red-900 mb-2 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  Problem
                </h3>
                <p className="text-sm sm:text-base text-red-700">{item.problem}</p>
              </div>

              {/* Arrow */}
              <div className="flex justify-center md:hidden">
                <ArrowRight className="w-6 h-6 text-green-500 rotate-90 md:rotate-0" />
              </div>

              {/* Solution */}
              <div className="bg-green-50 border-l-4 border-green-500 p-4 sm:p-6 rounded-r-lg">
                <h3 className="font-bold text-base sm:text-lg text-green-900 mb-2 flex items-start gap-2">
                  <Zap className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  Solution
                </h3>
                <p className="text-sm sm:text-base text-green-700">{item.solution}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
