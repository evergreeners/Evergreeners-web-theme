import { useSession } from "@/lib/auth-client";
import { Loader } from "@/components/ui/loader";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
    const { data: session, isPending, error } = useSession();

    if (isPending) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
                <Loader />
            </div>
        );
    }

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
