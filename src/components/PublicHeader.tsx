
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";

export function PublicHeader() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-0">
            <div className="glass-nav mt-4 rounded-2xl mx-auto max-w-5xl border border-primary/20 bg-primary/5">
                <div className="flex items-center justify-between py-3 px-6">
                    <Link to="/" className="flex items-center gap-2 group">
                        <img
                            src={logo}
                            alt="Evergreeners"
                            className="w-8 h-8 object-contain transition-transform group-hover:scale-110"
                        />
                        <span className="font-semibold text-foreground hidden sm:block tracking-tight">Forever Green</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <Link
                            to="/login"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/signup"
                            className={cn(
                                "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                                "bg-primary text-black hover:bg-primary/90 hover:scale-105 active:scale-95",
                                "shadow-[0_0_20px_-5px_hsl(var(--primary))]"
                            )}
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
