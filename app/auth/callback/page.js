"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const setSessionFromHash = async () => {
      const hash = window.location.hash;
      
      if (!hash) {
        router.replace("/auth");
        return;
      }

      // Hash se params extract karo
      const params = new URLSearchParams(hash.substring(1));
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (!access_token || !refresh_token) {
        router.replace("/auth");
        return;
      }

      // Manually session set karo
      const { data, error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });

      if (error) {
        console.error("Session error:", error.message);
        router.replace("/auth");
        return;
      }

      if (data?.session) {
        router.replace("/dashboard/analytics");
      }
    };

    setSessionFromHash();
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Authenticating...</p>
      </div>
    </div>
  );
}