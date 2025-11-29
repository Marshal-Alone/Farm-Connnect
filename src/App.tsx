import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import OfflineIndicator from "@/components/OfflineIndicator";
import { useEffect } from "react";
import HomePage from "./pages/HomePage";
import DiseaseDetection from "./pages/DiseaseDetection";
import MachineryDetail from "./pages/MachineryDetail";
import BookingHistory from "./pages/BookingHistory";
import OwnerDashboard from "./pages/OwnerDashboard";
import MachineryForm from "./pages/MachineryForm";

import Weather from "./pages/Weather";
import MachineryMarketplace from "./pages/MachineryMarketplace";
import GovernmentSchemes from "./pages/GovernmentSchemes";
import UserProfile from "./pages/UserProfile";
import KisanBazaar from "./pages/KisanBazaar";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        const swUrl = `${window.location.origin}/sw.js`;
        navigator.serviceWorker
          .register(swUrl)
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/disease-detection" element={<DiseaseDetection />} />

                <Route path="/weather" element={<Weather />} />
                <Route path="/machinery" element={<MachineryMarketplace />} />
                <Route path="/machinery/:id" element={<MachineryDetail />} />
                <Route path="/machinery/add" element={<MachineryForm />} />
                <Route path="/bookings" element={<BookingHistory />} />
                <Route path="/owner/dashboard" element={<OwnerDashboard />} />
                <Route path="/schemes" element={<GovernmentSchemes />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/bazaar" element={<KisanBazaar />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
            <PWAInstallPrompt />
            <OfflineIndicator />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
