"use client";
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './_components/AppSidebar';
import DashboardProvider from './provider';

const DashboardLayout = ({ children }) => {
  return (
    <SidebarProvider>
      {/* 📱 RESPONSIVE CHANGES: 
          1. h-screen ki jagah h-[100dvh] (Mobile browsers ke address bar cut issue fix karne ke liye)
          2. flex-col md:flex-row (Mobile pe upar-niche, badi screen pe side-by-side)
      */}
      <div className="flex flex-col md:flex-row w-full h-[100dvh] overflow-hidden">
        {/* SHARED SIDEBAR */}
        <AppSidebar />
        
        {/* w-full aur flex-1 ensure karega ki ye bachi hui puri jagah le */}
        <div className="flex-1 w-full overflow-y-auto">
          <DashboardProvider>
            {/* Ab sirf children render honge, Welcome box page.jsx mein jayega */}
            {children}
          </DashboardProvider>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;