import HeroSection from "@/components/homepage/HeroSection";
import QuickActions from "@/components/homepage/QuickActions";
import SEO from "@/components/SEO";

export default function HomePage() {
    return (
        <>
            <SEO
                title="Farm-Connect - AI Smart Agriculture"
                description="The #1 AI platform for farmers. Detect crop diseases, rent machinery, and get real-time weather insights. Join FarmConnect today."
                url="https://farmbro.vercel.app/"
            />
            <div className="min-h-screen">
                <HeroSection />
                <QuickActions />
            </div>
        </>
    );
}
