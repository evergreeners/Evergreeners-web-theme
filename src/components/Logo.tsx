import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn("w-6 h-6 transition-all", className)}
        >
            <rect x="2" y="2" width="2.5" height="2.5" rx="0.5" fill="#14532d" className="group-hover:fill-[#14532d] transition-colors duration-700" />
            <rect x="5.5" y="2" width="2.5" height="2.5" rx="0.5" fill="#166534" className="group-hover:fill-[#166534] transition-colors duration-700 delay-75" />
            <rect x="9" y="2" width="2.5" height="2.5" rx="0.5" fill="#22c55e" className="group-hover:fill-[#22c55e] transition-colors duration-700 delay-100" />
            <rect x="12.5" y="2" width="2.5" height="2.5" rx="0.5" fill="#4ade80" className="group-hover:fill-[#4ade80] transition-colors duration-700 delay-150" />
            <rect x="16" y="2" width="2.5" height="2.5" rx="0.5" fill="#22c55e" className="group-hover:fill-[#22c55e] transition-colors duration-700" />
            <rect x="19.5" y="2" width="2.5" height="2.5" rx="0.5" fill="#14532d" className="group-hover:fill-[#14532d] transition-colors duration-700" />

            <rect x="2" y="5.5" width="2.5" height="2.5" rx="0.5" fill="#166534" />
            <rect x="5.5" y="5.5" width="2.5" height="2.5" rx="0.5" fill="#4ade80" />
            <rect x="9" y="5.5" width="2.5" height="2.5" rx="0.5" fill="#86efac" />
            <rect x="12.5" y="5.5" width="2.5" height="2.5" rx="0.5" fill="#22c55e" />
            <rect x="16" y="5.5" width="2.5" height="2.5" rx="0.5" fill="#15803d" />
            <rect x="19.5" y="5.5" width="2.5" height="2.5" rx="0.5" fill="#166534" />

            <rect x="2" y="9" width="2.5" height="2.5" rx="0.5" fill="#22c55e" />
            <rect x="5.5" y="9" width="2.5" height="2.5" rx="0.5" fill="#86efac" />
            <rect x="9" y="9" width="2.5" height="2.5" rx="0.5" fill="#bbf7d0" />
            <rect x="12.5" y="9" width="2.5" height="2.5" rx="0.5" fill="#4ade80" />
            <rect x="16" y="9" width="2.5" height="2.5" rx="0.5" fill="#22c55e" />
            <rect x="19.5" y="9" width="2.5" height="2.5" rx="0.5" fill="#15803d" />

            <rect x="2" y="12.5" width="2.5" height="2.5" rx="0.5" fill="#4ade80" />
            <rect x="5.5" y="12.5" width="2.5" height="2.5" rx="0.5" fill="#22c55e" />
            <rect x="9" y="12.5" width="2.5" height="2.5" rx="0.5" fill="#4ade80" />
            <rect x="12.5" y="12.5" width="2.5" height="2.5" rx="0.5" fill="#22c55e" />
            <rect x="16" y="12.5" width="2.5" height="2.5" rx="0.5" fill="#4ade80" />
            <rect x="19.5" y="12.5" width="2.5" height="2.5" rx="0.5" fill="#22c55e" />

            <rect x="2" y="16" width="2.5" height="2.5" rx="0.5" fill="#22c55e" />
            <rect x="5.5" y="16" width="2.5" height="2.5" rx="0.5" fill="#15803d" />
            <rect x="9" y="16" width="2.5" height="2.5" rx="0.5" fill="#22c55e" />
            <rect x="12.5" y="16" width="2.5" height="2.5" rx="0.5" fill="#166534" />
            <rect x="16" y="16" width="2.5" height="2.5" rx="0.5" fill="#22c55e" />
            <rect x="19.5" y="16" width="2.5" height="2.5" rx="0.5" fill="#15803d" />

            <rect x="2" y="19.5" width="2.5" height="2.5" rx="0.5" fill="#14532d" />
            <rect x="5.5" y="19.5" width="2.5" height="2.5" rx="0.5" fill="#166534" />
            <rect x="9" y="19.5" width="2.5" height="2.5" rx="0.5" fill="#15803d" />
            <rect x="12.5" y="19.5" width="2.5" height="2.5" rx="0.5" fill="#14532d" />
            <rect x="16" y="19.5" width="2.5" height="2.5" rx="0.5" fill="#166534" />
            <rect x="19.5" y="19.5" width="2.5" height="2.5" rx="0.5" fill="#14532d" />
        </svg>
    );
}
