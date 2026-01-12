import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { 
  Brain, 
  TrendingUp, 
  Droplets, 
  Thermometer,
  Eye,
  Download,
  ArrowRight,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

const insights = [
  {
    id: "growth",
    title: "Growth Rate",
    value: "12% per week",
    change: "+8%",
    status: "excellent",
    icon: TrendingUp,
    color: "text-success",
    bgColor: "bg-success/10",
    description: "Optimal growth rate for current season"
  },
  {
    id: "irrigation",
    title: "Irrigation Needs",
    value: "Next watering in 2 days",
    change: "Optimal",
    status: "good",
    icon: Droplets,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    description: "Soil moisture at 65%, perfect level"
  },
  {
    id: "temperature",
    title: "Growth Temperature",
    value: "28°C",
    change: "Ideal",
    status: "perfect",
    icon: Thermometer,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    description: "Perfect temperature for crop development"
  },
  {
    id: "disease",
    title: "Disease Risk",
    value: "Low Risk",
    change: "-5%",
    status: "safe",
    icon: Eye,
    color: "text-success",
    bgColor: "bg-success/10",
    description: "No immediate threats detected"
  }
];

const recommendations = [
  {
    id: 1,
    type: "urgent",
    title: "Apply Nitrogen Fertilizer",
    description: "Soil analysis shows nitrogen deficiency. Apply 50kg/hectare.",
    priority: "High",
    daysLeft: 3,
    icon: AlertTriangle,
    color: "text-warning"
  },
  {
    id: 2,
    type: "normal", 
    title: "Pest Monitoring",
    description: "Increase monitoring frequency as temperature rises.",
    priority: "Medium",
    daysLeft: 7,
    icon: Eye,
    color: "text-blue-500"
  },
  {
    id: 3,
    type: "completed",
    title: "Soil Testing Complete",
    description: "Latest soil test results show improved pH levels.",
    priority: "Low",
    daysLeft: 0,
    icon: CheckCircle,
    color: "text-success"
  }
];

export default function AIInsights() {
  const [selectedInsight, setSelectedInsight] = useState(insights[0]);
  const navigate = useNavigate();

  const downloadReport = () => {
    // Simulate report download
    const reportData = {
      date: new Date().toLocaleDateString(),
      insights: insights,
      recommendations: recommendations
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `farm-insights-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <section className="py-16 bg-gradient-to-br from-background to-muted/30">
      <div className="container px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Brain className="w-3 h-3 mr-1" />
            AI-Powered Insights
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Smart Farming
            <span className="block text-primary">Analytics Dashboard</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get real-time insights about your crops with AI-powered analysis and 
            personalized recommendations for optimal farming decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Insights Cards */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Insights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.map((insight) => {
                const Icon = insight.icon;
                return (
                  <Card 
                    key={insight.id}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      selectedInsight.id === insight.id ? 'ring-2 ring-primary shadow-lg' : ''
                    }`}
                    onClick={() => setSelectedInsight(insight)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className={`p-2 rounded-lg ${insight.bgColor}`}>
                          <Icon className={`w-5 h-5 ${insight.color}`} />
                        </div>
                        <Badge 
                          variant={insight.status === 'excellent' ? 'default' : 'secondary'}
                          className={insight.status === 'excellent' ? 'bg-success' : ''}
                        >
                          {insight.change}
                        </Badge>
                      </div>
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {insight.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-2xl font-bold">{insight.value}</div>
                        <p className="text-xs text-muted-foreground">
                          {insight.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Detailed View */}
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <selectedInsight.icon className={`w-5 h-5 mr-2 ${selectedInsight.color}`} />
                  {selectedInsight.title} Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Current Value</span>
                    <div className="text-xl font-semibold">{selectedInsight.value}</div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Trend</span>
                    <div className={`text-xl font-semibold ${selectedInsight.color}`}>
                      {selectedInsight.change}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Status</span>
                    <div className="text-xl font-semibold capitalize">{selectedInsight.status}</div>
                  </div>
                </div>
                
                {/* Progress Bar Example */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Optimal Range</span>
                    <span>85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate("/disease-detection")}
                  >
                    View Detailed Analysis
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={downloadReport}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendations.map((rec) => {
                  const Icon = rec.icon;
                  return (
                    <div key={rec.id} className="space-y-3 p-3 rounded-lg bg-muted/30">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <Icon className={`w-4 h-4 ${rec.color}`} />
                          <Badge 
                            variant={rec.priority === 'High' ? 'destructive' : rec.priority === 'Medium' ? 'secondary' : 'outline'}
                            className="text-xs"
                          >
                            {rec.priority}
                          </Badge>
                        </div>
                        {rec.daysLeft > 0 && (
                          <span className="text-xs text-muted-foreground">
                            {rec.daysLeft} days left
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{rec.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {rec.description}
                        </p>
                      </div>
                      {rec.type !== 'completed' && (
                        <Button variant="outline" size="sm" className="w-full text-xs">
                          Take Action
                        </Button>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">This Week</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tasks Completed</span>
                    <span className="font-medium">8/12</span>
                  </div>
                  <Progress value={67} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-success">98%</div>
                    <div className="text-xs text-muted-foreground">Health Score</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">15</div>
                    <div className="text-xs text-muted-foreground">Days to Harvest</div>
                  </div>
                </div>

                <Button 
                  variant="hero" 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigate("/disease-detection")}
                >
                  View Farm Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}