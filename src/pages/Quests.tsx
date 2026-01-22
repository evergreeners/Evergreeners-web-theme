import { Header } from "@/components/Header";
import { FloatingNav } from "@/components/FloatingNav";
import { Section } from "@/components/Section";
import { Compass, Scroll, Zap, Star, Shield, Trophy, GitFork, ExternalLink, RefreshCw, CheckCircle, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const API_URL = import.meta.env.VITE_API_URL || "";

interface Quest {
    id: number;
    title: string;
    description: string;
    repoUrl: string;
    tags: string[];
    difficulty: "Easy" | "Medium" | "Hard";
    points: number;
    status: "available" | "active" | "completed";
    forkUrl?: string;
}

export default function Quests() {
    const [quests, setQuests] = useState<Quest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [checkingId, setCheckingId] = useState<number | null>(null);
    const { data: session } = authClient.useSession();

    // Create Quest State
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newQuestTitle, setNewQuestTitle] = useState("");
    const [newQuestDesc, setNewQuestDesc] = useState("");
    const [newQuestRepo, setNewQuestRepo] = useState("");
    const [newQuestTags, setNewQuestTags] = useState("");
    const [newQuestDiff, setNewQuestDiff] = useState<string>("Easy");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchQuests = async () => {
        try {
            const res = await fetch(`${API_URL}/api/quests`, {
                credentials: "include",
            });
            if (res.ok) {
                const data = await res.json();
                setQuests(data.quests);
            } else {
                console.error("Failed to fetch quests");
            }
        } catch (error) {
            console.error("Error fetching quests:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (session) {
            fetchQuests();
        }
    }, [session]);

    const handleStartQuest = async (id: number) => {
        if (!session) {
            toast.error("Please login first");
            return;
        }

        // Optimistic update
        const previousQuests = [...quests];
        setQuests(quests.map(q => q.id === id ? { ...q, status: "active" } : q));
        toast.info("Accepting quest...");

        try {
            const res = await fetch(`${API_URL}/api/quests/${id}/accept`, {
                method: "POST",
                credentials: "include"
            });

            if (!res.ok) throw new Error("Failed to accept quest");

            toast.success("Quest accepted! Time to fork and code.");
            fetchQuests(); // Refresh to be sure
        } catch (error) {
            console.error(error);
            toast.error("Failed to accept quest");
            setQuests(previousQuests); // Revert
        }
    };

    const handleCheckProgress = async (id: number) => {
        setCheckingId(id);
        toast.info("Checking your progress with GitHub...");

        try {
            const res = await fetch(`${API_URL}/api/quests/${id}/check`, {
                method: "POST",
                credentials: "include"
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Failed to check progress");
            }

            const data = await res.json();

            if (data.progress.status === 'completed') {
                toast.success("Congratulations! Quest Completed!");
                // Celebration effect could go here
            } else if (data.progress.status === 'in_progress') {
                toast.info("Fork detected, but no new commits found yet.");
            } else if (data.progress.status === 'not_started') {
                toast.warning("Could not find your fork. Make sure you forked the repo!");
            } else {
                toast.info(`Status: ${data.progress.status}`);
            }

            fetchQuests(); // Refresh data

        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Error checking progress");
        } finally {
            setCheckingId(null);
        }
    };

    const handleCreateQuest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) return;

        setIsSubmitting(true);
        try {
            const tags = newQuestTags.split(',').map(t => t.trim()).filter(Boolean);
            const res = await fetch(`${API_URL}/api/quests`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: newQuestTitle,
                    description: newQuestDesc,
                    repoUrl: newQuestRepo,
                    difficulty: newQuestDiff,
                    tags: tags,
                    points: newQuestDiff === 'Easy' ? 10 : newQuestDiff === 'Medium' ? 30 : 50
                }),
                credentials: "include"
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Failed to create quest");
            }

            toast.success("Quest created successfully!");
            setIsCreateOpen(false);
            setNewQuestTitle("");
            setNewQuestDesc("");
            setNewQuestRepo("");
            setNewQuestTags("");
            fetchQuests(); // Refresh list

        } catch (error: any) {
            toast.error(error.message || "Failed to create quest");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getDifficultyColor = (diff: string) => {
        switch (diff) {
            case "Easy": return "bg-green-500/10 text-green-500 border-green-500/20";
            case "Medium": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
            case "Hard": return "bg-red-500/10 text-red-500 border-red-500/20";
            default: return "bg-secondary text-muted-foreground";
        }
    };

    return (
        <div className="min-h-screen bg-background custom-scrollbar">
            <Header />

            <main className="w-full max-w-[1600px] mx-auto px-4 pt-24 pb-32 md:px-8 md:pb-12 space-y-8">
                {/* Hero Section */}
                <section className="animate-fade-in text-center py-8">
                    <div className="relative inline-block">
                        <div className="absolute inset-0 blur-3xl bg-primary/30 rounded-full scale-150 animate-pulse-slow" />
                        <div className="relative">
                            <div className="flex items-center justify-center gap-4">
                                <Compass className="w-16 h-16 text-primary animate-pulse-slow" />
                                <span className="text-5xl md:text-7xl font-bold text-gradient">Quests</span>
                            </div>
                            <p className="text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
                                Discover meaningful work, contribute to open source, and advance your career.
                            </p>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Content Column */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Available Quests</h2>
                            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                                <DialogTrigger asChild>
                                    <Button className="gap-2">
                                        <Plus className="w-4 h-4" /> Submit Quest
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Submit a New Quest</DialogTitle>
                                        <DialogDescription>
                                            Add an open source issue or task for others to solve.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleCreateQuest} className="space-y-4 pt-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="title">Title</Label>
                                            <Input
                                                id="title"
                                                placeholder="e.g. Fix button contrast in dark mode"
                                                value={newQuestTitle}
                                                onChange={e => setNewQuestTitle(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="repo">Repository URL</Label>
                                            <Input
                                                id="repo"
                                                placeholder="https://github.com/owner/repo"
                                                value={newQuestRepo}
                                                onChange={e => setNewQuestRepo(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="desc">Description</Label>
                                            <Textarea
                                                id="desc"
                                                placeholder="Describe the task..."
                                                value={newQuestDesc}
                                                onChange={e => setNewQuestDesc(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="diff">Difficulty</Label>
                                                <Select value={newQuestDiff} onValueChange={setNewQuestDiff}>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Easy">Easy (10 XP)</SelectItem>
                                                        <SelectItem value="Medium">Medium (30 XP)</SelectItem>
                                                        <SelectItem value="Hard">Hard (50 XP)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="tags">Tags (comma separated)</Label>
                                                <Input
                                                    id="tags"
                                                    placeholder="bug, ui, react"
                                                    value={newQuestTags}
                                                    onChange={e => setNewQuestTags(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                                            {isSubmitting ? "Submitting..." : "Submit Quest"}
                                        </Button>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <Section className="animate-fade-up" style={{ animationDelay: "0.15s" }}>
                            {isLoading && quests.length === 0 ? (
                                <div className="text-center py-10 text-muted-foreground">Loading quests...</div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {quests.filter(q => q.status === "available").length === 0 && !isLoading && (
                                        <div className="col-span-2 text-center py-10 border border-dashed border-border rounded-xl">
                                            <p className="text-muted-foreground mb-4">No available quests at the moment.</p>
                                            <Button variant="outline" onClick={() => setIsCreateOpen(true)}>Be the first to add one!</Button>
                                        </div>
                                    )}
                                    {quests.filter(q => q.status === "available").map((quest) => (
                                        <Card key={quest.id} className="bg-card/30 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 flex flex-col group">
                                            <CardHeader>
                                                <div className="flex justify-between items-start">
                                                    <Badge variant="outline" className={cn("mb-2", getDifficultyColor(quest.difficulty))}>
                                                        {quest.difficulty}
                                                    </Badge>
                                                    <div className="flex items-center gap-1 text-yellow-500">
                                                        <Zap className="w-4 h-4 fill-current" />
                                                        <span className="font-bold">{quest.points} XP</span>
                                                    </div>
                                                </div>
                                                <CardTitle className="text-xl group-hover:text-primary transition-colors">{quest.title}</CardTitle>
                                                <CardDescription className="line-clamp-2">
                                                    {quest.description}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="flex-grow">
                                                <div className="flex flex-wrap gap-2">
                                                    {quest.tags && quest.tags.map(tag => (
                                                        <span key={tag} className="text-xs px-2 py-1 rounded bg-secondary text-muted-foreground">
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </CardContent>
                                            <CardFooter className="flex justify-between items-center gap-4 mt-auto">
                                                <a
                                                    href={quest.repoUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
                                                >
                                                    <GitFork className="w-4 h-4" /> Repo
                                                </a>
                                                <Button onClick={() => handleStartQuest(quest.id)} className="w-full sm:w-auto">
                                                    Accept Quest
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </Section>

                        {/* Completed Quests Section */}
                        {quests.some(q => q.status === 'completed') && (
                            <Section title="Completed Quests" className="opacity-80">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {quests.filter(q => q.status === 'completed').map(quest => (
                                        <div key={quest.id} className="p-4 rounded-xl border border-green-500/30 bg-green-500/10 flex items-center gap-4">
                                            <div className="p-2 rounded-full bg-green-500/20 text-green-500">
                                                <CheckCircle className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg">{quest.title}</h3>
                                                <p className="text-sm text-green-500/80">Completed! +{quest.points} XP</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Section>
                        )}
                    </div>

                    {/* Sidebar Column */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Active Quests */}
                        <Section title="Your Active Quests" className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
                            <div className="space-y-4">
                                {quests.filter(q => q.status === "active").length === 0 ? (
                                    <div className="p-6 rounded-2xl border border-dashed border-border bg-card/30 text-center">
                                        <Scroll className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                                        <p className="text-muted-foreground">No active quests. Pick one to start!</p>
                                    </div>
                                ) : (
                                    quests.filter(q => q.status === "active").map(quest => (
                                        <div key={quest.id} className="p-5 rounded-2xl border border-primary/50 bg-primary/5 relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                                <Compass className="w-24 h-24 rotate-45" />
                                            </div>
                                            <div className="relative z-10">
                                                <h3 className="font-bold text-lg mb-1">{quest.title}</h3>
                                                <p className="text-sm text-muted-foreground mb-4">{quest.description}</p>

                                                <div className="flex flex-col gap-2">
                                                    <div className="flex gap-2">
                                                        <Button size="sm" variant="secondary" asChild className="flex-1">
                                                            <a href={quest.repoUrl} target="_blank" rel="noreferrer">
                                                                <ExternalLink className="w-4 h-4 mr-2" /> Open Repo
                                                            </a>
                                                        </Button>
                                                        {quest.forkUrl && (
                                                            <Button size="sm" variant="secondary" asChild className="flex-1 bg-secondary/80">
                                                                <a href={quest.forkUrl} target="_blank" rel="noreferrer">
                                                                    <GitFork className="w-4 h-4 mr-2" /> My Fork
                                                                </a>
                                                            </Button>
                                                        )}
                                                    </div>

                                                    <Button
                                                        size="sm"
                                                        variant="default"
                                                        onClick={() => handleCheckProgress(quest.id)}
                                                        disabled={checkingId === quest.id}
                                                    >
                                                        {checkingId === quest.id ? (
                                                            <>Checking <RefreshCw className="w-4 h-4 ml-2 animate-spin" /></>
                                                        ) : "Check Progress"}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </Section>

                        {/* How it Works */}
                        <Section title="How it Works" className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
                            <div className="p-5 rounded-2xl border border-border bg-card/50 backdrop-blur-sm space-y-4">
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0 font-bold">1</div>
                                    <p className="text-sm text-muted-foreground pt-1">Accept a quest from the available list.</p>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0 font-bold">2</div>
                                    <p className="text-sm text-muted-foreground pt-1">Fork the repository and implement the changes.</p>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0 font-bold">3</div>
                                    <p className="text-sm text-muted-foreground pt-1">Check progress. We'll verify your commits on the fork.</p>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0 font-bold">4</div>
                                    <p className="text-sm text-muted-foreground pt-1">Earn XP and keep your daily streak alive.</p>
                                </div>
                            </div>
                        </Section>
                    </div>
                </div>
            </main>
            <FloatingNav />
        </div>
    );
}
