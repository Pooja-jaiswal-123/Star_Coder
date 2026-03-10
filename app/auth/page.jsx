"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Chrome, Loader2 } from "lucide-react";

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        router.replace("/dashboard/analytics");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (err) {
      console.error("Login Error:", err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-lg border border-gray-100 rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8 pb-0 flex flex-col items-center">
            <div className="bg-blue-600 p-3 rounded-2xl mb-6 shadow-lg shadow-blue-200">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-8 w-auto brightness-0 invert"
              />
            </div>

            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-inner bg-gray-100 mb-8">
              <img
                src="/login.png"
                alt="Login Illustration"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="px-8 pb-10 text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Welcome to <span className="text-blue-600">AI Coach</span>
            </h1>

            <p className="text-gray-500 mt-3 text-sm leading-relaxed">
              Sign in to supercharge your job search and interview prep.
            </p>

            <Button
              onClick={signInWithGoogle}
              disabled={loading}
              className="mt-8 w-full h-12 text-md font-semibold bg-gray-900 hover:bg-black text-white flex gap-3"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Chrome className="w-5 h-5" />
              )}

              {loading ? "Authenticating..." : "Continue with Google"}
            </Button>

            <p className="mt-6 text-xs text-gray-400 text-center">
              By signing in, you agree to our{" "}
              <span className="underline cursor-pointer">Terms</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
