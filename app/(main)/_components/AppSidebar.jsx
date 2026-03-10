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
import { SideBarOption } from "@/lib/services/Constants";
import Link from "next/link";
import { Plus } from "lucide-react"; // <-- Yahan se LayoutTextQuote hata diya hai
import { usePathname } from "next/navigation";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="flex flex-col bg-red-400 items-center mt-5">
        <img
          src={"/logo.png"}
          alt="logo"
          width={200}
          height={100}
          className="w-[150px]"
        />

        <button
          className="w-full mt-5 flex items-center justify-center gap-2 
                      bg-primary text-primary-foreground 
                      py-2 px-3 rounded-md 
                      hover:bg-primary/90 transition"
        >
          <Plus size={18} />
          Create New Interview
        </button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {/* Pehle loop wale items */}
            {SideBarOption.map((Option, index) => (
              <SidebarMenuItem key={index} className="p-1">
                <SidebarMenuButton
                  asChild
                  className={`p-5 ${
                    pathname === Option.path ? "bg-blue-50" : ""
                  }`}
                >
                  <Link href={Option.path} className="flex items-center gap-2">
                    <Option.icon
                      size={18}
                      className={
                        pathname === Option.path
                          ? "text-primary"
                          : "text-gray-600"
                      }
                    />
                    <span
                      className={`text-[16px] ${
                        pathname === Option.path
                          ? "text-primary font-semibold"
                          : "text-gray-700"
                      }`}
                    >
                      {Option.name}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
}
