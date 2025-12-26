"use client";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import PetsList from "@/components/PetsList";

export default function PetsPage() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <PetsList />;
}
