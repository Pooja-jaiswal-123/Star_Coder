"use client";
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './_components/AppSidebar';
import DashboardProvider from './provider';

const DashboardLayout = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="flex w-full h-screen overflow-hidden">
        {/* SHARED SIDEBAR */}
        <AppSidebar />
        
        <div className="flex-1 overflow-y-auto">
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