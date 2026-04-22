import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  Leaf,
  Calendar,
  Stethoscope,
  Phone,
  FileText
} from "lucide-react";

const features = [
  {
    id: "mandi-price",
    title: "Mandi Price",
    description: "Check market rates",
    icon: TrendingUp,
    color: "bg-gradient-to-br from-amber-500 to-orange-600",
    route: "/mandi-price"
  },
  {
    id: "soil-nutrients",
    title: "Soil and Nutrients",
    description: "Soil analysis & tips",
    icon: Leaf,
    color: "bg-gradient-to-br from-green-500 to-emerald-600",
    route: "/soil-nutrients"
  },
  {
    id: "crop-calendar",
    title: "Crop Calendar",
    description: "Seasonal guide",
    icon: Calendar,
    color: "bg-gradient-to-br from-blue-500 to-cyan-600",
    route: "/crop-calendar"
  },
  {
    id: "crop-diagnosis",
    title: "Crop Diagnosis",
    description: "Disease detection",
    icon: Stethoscope,
    color: "bg-gradient-to-br from-pink-500 to-rose-600",
    route: "/disease-detection"
  },
  {
    id: "helpline",
    title: "Helpline Number",
    description: "Expert support",
    icon: Phone,
    color: "bg-gradient-to-br from-red-500 to-pink-600",
    route: "/helpline"
  },
  {
    id: "schemes",
    title: "Government Schemes",
    description: "Apply for benefits",
    icon: FileText,
    color: "bg-gradient-to-br from-indigo-500 to-purple-600",
    route: "/schemes"
  }
];

export default function EasyAccess() {
  const navigate = useNavigate();

  return (
    <section className="py-8 md:py-16 bg-gradient-to-b from-white to-green-50/50">
      <div className="container px-4 sm:px-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Easy Access</h2>
          <p className="text-muted-foreground">Quick shortcuts to important farming tools</p>
        </div>

        {/* 2x3 Grid - 2 columns on all screen sizes */}
        <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-2xl mx-auto">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.id}
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-primary border-2 border-transparent overflow-hidden"
                onClick={() => navigate(feature.route)}
              >
                <CardContent className="p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-4">
                  {/* Icon Container */}
                  <div className={`p-4 rounded-full ${feature.color} shadow-lg`}>
                    <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>

                  {/* Title */}
                  <div className="space-y-1">
                    <h3 className="font-semibold text-base sm:text-lg text-foreground group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
