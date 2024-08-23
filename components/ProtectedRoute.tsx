"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoadingData from "./LoadingData";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      setRedirecting(true);
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || redirecting) {
    return <LoadingData />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
