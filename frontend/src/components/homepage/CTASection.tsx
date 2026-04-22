import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Smartphone, Download, ArrowRight } from "lucide-react";

export default function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-green-600 via-emerald-600 to-green-600">
      <div className="container px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              Start Your Smart Farming Journey Today
            </h2>
            <p className="text-lg text-white/90">
              Join thousands of farmers already using FarmConnect to improve their yield and reduce losses.
            </p>
          </div>

          {/* Main CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="h-14 px-8 text-base bg-white text-green-600 hover:bg-gray-100 font-bold rounded-xl"
              onClick={() => navigate("/disease-detection")}
            >
              <Smartphone className="w-5 h-5 mr-2" />
              Try Disease Detection
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 text-base border-white text-black hover:bg-white/20 font-bold rounded-xl"
            >
              <Download className="w-5 h-5 mr-2" />
              Install PWA App
            </Button>
          </div>

          {/* PWA Highlight */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 md:p-8">
            <p className="text-white/90 mb-3">
              📱 <span className="font-semibold">PWA Mobile App:</span> Install FarmConnect on your phone for offline access, push notifications, and a native app experience.
            </p>
            <p className="text-sm text-white/70">
              Works on iOS and Android • No internet needed • Syncs when connection returns
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
