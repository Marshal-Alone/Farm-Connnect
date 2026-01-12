import HeroSection from "@/components/homepage/HeroSection";
import QuickActions from "@/components/homepage/QuickActions";

export default function HomePage() {
    return (
        <div className="min-h-screen">
            <HeroSection />
            <QuickActions />
        </div>
    );
}