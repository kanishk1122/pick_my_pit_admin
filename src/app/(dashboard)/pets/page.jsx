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

  return (
    <div className=" flex-1">
      <div className="mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
          Pets Management
        </h1>
        <p className="text-zinc-400 mt-2">
          Manage and track all pets in the system
        </p>
      </div>
      <PetsList />
    </div>
  );
}
