import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="w-fit flex items-center gap-2 px-4 my-4">
          <SidebarTrigger className="-ml-1" />
        </div>
    <main className= "flex flex-1 flex-col gap-4 p-4 pt-0">
        {children}

    </main>
        </SidebarInset>
    </SidebarProvider>
  );
}
