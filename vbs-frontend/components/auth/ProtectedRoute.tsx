"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoadingState from "@/components/shared/LoadingState";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !isLoggedIn && pathname !== "/login") {
      router.push("/login");
    }
  }, [loading, isLoggedIn, pathname, router]);

  if (loading) return <LoadingState />;
  if (!isLoggedIn && pathname !== "/login") return <LoadingState />;

  return <>{children}</>;
}
