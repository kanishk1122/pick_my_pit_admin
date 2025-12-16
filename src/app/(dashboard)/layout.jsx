"use client";
import { useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { LoadingScreen } from "@/components/LoadingScreen";

export default function DashboardLayout({ children }) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  if (loading || !isAuthenticated) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <Sidebar />
      <div className="ml-[20vw] ">
        {/* Top header */}
        <header className="bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-800 h-16 fixed top-0 right-0 left-64 z-10 flex items-center px-6">
          <div className="flex-1">
            <h2 className="text-lg font-medium text-white">
              Pet Admin Dashboard
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-zinc-400">
              Logged in as: <span className="text-zinc-200">{user?.email}</span>
            </div>
            <button className="p-2 rounded-full bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white">
              <i className="pi pi-bell text-xl"></i>
            </button>
          </div>
        </header>

        {/* Main content area */}
        <main className="pt-16 p-6">{children}</main>
      </div>
    </div>
  );
}
