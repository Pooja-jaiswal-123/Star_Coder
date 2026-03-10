"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import {
  Plus,
  LayoutDashboard,
  CalendarCheck,
  History,
  Settings,
  CreditCard,
} from "lucide-react";
import { usePathname } from "next/navigation";

export function InterviewSidebar() {
  const pathname = usePathname();

  const interviewOptions = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/interview/dashboard" },
    { name: "Scheduled Interview", icon: CalendarCheck, path: "/interview/scheduled" },
    { name: "All Interviews", icon: History, path: "/interview/all" },
    { name: "Billing", icon: CreditCard, path: "/interview/billing" },
    { name: "Settings", icon: Settings, path: "/interview/settings" },
  ];

  return (
    <Sidebar className="border-r border-gray-200 bg-white">
      {/* HEADER */}
      <SidebarHeader className="flex flex-col items-center mt-6 px-4">
        <Link href="/dashboard" className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold">
            AI
          </div>
          <span className="text-xl font-bold text-gray-800">
            AI Interview
          </span>
        </Link>

        <Link href="/interview/create-interview" className="w-full">
          <button className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-2.5 px-4 rounded-xl shadow-md hover:bg-indigo-700 transition-all">
            <Plus size={20} />
            New Interview
          </button>
        </Link>
      </SidebarHeader>

      {/* MENU */}
      <SidebarContent className="mt-4">
        <SidebarGroup>
          <SidebarMenu className="gap-1 px-2">
            {interviewOptions.map((option, index) => {
              const isActive = pathname === option.path;

              return (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton
                    asChild
                    className={`p-6 rounded-xl ${
                      isActive
                        ? "bg-indigo-50 text-indigo-600 font-bold"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Link href={option.path} className="flex items-center gap-3 w-full">
                      <option.icon size={22} />
                      <span>{option.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter className="p-4 border-t">
        <Link href="/dashboard" className="text-sm text-gray-500 hover:text-indigo-600">
          ← Back to Main Dashboard
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}