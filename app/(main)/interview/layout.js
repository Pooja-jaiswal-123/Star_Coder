"use client";

import React from "react";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { InterviewSidebar } from "./_components/InterviewSidebar";
import DashboardProvider from "../provider";

export default function InterviewLayout({ children }) {
  return (
    <DashboardProvider>
      <SidebarProvider>
        <div className="flex h-screen w-full bg-[#F4F6FA]">

  {/* Sidebar */}
  <InterviewSidebar />

  {/* GLOBAL CONTENT WRAPPER */}
  <div className="flex-1 ml-[200px] flex flex-col">
    
    <main className="flex-1 overflow-h p-6 md:p-10">
      <div className="max-w-7xl mx-auto w-full">
        {children}
      </div>
    </main>

  </div>

</div>
      </SidebarProvider>
    </DashboardProvider>
  );
}