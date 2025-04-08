// services/routeProtectionService.js
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loader from "@/components/Loader";

export function useRouteProtection() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  return {
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
  };
}

export function ProtectedRoute({ children }) {
  const { isLoading, isAuthenticated } = useRouteProtection();

  if (isLoading) {
    return <Loader message="Preparing your experience" />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
}