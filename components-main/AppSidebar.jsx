"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Home,
  MessageSquare,
  FileText,
  Search,
  Map,
  LogOut,
  Sparkles,
  Bot,
  UserCircle,
  Menu,
  X,
  TextQuote,
  LogIn,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/app/provider";

const AppSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user } = useUser();
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setAuthUser(session.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setAuthUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  const menuItems = [
    {
      label: "Dashboard",
      icon: <Home className="w-5 h-5" />,
      href: "/dashboard/analytics",
    },
    {
      label: "Interview Prep",
      icon: <MessageSquare className="w-5 h-5" />,
      href: "/interview/dashboard",
    },
    {
      label: "Resume Builder",
      icon: <FileText className="w-5 h-5" />,
      href: "/resume",
    },
    {
      label: "Resume Analyzer",
      icon: <Search className="w-5 h-5" />,
      href: "/resume/analyze",
    },
    {
      label: "Career Roadmap",
      icon: <Map className="w-5 h-5" />,
      href: "/roadmap",
    },
    {
      label: "Blog Generator",
      icon: <TextQuote className="w-5 h-5" />,
      href: "/blog",
    },
  ];

  const displayName =
    user?.name || authUser?.user_metadata?.full_name || "Guest";
  const displayPhoto =
    user?.picture || authUser?.user_metadata?.avatar_url || null;

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-40 flex items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 active:scale-95 transition-transform"
        >
          <Sparkles className="w-6 h-6 text-indigo-600 fill-indigo-100" />
          <span className="text-lg font-bold text-gray-800">AI Coach</span>
        </Link>

        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-screen w-72 bg-white border-r border-gray-200 z-50 flex flex-col
        transition-transform duration-300 ease-in-out
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* HEADER */}
        <div className="p-5 flex justify-between items-center shrink-0 border-b border-gray-50">
          <Link
            href="/"
            className="flex items-center gap-3 group cursor-pointer"
          >
            <Sparkles className="w-8 h-8 text-indigo-600 fill-indigo-100 group-hover:rotate-12 transition-transform" />
            <span className="text-xl font-black text-gray-800">AI Coach</span>
          </Link>

          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-1 text-gray-400 hover:text-red-500"
          >
            <X className="w-7 h-7" />
          </button>
        </div>

        {/* MENU */}
        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item, index) => {
            const isActive =
              pathname === item.href ||
              (pathname.startsWith(item.href) &&
                item.href !== "/dashboard" &&
                item.href !== "/resume");

            return (
              <Link
                key={index}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                }`}
              >
                {item.icon}
                <span className="font-semibold text-[15px]">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* FOOTER */}
        <div className="px-4 py-4 border-t border-gray-100 bg-white">
          {authUser ? (
            <div className="flex items-center gap-3 p-2 rounded-2xl hover:bg-gray-50">
              <div className="w-9 h-9 rounded-full overflow-hidden border">
                {displayPhoto ? (
                  <img
                    src={displayPhoto}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-indigo-100 flex items-center justify-center">
                    <UserCircle className="w-6 h-6 text-indigo-500" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800 truncate">
                  {displayName}
                </p>
                <p className="text-[10px] text-gray-500">Free Plan</p>
              </div>

              <button
                onClick={handleLogout}
                className="p-1.5 text-gray-400 hover:text-red-500"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link href="/auth">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100">
                <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center">
                  <LogIn className="w-5 h-5 text-indigo-600" />
                </div>

                <div>
                  <p className="text-sm font-bold text-indigo-700">Sign In</p>
                  <p className="text-[10px] text-indigo-400">
                    Login to your account
                  </p>
                </div>
              </div>
            </Link>
          )}
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;
