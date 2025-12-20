import HeroSection from "@/components/homepage/HeroSection";
import MachineryRental from "@/components/homepage/MachineryRental";
import QuickActions from "@/components/homepage/QuickActions";
import AIInsights from "@/components/homepage/AIInsights";
import VoiceInterface from "@/components/VoiceInterface";
import AIAnalyticsDashboard from "@/components/AIAnalyticsDashboard";
import SmartWeatherDashboard from "@/components/SmartWeatherDashboard";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <QuickActions />

      {/* Voice Interface Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Voice-Powered Farming Assistant</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get instant farming advice in your preferred language using our AI voice assistant
            </p>
          </div>
          <div className="flex justify-center">
            <VoiceInterface />
          </div>
        </div>
      </section>

      <AIInsights />

      {/* Advanced Analytics Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <AIAnalyticsDashboard />
        </div>
      </section>

      {/* Smart Weather Section */}
      <section className="py-16 bg-muted/20">
        <div className="container">
          <SmartWeatherDashboard />
        </div>
      </section>

      <MachineryRental />
    </div>
  );
}