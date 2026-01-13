import { useEffect, useState } from 'react';
import { GraduationCap, Sparkles, Code, Database, Palette, Server, Brain, BookOpen, ShieldCheck, MessageSquare } from 'lucide-react';

// Team member data with detailed info
const teamMembers = [
    {
        name: "Marshal Alone",
        role: "Lead Developer",
        initials: "MA",
        skills: ["Infrastructure", "Auth", "AI Core"],
        id: "1",
        contribution: "Express server architecture, secure authentication and AI integration engine",
        icon: Brain,
        image: "/assets/team/marshal.png",
        color: "from-green-500 to-emerald-600",
        glow: "rgba(34, 197, 94, 0.3)",
        textColor: "#22c55e"
    },
    {
        name: "Vaishnavi Getme",
        role: "Systems Architect & Co-Lead",
        initials: "VG",
        skills: ["Chat API", "MongoDB", "PWA", "Detection System"],
        id: "2",
        contribution: "Systems architecture lead, communication systems and disease detection implementation",
        icon: Database,
        image: "/assets/team/vaishnavi.png",
        color: "from-pink-500 to-rose-600",
        glow: "rgba(244, 63, 94, 0.3)",
        textColor: "#f43f5e"
    },
    {
        name: "Aditya Kawale",
        role: "Core Developer",
        initials: "AK",
        skills: ["Machinery Catalog", "Booking Logic", "QA"],
        id: "3",
        contribution: "Machinery marketplace engine, transaction states and system verification",
        icon: ShieldCheck,
        image: "",
        color: "from-blue-500 to-indigo-600",
        glow: "rgba(59, 130, 246, 0.3)",
        textColor: "#3b82f6"
    },
    {
        name: "Sanskruti Patil",
        role: "Project Management",
        initials: "SP",
        skills: ["Technical Research", "Data Systems", "Documentation"],
        id: "4",
        contribution: "Technical feature research, data management and comprehensive project documentation",
        icon: Code,
        image: "",
        color: "from-orange-500 to-amber-600",
        glow: "rgba(245, 158, 11, 0.3)",
        textColor: "#f59e0b"
    },
    {
        name: "Mrunali Umak",
        role: "UI/UX Designer",
        initials: "MU",
        skills: ["Frontend", "UI Design", "Animations"],
        id: "5",
        contribution: "User interface design, animations and frontend excellence",
        icon: Database,
        image: "",
        color: "from-cyan-500 to-teal-600",
        glow: "rgba(6, 182, 212, 0.3)",
        textColor: "#06b6d4"
    },
];

