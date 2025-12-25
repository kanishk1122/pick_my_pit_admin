"use client";
import { useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { LoadingScreen } from "@/components/LoadingScreen";

export default function DashboardLayout({ children }) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  return (
    // Changed flex to block, assuming Sidebar is position: fixed
    <div className="min-h-screen bg-zinc-950">
      <Sidebar />


      <div className="ml-64 w-[calc(100%-16rem)] min-h-screen relative">
        {/* Top header */}
        {/* Header stays fixed, width is 100% minus the sidebar width */}
        <header className="fixed top-0 right-0 left-64 h-16 bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-800 z-20 flex items-center px-6">
          <div className="flex-1">
            <h2 className="text-lg font-medium text-white">
              Pet Admin Dashboard
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-zinc-400">
              Logged in as: <span className="text-zinc-200">{user?.email}</span>
            </div>
            <button className="p-2 rounded-full bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors">
              <i className="pi pi-bell text-xl"></i>
            </button>
          </div>
        </header>

        {/* Main content area */}
        {/* Added w-full here to ensure the children expand correctly */}
        <main className="pt-20 p-6 w-full h-full">
          {children}
        </main>
      </div>
    </div>
  );
}