import HeroSection from "@/components/homepage/HeroSection";
import WhatWeBuilt from "@/components/homepage/WhatWeBuilt";
import ImpactMetrics from "@/components/homepage/ImpactMetrics";
import FeaturesWithTech from "@/components/homepage/FeaturesWithTech";
import HowItWorks from "@/components/homepage/HowItWorks";
import TechStack from "@/components/homepage/TechStack";
import ProblemSolution from "@/components/homepage/ProblemSolution";
import CTASection from "@/components/homepage/CTASection";
import SEO from "@/components/SEO";

export default function HomePage() {
    return (
        <>
            <SEO
                title="FarmConnect - AI-Powered Smart Farming Ecosystem"
                description="Complete AI agriculture platform: disease detection, weather insights, machinery rental, government schemes, and PWA for farmers"
                url="https://farmbro.vercel.app/"
            />
            <div className="min-h-screen">
                <HeroSection />
                <FeaturesWithTech />
                <WhatWeBuilt />
                <HowItWorks />
                <TechStack />
                <ProblemSolution />
                <ImpactMetrics />
                <CTASection />
            </div>
        </>
    );
}