export default function Credits() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-green-500/30 selection:text-green-200">
            {/* Dynamic Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[100px]" />

                {/* Subtle Grid overlay */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 flex flex-col items-center">
                {/* Project badge */}
                <div
                    className={`mb-5 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                        <BookOpen className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-medium text-blue-300/90">B.Tech Major Project 2025-26</span>
                    </div>
                </div>

                {/* Main title */}
                <div
                    className={`text-center mb-10 transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
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
                    className={`text-white/30 text-center max-w-md mb-8 transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
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
                </div>

                {/* Team Section */}
                {/* <div className="w-full space-y-12 mb-32">
                    <div className="flex items-center gap-4 px-4 overflow-hidden">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        <span className="text-[10px] font-black tracking-[0.5em] uppercase text-white/20 whitespace-nowrap">The Research & Engineering Team</span>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-6 gap-8 max-w-6xl mx-auto">
                        {teamMembers.map((member, idx) => (
                            <TeamCard
                                key={member.name}
                                member={member}
                                index={idx}
                                mounted={mounted}
                                className={idx < 2 ? "md:col-span-3" : "md:col-span-2"}
                            />
                        ))}
                    </div>
                </div> */}

                {/* Unified Team Grid (2-2-1 Layout) */}
                <div className="w-full max-w-6xl mx-auto space-y-10 mb-32">

                    {/* Row 1: 2 Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {teamMembers.slice(0, 2).map((member, idx) => (
                            <TeamCard key={member.name} member={member} index={idx} mounted={mounted} />
                        ))}
                    </div>

                    {/* Row 2: 2 Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {teamMembers.slice(2, 4).map((member, idx) => (
                            <TeamCard key={member.name} member={member} index={idx + 2} mounted={mounted} />
                        ))}
                    </div>

                    {/* Row 3: 1 Centered Card */}
                    <div className="flex justify-center">
                        <div className="w-full md:w-1/2">
                            <TeamCard member={teamMembers[4]} index={4} mounted={mounted} />
                        </div>
                    </div>
                </div>
                {/* Support/Footer Section */}
                <div className={`mt-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 transition-all duration-1000 delay-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-sm group hover:border-white/10 transition-all">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 rounded-2xl bg-white/5 text-white/60 group-hover:bg-white/10 group-hover:text-white transition-all">
                                <GraduationCap size={24} />
                            </div>
                            <div>
                                <h4 className="text-xs font-black tracking-widest text-white/20 uppercase">Project Guide</h4>
                                <p className="text-xl font-bold text-white/80">Prof. Tejas Dhule</p>
                            </div>
                        </div>
                        <p className="text-sm text-white/40 font-light">Assistant Professor, Dept of Computer Science & Engineering.</p>
                    </div>

                    <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-sm group hover:border-white/10 transition-all">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 rounded-2xl bg-white/5 text-white/60 group-hover:bg-white/10 group-hover:text-white transition-all">
                                <Sparkles size={24} />
                            </div>
                            <div>
                                <h4 className="text-xs font-black tracking-widest text-white/20 uppercase">Institution</h4>
                                <p className="text-xl font-bold text-white/80">NIT Nagpur</p>
                            </div>
                        </div>
                        <p className="text-sm text-white/40 font-light">Nagpur Institute of Technology. Session 2025-26.</p>
                    </div>
                </div>

                {/* Thank You Section */}
                <div className={`mt-40 text-center space-y-8 transition-all duration-1000 delay-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="relative group inline-block">
                        <h2 className="text-5xl md:text-8xl font-black italic tracking-tighter opacity-10 group-hover:opacity-100 transition-all duration-700 cursor-default uppercase whitespace-nowrap">
                            Thank You
                        </h2>
                    </div>
                    <p className="text-[10px] font-bold tracking-[0.8em] uppercase text-white/5">Engineered for Indian Agriculture</p>
                </div>
            </div>
        </div>
    );
}

function TeamCard({ member, index, mounted, className = "" }: { member: any, index: number, mounted: boolean, className?: string }) {
    const Icon = member.icon;
    const rgb = member.glow.match(/\d+,\s*\d+,\s*\d+/)?.[0];

    return (
        <div
            className={`relative group transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'} ${className}`}
            style={{
                transitionDelay: `${index * 150}ms`,
                '--hover-glow': member.glow
            } as any}
        >
            {/* Decorative Background Number */}

            <span
                style={{ color: `rgba(${rgb})` }}
                className="
    pointer-events-none
    absolute -top-10 -left-6
    text-8xl font-black italic tracking-tighter
    opacity-0
    group-hover:opacity-100
    transition-opacity duration-700
    select-none z-20
  "
            >
                #{member.id}
            </span>

            <div className="relative isolate rounded-[2.5rem] bg-white/[0.01] border border-white/[0.05] p-8 h-full min-h-[400px] flex flex-col items-center justify-between text-center overflow-visible hover:bg-white/[0.02] hover:border-white/10 transition-all duration-500 backdrop-blur-lg shadow-2xl">
                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                    style={{ boxShadow: `0 0 60px -20px ${member.glow}` }}
                />

                {/* Pop-out Effect */}
                <div className="relative mb-8 w-40 h-40 flex items-center justify-center">
                    <div className={`absolute inset-2 rounded-3xl bg-gradient-to-br ${member.color} opacity-20 group-hover:opacity-40 transition-all duration-500 rotate-3 group-hover:rotate-6`} />
                    <div className="relative w-full h-full z-10 flex items-center justify-center overflow-visible">
                        {member.image ? (
                            <img
                                src={member.image}
                                alt={member.name}
                                className="w-[130%] h-[130%] object-contain mb-10 transform translate-y-0 group-hover:translate-y-[-65px] group-hover:scale-110 transition-all duration-500 drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)]"
                            />
                        ) : (
                            <div className="w-full h-full rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md transform group-hover:scale-105 transition-all">
                                <span className={`text-4xl font-black bg-gradient-to-br ${member.color} bg-clip-text text-transparent`}>{member.initials}</span>
                            </div>
                        )}
                    </div>
                    <div className="absolute -bottom-2 -right-2 p-3 rounded-2xl bg-[#0a0a0a] border border-white/10 shadow-xl z-20 transform -rotate-12 group-hover:rotate-0 transition-transform">
                        <Icon size={18} className="text-white/80" />
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-4 relative z-10 w-full">
                    <div className="space-y-1">
                        <h3 className="font-black tracking-tight text-2xl text-white group-hover:scale-105 transition-transform origin-center">
                            {member.name}
                        </h3>
                        <p className={`text-[10px] font-black uppercase tracking-[0.4em] bg-gradient-to-r ${member.color} bg-clip-text text-transparent`}>
                            {member.role}
                        </p>
                    </div>
                    <p className="text-xs text-white/40 line-clamp-2 px-4 italic leading-relaxed font-light">"{member.contribution}"</p>
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                        {member.skills.map((skill: string) => (
                            <span key={skill} className="px-3 py-1 rounded-full bg-white/[0.03] border border-white/5 text-[9px] font-bold tracking-wider text-white/20 hover:text-white/60 hover:bg-white/5 transition-all uppercase whitespace-nowrap">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
