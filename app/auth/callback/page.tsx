"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    async function verify() {
      const hash = window.location.hash;

      if (!hash) {
        router.push("/login");
        return;
      }

      const params = new URLSearchParams(
        hash.replace("#", "")
      );

      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (access_token && refresh_token) {
        await supabase.auth.setSession({
          access_token,
          refresh_token,
        });

        router.push("/");
      } else {
        router.push("/login");
      }
    }

    verify();
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <h1 className="text-2xl font-bold">
        Verifying your account...
      </h1>
    </main>
  );
}