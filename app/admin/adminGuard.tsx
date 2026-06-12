"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminAuth } from "./adminAuth";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    if (!adminAuth.isLoggedIn()) {
      router.push("/admin/login");
    }
  }, []);

  return <>{children}</>;
}