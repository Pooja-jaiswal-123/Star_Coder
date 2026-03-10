'use client' // 👈 URL check karne ke liye ye zaroori hai

import { usePathname } from "next/navigation"; // 👈 Hook import karein
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Provider from "./provider"; 
import { Toaster } from "@/components/ui/sonner";
import AppSidebar from "@/components-main/AppSidebar"; 

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

// Note: Metadata 'use client' ke saath direct layout mein kaam nahi karegi. 
// Agar metadata zaroori hai, toh ise ek separate file ya server component mein rakhte hain.
// Lekin abhi aapke sidebar logic ke liye main layout ko update kar raha hoon.

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // 👇 Yahan check kar rahe hain ki kya hum interview page par hain
  // Agar aapka route /dashboard/interview hai toh ye detect kar lega
  const isInterviewPage = pathname.includes("/interview");

  return (
    <html lang="en">
      <body className={`${inter.variable} ${robotoMono.variable} antialiased`}>
        <Provider>
          
          <div className="flex min-h-screen bg-[#FDFDFF]">
            
            {/* 👇 Agar interview page NAHI hai, tabhi sidebar dikhao */}
            {!isInterviewPage && <AppSidebar />}
            
            {/* 👇 Dynamic Margin: 
                Agar interview page hai toh margin 0, warna md:ml-72 */}
            <main className={`flex-1 min-h-screen transition-all ${!isInterviewPage ? "md:ml-72" : "ml-0"}`}>
              
              {/* Content Wrapper */}
              <div className={`w-full ${!isInterviewPage ? "px-6 py-8 md:px-10" : "p-0"}`}>
                {children}
              </div>
              
            </main>
          </div>
          
          <Toaster/>
        </Provider>
      </body>
    </html>
  );
}