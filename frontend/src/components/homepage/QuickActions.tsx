import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Camera, 
  BarChart3, 
  Cloud, 
  Tractor, 
  FileText, 
  Smartphone,
  ArrowRight,
  Zap,
  TrendingUp
} from "lucide-react";

const quickActions = [
  {
    id: "disease-detection",
    title: "Disease Detection",
    description: "AI-powered crop disease identification with treatment recommendations",
    icon: Camera,
    route: "/disease-detection",
    color: "bg-gradient-to-br from-red-500 to-red-600",
    badge: "AI Powered",
    stats: "95% Accuracy"
  },
  {
    id: "weather",
    title: "Weather Insights",
    description: "7-day forecast with agricultural recommendations",
    icon: Cloud,
    route: "/weather",
    color: "bg-gradient-to-br from-sky-500 to-sky-600",
    badge: "Live Data",
    stats: "24/7 Updates"
  },
  {
    id: "machinery",
    title: "Machinery Rental",
    description: "Rent or lease farming equipment from nearby providers",
    icon: Tractor,
    route: "/machinery",
    color: "bg-gradient-to-br from-orange-500 to-orange-600",
    badge: "Marketplace",
    stats: "500+ Equipment"
  },
  {
    id: "schemes",
    title: "Government Schemes",
    description: "Access and apply for agricultural subsidies and schemes",
    icon: FileText,
    route: "/schemes",
    color: "bg-gradient-to-br from-green-500 to-green-600",
    badge: "Official",
    stats: "50+ Schemes"
  },
  {
    id: "mobile-app",
    title: "Mobile App",
    description: "Download our mobile app for offline access and notifications",
    icon: Smartphone,
    route: "/mobile-app",
    color: "bg-gradient-to-br from-purple-500 to-purple-600",
    badge: "Coming Soon",
    stats: "Offline Mode"
  }
];

export default function QuickActions() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleActionClick = (route: string, title: string) => {
    if (route === "/mobile-app") {
      // Simulate mobile app download
      alert("Mobile app download will be available soon!");
      return;
    }
    navigate(route);
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container px-6">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Zap className="w-3 h-3 mr-1" />
            Quick Actions
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to
            <span className="block text-primary">Boost Your Farm</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Access powerful farming tools and resources with just one click. 
            Our AI-powered platform helps you make better decisions for your crops.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card 
                key={action.id} 
                className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                onClick={() => handleActionClick(action.route, action.title)}
              >
                {/* Background Gradient */}
                <div className={`absolute top-0 right-0 w-20 h-20 ${action.color} opacity-10 rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-500`} />
                
                <CardHeader className="relative">
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg ${action.color} shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {action.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {action.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {action.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      {action.stats}
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="group-hover:text-primary group-hover:bg-primary/10 transition-colors"
                    >
                      Try Now
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        {!user && (
          <div className="text-center mt-12">
            <Button 
              size="lg" 
              variant="hero" 
              onClick={() => navigate("/disease-detection")}
              className="group"
            >
              Get Started Now
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}