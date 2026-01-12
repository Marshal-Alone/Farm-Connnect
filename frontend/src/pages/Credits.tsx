import { useEffect, useState } from 'react';
import { BookOpen, GraduationCap, Sparkles, Code, Database, Palette, Server, Brain } from 'lucide-react';

// Team member data with detailed info
const teamMembers = [

    {
        name: "Aditya Kawale",
        role: "Developer",
        initials: "AK",
        skills: ["Backend", "APIs", "Database"],
        contribution: "Backend APIs and database management",
        icon: Server
    },
    {
        name: "Marshal Alone",
        role: "Lead Developer",
        initials: "MA",
        skills: ["React", "Node.js", "AI Integration"],
        contribution: "Full-stack development, AI features, project architecture",
        icon: Brain
    },
    {
        name: "Vaishnavi Getme",
        role: "Developer",
        initials: "VG",
        skills: ["Frontend", "UI/UX", "React"],
        contribution: "User interface design and frontend development",
        icon: Palette
    },
    {
        name: "Sanskruti Patil",
        role: "Developer",
        initials: "SP",
        skills: ["Frontend", "Components", "Testing"],
        contribution: "Component development and quality assurance",
        icon: Code
    },
    {
        name: "Mrunali Umak",
        role: "Developer",
        initials: "MU",
        skills: ["Database", "Documentation", "Research"],
        contribution: "Database design and project documentation",
        icon: Database
    },
];

export default function Credits() {
    const [mounted, setMounted] = useState(false);
    const [hoveredMember, setHoveredMember] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden relative">
            {/* Subtle gradient orbs */}
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-500/5 rounded-full blur-[200px] pointer-events-none" />

            {/* Noise texture overlay */}
            <div
                className="absolute inset-0 opacity-[0.015] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Main content */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-16">

                {/* Project badge */}
                <div
                    className={`mb-8 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                        <BookOpen className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-medium text-blue-300/90">B.Tech Major Project 2025-26</span>
                    </div>
                </div>

                {/* Main title */}
                <div
                    className={`text-center mb-12 transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                >
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-3">
                        <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                            Farm
                        </span>
                        <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                            Connect
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-white/40 font-light tracking-[0.2em] uppercase">
                        Pathway to Progress
                    </p>
                </div>

                {/* Subtitle */}
                <p
                    className={`text-white/30 text-center max-w-md mb-16 transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                >
                    An AI-powered agricultural support platform empowering Indian farmers through technology
                </p>

                {/* Team section */}
                <div
                    className={`w-full max-w-4xl transition-all duration-1000 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                >
                    {/* Section label */}
                    <div className="flex items-center justify-center gap-3 mb-8">
                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/20" />
                        <span className="text-xs font-medium tracking-[0.3em] text-white/40 uppercase">The Team</span>
                        <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/20" />
                    </div>

                    {/* Team grid */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 mb-16">
                        {teamMembers.map((member, index) => {
                            const IconComponent = member.icon;
                            return (
                                <div
                                    key={member.name}
                                    className={`group text-center transition-all duration-700 relative ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                                    style={{ transitionDelay: `${500 + index * 100}ms` }}
                                    onMouseEnter={() => setHoveredMember(member.name)}
                                    onMouseLeave={() => setHoveredMember(null)}
                                >
                                    {/* Avatar */}
                                    <div className="relative mx-auto mb-4 w-20 h-20 md:w-24 md:h-24 cursor-pointer">
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 group-hover:from-green-500/40 group-hover:to-emerald-500/40 transition-all duration-500" />
                                        <div className="absolute inset-[2px] rounded-full bg-[#0a0a0a] flex items-center justify-center group-hover:bg-[#111] transition-colors">
                                            <span className="text-xl md:text-2xl font-semibold bg-gradient-to-br from-green-400 to-emerald-400 bg-clip-text text-transparent">
                                                {member.initials}
                                            </span>
                                        </div>
                                        {/* Glow on hover */}
                                        <div className="absolute inset-0 rounded-full bg-green-500/0 group-hover:bg-green-500/20 blur-xl transition-all duration-500" />
                                    </div>

                                    {/* Name */}
                                    <p className="font-medium text-white/90 text-sm md:text-base mb-1 group-hover:text-white transition-colors">
                                        {member.name}
                                    </p>
                                    <p className="text-xs text-white/30 group-hover:text-green-400/70 transition-colors">
                                        {member.role}
                                    </p>

                                    {/* Hover Card */}
                                    {/* Hover Card - Positioned Above */}
                                    <div
                                        className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-4 w-64 z-50 transition-all duration-300 ${hoveredMember === member.name
                                            ? 'opacity-100 translate-y-0 pointer-events-auto'
                                            : 'opacity-0 translate-y-2 pointer-events-none'
                                            }`}
                                    >
                                        <div className="bg-[#151515] border border-white/10 rounded-xl p-4 shadow-2xl shadow-black/50 backdrop-blur-xl">
                                            {/* Arrow pointing down */}
                                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#151515] border-r border-b border-white/10 rotate-45" />

                                            {/* Card header */}
                                            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-white/5">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500/30 to-emerald-500/30 flex items-center justify-center">
                                                    <IconComponent className="w-5 h-5 text-green-400" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="font-semibold text-white text-sm">{member.name}</p>
                                                    <p className="text-xs text-green-400">{member.role}</p>
                                                </div>
                                            </div>

                                            {/* Contribution */}
                                            <p className="text-xs text-white/50 mb-3 text-left leading-relaxed">
                                                {member.contribution}
                                            </p>

                                            {/* Skills */}
                                            <div className="flex flex-wrap gap-1">
                                                {member.skills.map((skill) => (
                                                    <span
                                                        key={skill}
                                                        className="px-2 py-1 text-[10px] font-medium rounded-full bg-green-500/10 text-green-400 border border-green-500/20"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Guide section */}
                    <div
                        className={`text-center mb-16 transition-all duration-1000 delay-[900ms] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    >
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <div className="h-px w-8 bg-gradient-to-r from-transparent to-white/10" />
                            <GraduationCap className="w-4 h-4 text-white/30" />
                            <span className="text-xs font-medium tracking-[0.3em] text-white/30 uppercase">Project Guide</span>
                            <div className="h-px w-8 bg-gradient-to-l from-transparent to-white/10" />
                        </div>

                        <div className="inline-block px-8 py-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-sm hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300">
                            <p className="font-semibold text-lg text-white/90">Prof. Tejas Dhule</p>
                            <p className="text-sm text-white/40">Assistant Professor</p>
                        </div>
                    </div>

                    {/* Institution */}
                    <div
                        className={`text-center transition-all duration-1000 delay-[1000ms] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    >
                        <p className="text-white/20 text-xs tracking-wider uppercase mb-2">
                            Department of Computer Science & Engineering
                        </p>
                        <p className="text-white/50 font-medium text-lg mb-1">
                            Nagpur Institute of Technology
                        </p>
                        <p className="text-white/20 text-sm">
                            Session 2025-2026
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div
                    className={`mt-16 transition-all duration-1000 delay-[1100ms] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                >
                    <div className="flex items-center gap-2 text-white/20 text-sm mb-6">
                        <Sparkles className="w-4 h-4" />
                        <span>Powered by AI • Built for Indian Farmers</span>
                        <Sparkles className="w-4 h-4" />
                    </div>
                </div>

                {/* Thank you */}
                <div
                    className={`mt-4 transition-all duration-1000 delay-[1200ms] ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                >
                    <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                        Thank You
                    </p>
                </div>
            </div>
        </div>
    );
}
