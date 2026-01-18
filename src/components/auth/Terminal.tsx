import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface Step {
    cmd: string;
    output?: React.ReactNode;
    path?: string;
}

const steps: Step[] = [
    {
        cmd: "git init",
        output: "Initialized empty Git repository in /home/user/legacy/.git/"
    },
    {
        cmd: "git add .",
        path: "~/legacy"
    },
    {
        cmd: "git commit -m \"Building my legacy\"",
        path: "~/legacy",
        output: (
            <div className="text-zinc-500">
                [main (root-commit) 4a0b3c2] Building my legacy<br />
                &nbsp;7 files changed, 258 insertions(+)<br />
                &nbsp;create mode 100644 day-one.tsx
            </div>
        )
    },
    {
        cmd: "git push origin main",
        path: "~/legacy",
        output: (
            <div className="text-zinc-500">
                <div>Enumerating objects: 9, done.</div>
                <div>Counting objects: 100% (9/9), done.</div>
                <div>Writing objects: 100% (9/9), 4.20 KiB | 4.20 MiB/s, done.</div>
                <div>Total 9 (delta 0), reused 0 (delta 0)</div>
                <div>To github.com:ibrahimisa/legacy.git</div>
                <div>
                    <span className="text-green-500">* [new branch]</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;main -&gt; main
                </div>
            </div>
        )
    },
    {
        cmd: "clear",
        path: "~/legacy"
    }
];

export function Terminal() {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [currentText, setCurrentText] = useState("");
    const [history, setHistory] = useState<Step[]>([]);
    const [isTyping, setIsTyping] = useState(true);
    const [showCursor, setShowCursor] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Initial delay before starting
    const [hasStarted, setHasStarted] = useState(false);

    const [isWaiting, setIsWaiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setHasStarted(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    // Cursor blinking effect
    useEffect(() => {
        const timer = setInterval(() => {
            setShowCursor((prev) => !prev);
        }, 500);
        return () => clearInterval(timer);
    }, []);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history, currentText, currentStepIndex]);

    // Typing logic
    useEffect(() => {
        if (!hasStarted) return;
        if (currentStepIndex >= steps.length) return;
        if (!isTyping || isWaiting) return;

        const currentStep = steps[currentStepIndex];

        if (currentText.length < currentStep.cmd.length) {
            const timeout = setTimeout(() => {
                setCurrentText(currentStep.cmd.slice(0, currentText.length + 1));
            }, Math.random() * 50 + 100); // Slower typing speed
            return () => clearTimeout(timeout);
        } else {
            setIsTyping(false);
        }
    }, [currentText, isTyping, currentStepIndex, hasStarted, isWaiting]);

    // Step transition logic
    useEffect(() => {
        if (!hasStarted) return;
        if (currentStepIndex >= steps.length) return;
        if (isWaiting) return;

        if (!isTyping) {
            const timeout = setTimeout(() => {
                const step = steps[currentStepIndex];
                if (step.cmd === "clear") {
                    setHistory([]);
                    setCurrentStepIndex(0);
                    setCurrentText("");
                    setIsTyping(true);
                } else {
                    setHistory((prev) => [...prev, step]);
                    setCurrentStepIndex((prev) => prev + 1);
                    setCurrentText("");

                    if (step.cmd.startsWith("git push")) {
                        setIsWaiting(true);
                        setTimeout(() => {
                            setIsWaiting(false);
                            setIsTyping(true);
                        }, 2000);
                    } else {
                        setIsTyping(true);
                    }
                }
            }, 800);
            return () => clearTimeout(timeout);
        }
    }, [isTyping, currentStepIndex, hasStarted, isWaiting]);

    return (
        <div className="w-full max-w-lg shadow-2xl overflow-hidden rounded-xl bg-[#0f0f11] ring-1 ring-white/10">
            <div className="w-full flex flex-col h-[400px]">
                {/* Header */}
                <div className="bg-[#1a1b1e]/90 backdrop-blur-md h-9 px-3 flex items-center border-b border-white/5 relative shrink-0">
                    <div className="flex gap-1.5 text-[#71717a] absolute left-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                    </div>
                    <div className="mx-auto flex items-center gap-2 text-zinc-400 text-[11px] font-medium font-mono uppercase tracking-wider opacity-70">
                        <div className="text-zinc-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="3" x2="6" y2="15" /><circle cx="18" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M18 9a9 9 0 0 1-9 9" /></svg>
                        </div>
                        Terminal
                    </div>
                </div>

                {/* Body */}
                <div
                    ref={scrollRef}
                    className="p-4 font-mono text-[13px] leading-5 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] text-left flex-1 bg-black"
                >
                    {/* History */}
                    {history.map((step, index) => (
                        <div key={index} className="mb-2">
                            <div className="flex flex-wrap items-center gap-x-2">
                                <span className="text-blue-500 font-bold">➜</span>
                                <span className="text-cyan-400/90 font-medium">{step.path || "~"}</span>
                                <span className={cn("text-zinc-100", index === 0 ? "ml-2" : "ml-2")}>{step.cmd}</span>
                            </div>
                            {step.output && (
                                <div className="text-zinc-400 break-words whitespace-pre-wrap leading-tight mt-0.5">
                                    {step.output}
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Current Typing Line */}
                    {currentStepIndex < steps.length && (
                        <div className="flex flex-wrap items-center gap-x-2">
                            <span className="text-blue-500 font-bold">➜</span>
                            <span className="text-cyan-400/90 font-medium">{steps[currentStepIndex].path || "~"}</span>
                            <span className="text-zinc-100 ml-2">
                                {currentText}
                                {showCursor && <span className="inline-block w-2 h-4 bg-zinc-400 align-text-bottom ml-0.5" />}
                            </span>
                        </div>
                    )}

                    {/* Final Cursor State */}
                    {currentStepIndex >= steps.length && (
                        <div className="flex flex-wrap items-center gap-x-2">
                            <span className="text-blue-500 font-bold">➜</span>
                            <span className="text-cyan-400/90 font-medium">~/legacy</span>
                            <span className="text-zinc-100 ml-2">
                                {showCursor && <span className="inline-block w-2 h-4 bg-zinc-400 align-text-bottom ml-0.5" />}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
