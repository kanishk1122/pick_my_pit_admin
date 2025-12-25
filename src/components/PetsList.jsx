"use client";

import { useState } from "react";
import AddPetModal from "./AddPetModal";
import { useSwal } from "@/context/SwalContext"; // Import useSwal

// --- Mock Data ---
const initialPets = [
  {
    id: 1,
    name: "Max",
    species: "Dog",
    breed: "Golden Retriever",
    age: 3,
    gender: "Male",
    status: "available",
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?w=500",
    description:
      "Max is a friendly and energetic Golden Retriever who loves to play fetch. He is great with kids and other dogs.",
    medicalHistory: "Vaccinated, Neutered",
    owner: null,
  },
  {
    id: 2,
    name: "Luna",
    species: "Cat",
    breed: "Persian",
    age: 2,
    gender: "Female",
    status: "adopted",
    image:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500",
    description:
      "Luna is a calm and affectionate Persian cat. She enjoys lounging in sunny spots and being brushed.",
    medicalHistory: "Vaccinated, Spayed",
    owner: "Sarah Miller",
  },
  {
    id: 3,
    name: "Rocky",
    species: "Dog",
    breed: "German Shepherd",
    age: 4,
    gender: "Male",
    status: "available",
    image:
      "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=500",
    description:
      "Rocky is a loyal and protective companion. He is well-trained and loves outdoor activities.",
    medicalHistory: "Vaccinated, Neutered",
    owner: null,
  },
];

// --- Sub-components for Icons ---

const GridIcon = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
    />
  </svg>
);

const ListIcon = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

const EyeIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const TrashIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const EditIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

// --- Details Modal Component ---

const PetDetailsModal = ({ pet, isOpen, onClose }) => {
  if (!isOpen || !pet) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white transition-colors z-10"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="flex flex-col md:flex-row h-full">
          <div className="w-full md:w-1/2 h-64 md:h-auto relative">
            <img
              src={pet.image}
              alt={pet.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="w-full md:w-1/2 p-6 md:p-8 space-y-6 overflow-y-auto max-h-[60vh] md:max-h-[80vh]">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold text-white">{pet.name}</h2>
                <span
                  className={`px-2 py-1 text-xs rounded-full font-medium border ${
                    pet.status === "available"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : pet.status === "adopted"
                      ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                  }`}
                >
                  {pet.status.charAt(0).toUpperCase() + pet.status.slice(1)}
                </span>
              </div>
              <p className="text-zinc-400 text-lg">
                {pet.breed} • {pet.age} years old
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-1">
                  Description
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  {pet.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-1">
                    Gender
                  </h3>
                  <p className="text-zinc-300">{pet.gender}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-1">
                    Species
                  </h3>
                  <p className="text-zinc-300">{pet.species}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-1">
                  Medical History
                </h3>
                <p className="text-zinc-300">{pet.medicalHistory}</p>
              </div>

              {pet.owner && (
                <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                  <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-1">
                    Current Owner
                  </h3>
                  <p className="text-white font-medium">{pet.owner}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function PetsList() {
  const [pets, setPets] = useState(initialPets);
  const [view, setView] = useState("grid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const Swal = useSwal(); // Initialize Swal Hook

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "adopted":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default:
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setPets((prev) => prev.filter((pet) => pet.id !== id));
        Swal.fire("Deleted!", "The pet listing has been removed.", "success");
      }
    });
  };

  const handleViewDetails = (pet) => {
    setSelectedPet(pet);
  };

  const handleEdit = (pet) => {
    Swal.fire({
      title: "Coming Soon",
      text: `Edit functionality for ${pet.name} is under development!`,
      icon: "info",
      confirmButtonColor: "#3085d6",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2 bg-zinc-900/50 p-1 rounded-lg border border-zinc-800">
          <button
            onClick={() => setView("grid")}
            className={`p-2 rounded-md transition-all duration-200 flex items-center gap-2 ${
              view === "grid"
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
            }`}
            title="Grid View"
          >
            <GridIcon />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-2 rounded-md transition-all duration-200 flex items-center gap-2 ${
              view === "list"
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
            }`}
            title="List View"
          >
            <ListIcon />
          </button>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v12m6-6H6"
            />
          </svg>
          Add New Pet
        </button>
      </div>

      {/* Grid View */}
      {view === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <div
              key={pet.id}
              className="group bg-zinc-900/40 border border-zinc-800/50 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all duration-300 flex flex-col"
            >
              {/* Image Area */}
              <div className="aspect-[4/3] w-full relative overflow-hidden bg-zinc-950">
                <img
                  src={pet.image}
                  alt={pet.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium border shadow-sm backdrop-blur-sm ${getStatusColor(
                      pet.status
                    )}`}
                  >
                    {pet.status.charAt(0).toUpperCase() + pet.status.slice(1)}
                  </span>
                </div>
                {/* Hover Overlay with Quick Action */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button
                    onClick={() => handleViewDetails(pet)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white font-medium transition-all transform translate-y-4 group-hover:translate-y-0"
                  >
                    View Full Profile
                  </button>
                </div>
              </div>

              {/* Content Area */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-1 mb-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-xl text-zinc-100">
                      {pet.name}
                    </h3>
                    <span className="text-zinc-500 text-xs font-mono bg-zinc-800/50 px-2 py-1 rounded">
                      ID: {pet.id}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-400">
                    {pet.breed} • {pet.age} yrs • {pet.gender}
                  </p>
                  {pet.owner && (
                    <p className="text-xs text-zinc-500 mt-2 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      Owner: {pet.owner}
                    </p>
                  )}
                </div>

                {/* Actions Footer */}
                <div className="pt-4 border-t border-zinc-800/50 flex gap-2">
                  <button
                    onClick={() => handleViewDetails(pet)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm transition-colors"
                  >
                    <EyeIcon /> Details
                  </button>
                  <button
                    onClick={() => handleEdit(pet)}
                    className="p-2 bg-zinc-800 hover:bg-zinc-700 text-blue-400 rounded-lg transition-colors"
                    title="Edit Pet"
                  >
                    <EditIcon />
                  </button>
                  <button
                    onClick={() => handleDelete(pet.id)}
                    className="p-2 bg-zinc-800 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-colors"
                    title="Take Down Listing"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {view === "list" && (
        <div className="space-y-3">
          {pets.map((pet) => (
            <div
              key={pet.id}
              className="group bg-zinc-900/40 border border-zinc-800/50 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center hover:bg-zinc-900/60 transition-colors"
            >
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-800">
                <img
                  src={pet.image}
                  alt={pet.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-lg text-zinc-100">
                    {pet.name}
                  </h3>
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full border ${getStatusColor(
                      pet.status
                    )}`}
                  >
                    {pet.status}
                  </span>
                </div>
                <p className="text-sm text-zinc-400 truncate">
                  {pet.breed} • {pet.age} years old • {pet.gender}
                </p>
                {pet.owner && (
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Owner: {pet.owner}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-800/50">
                <button
                  onClick={() => handleViewDetails(pet)}
                  className="flex-1 sm:flex-none px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium rounded-lg transition-colors"
                >
                  View
                </button>
                <button
                  onClick={() => handleEdit(pet)}
                  className="p-2 text-zinc-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                  title="Edit"
                >
                  <EditIcon />
                </button>
                <button
                  onClick={() => handleDelete(pet.id)}
                  className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Delete"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <AddPetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <PetDetailsModal
        pet={selectedPet}
        isOpen={!!selectedPet}
        onClose={() => setSelectedPet(null)}
      />
    </div>
  );
}