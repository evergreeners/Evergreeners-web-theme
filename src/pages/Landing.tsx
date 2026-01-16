
import { PublicHeader } from "@/components/PublicHeader";
import { StreakDisplay } from "@/components/StreakDisplay";
import { ActivityGrid } from "@/components/ActivityGrid";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Github, GitBranch, Flame } from "lucide-react";
import { Section } from "@/components/Section";

export default function Landing() {
    // Demo data for visual elements
    const activityData = Array.from({ length: 84 }, () =>
        Math.random() > 0.4 ? Math.floor(Math.random() * 5) : 0
    );

    return (
        <div className="min-h-screen bg-background overflow-hidden relative selection:bg-primary/30">

            {/* Abstract Background Blobs */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] animate-pulse-slow" />
                <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
                <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '4s' }} />
            </div>

            <PublicHeader />

            <main className="relative z-10 pt-32 pb-20 px-4">
                {/* Hero Section */}
                <div className="container mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8 text-center lg:text-left animate-fade-in">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                                Live Beta Available
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                                Keep Your <br />
                                <span className="text-gradient hover:scale-[1.02] inline-block transition-transform duration-300">Habits Green</span>
                            </h1>

                            <p className="text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
                                Visualize your consistency, complete daily goals, and maintain your streaks.
                                Gamify your productivity with GitHub-style contribution graphs for everything you do.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                                <Link
                                    to="/signup"
                                    className="px-8 py-4 bg-primary text-black font-semibold rounded-xl hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all w-full sm:w-auto flex items-center justify-center gap-2 shadow-[0_0_20px_-5px_hsl(var(--primary))]"
                                >
                                    Start Growing Free <ArrowRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    to="/login"
                                    className="px-8 py-4 bg-secondary text-foreground font-medium rounded-xl hover:bg-secondary/80 border border-border w-full sm:w-auto"
                                >
                                    Existing User
                                </Link>
                            </div>

                            <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 text-muted-foreground/50">
                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="w-8 h-8 rounded-full bg-zinc-800 border border-black" />
                                        ))}
                                    </div>
                                    <span className="text-sm">Joined by 1000+ growers</span>
                                </div>
                            </div>
                        </div>

                        {/* Hero Visual */}
                        <div className="relative animate-fade-up lg:translate-x-12" style={{ animationDelay: "0.2s" }}>
                            <div className="relative z-10 p-6 glass rounded-3xl border-primary/20 shadow-2xl space-y-6">
                                <div className="absolute -top-12 -right-12 bg-primary/20 w-32 h-32 rounded-full blur-3xl" />

                                <StreakDisplay current={47} longest={63} />

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-sm font-medium text-muted-foreground">
                                        <span>Activity Log</span>
                                        <span className="text-primary">Very Active</span>
                                    </div>
                                    <ActivityGrid data={activityData} />
                                </div>
                            </div>

                            {/* Floating Decoration Elements */}
                            <div className="absolute top-1/2 -left-12 p-4 glass rounded-2xl border-primary/10 shadow-xl animate-float hidden lg:block">
                                <Flame className="w-8 h-8 text-orange-500" />
                            </div>
                            <div className="absolute -bottom-8 right-12 p-3 glass rounded-xl border-primary/10 shadow-xl animate-float-delayed hidden lg:block bg-background">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                        <CheckCircle2 className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold">Goal Met</div>
                                        <div className="text-xs text-muted-foreground">Daily Coding</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Features Section */}
            <section className="py-24 bg-secondary/30 border-y border-border/50">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-bold">Everything you need to <span className="text-primary">stay consistent</span></h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Build momentum with tools designed to make habits addictive.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<GitBranch className="w-8 h-8 text-blue-400" />}
                            title="Visualize Progress"
                            description="See your daily efforts accumulate into a beautiful garden of green squares."
                        />
                        <FeatureCard
                            icon={<Flame className="w-8 h-8 text-orange-400" />}
                            title="Maintain Streaks"
                            description="Don't break the chain. Watch your streak count grow and earn badges."
                        />
                        <FeatureCard
                            icon={<Github className="w-8 h-8 text-white" />}
                            title="GitHub Integration"
                            description="Automatically sync your coding activity or manually log other habits."
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5 bg-black py-12">
                <div className="container mx-auto px-4 flex flex-col items-center justify-center space-y-4">
                    <div className="font-bold text-2xl tracking-tighter">Forever Green</div>
                    <p className="text-muted-foreground text-sm">© 2024 Evergreeners Inc. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="p-8 rounded-3xl bg-secondary/50 border border-white/5 hover:border-primary/20 hover:bg-secondary transition-all duration-300 group">
            <div className="mb-6 p-4 rounded-2xl bg-black/20 w-fit group-hover:scale-110 transition-transform duration-300 border border-white/5">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-3">{title}</h3>
            <p className="text-muted-foreground leading-relaxed">
                {description}
            </p>
        </div>
    )
}
