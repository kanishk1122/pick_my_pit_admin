"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { LineChart, DoughnutChart } from "./Charts.jsx";
import StatsCard from "./StatsCard";
import BlogsList from "./BlogsList";
import DonationStats from "./DonationStats";
import Sidebar from "./Sidebar";
import { verifyLoginFromCookies } from "@/redux/slices/authSlice";
import {
  fetchDashboardStats,
  fetchRecentActivities,
} from "@/redux/slices/dashboardSlice";

export default function DashboardClient() {
  const dispatch = useDispatch();
  const {
    user,
    isAuthenticated,
    loading: authLoading,
  } = useSelector((state) => state.auth);
  const {
    stats,
    activities,
    loading: dashboardLoading,
    error,
  } = useSelector((state) => state.dashboard);

  useEffect(() => {
    // Verify authentication on component mount
    dispatch(verifyLoginFromCookies());
  }, [dispatch]);

  useEffect(() => {
    // Fetch real dashboard data when authenticated
    if (isAuthenticated && !authLoading) {
      dispatch(fetchDashboardStats());
      dispatch(fetchRecentActivities());
    }
  }, [isAuthenticated, authLoading, dispatch]);

  if (authLoading || dashboardLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-white">Loading dashboard...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-zinc-950">

      <div className="flex-1">
      
        <main className="p-6">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                  Dashboard Overview
                </h1>
                <p className="text-zinc-400 mt-1">
                  Welcome back, {user?.firstname || user?.email || "Admin"}!
                  Here's your overview.
                </p>
              </div>
              <button className="px-4 py-2 bg-zinc-800/50 text-zinc-100 rounded-lg hover:bg-zinc-700/50 transition-all duration-200 border border-zinc-700/50 hover:border-zinc-600 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download Report
              </button>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <p className="text-red-400">
                  Error loading dashboard data: {error}
                </p>
              </div>
            )}

            {/* Stats Cards with Real Data */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-zinc-800/90 p-6 rounded-xl border border-zinc-700/50 backdrop-blur-sm hover:bg-zinc-800/70 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-zinc-400 mb-2">Total Pets</h3>
                    <p className="text-3xl font-bold text-white">
                      {stats.totalPets || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                    <i className="pi pi-heart text-blue-400 text-xl"></i>
                  </div>
                </div>
              </div>
              <div className="bg-zinc-800/90 p-6 rounded-xl border border-zinc-700/50 backdrop-blur-sm hover:bg-zinc-800/70 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-zinc-400 mb-2">Available Pets</h3>
                    <p className="text-3xl font-bold text-white">
                      {stats.availablePets || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center border border-green-500/20">
                    <i className="pi pi-check-circle text-green-400 text-xl"></i>
                  </div>
                </div>
              </div>
              <div className="bg-zinc-800/90 p-6 rounded-xl border border-zinc-700/50 backdrop-blur-sm hover:bg-zinc-800/70 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-zinc-400 mb-2">Total Users</h3>
                    <p className="text-3xl font-bold text-white">
                      {stats.totalUsers || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20">
                    <i className="pi pi-users text-purple-400 text-xl"></i>
                  </div>
                </div>
              </div>
              <div className="bg-zinc-800/90 p-6 rounded-xl border border-zinc-700/50 backdrop-blur-sm hover:bg-zinc-800/70 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-zinc-400 mb-2">Pending Adoptions</h3>
                    <p className="text-3xl font-bold text-white">
                      {stats.pendingAdoptions || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20">
                    <i className="pi pi-clock text-amber-400 text-xl"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-zinc-800/90 p-6 rounded-xl border border-zinc-700/50 backdrop-blur-sm hover:bg-zinc-800/70 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-zinc-400 mb-2">Total Species</h3>
                    <p className="text-3xl font-bold text-white">
                      {stats.totalSpecies || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
                    <i className="pi pi-list text-indigo-400 text-xl"></i>
                  </div>
                </div>
              </div>
              <div className="bg-zinc-800/90 p-6 rounded-xl border border-zinc-700/50 backdrop-blur-sm hover:bg-zinc-800/70 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-zinc-400 mb-2">Active Species</h3>
                    <p className="text-3xl font-bold text-white">
                      {stats.activeSpecies || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                    <i className="pi pi-check-circle text-emerald-400 text-xl"></i>
                  </div>
                </div>
              </div>
              <div className="bg-zinc-800/90 p-6 rounded-xl border border-zinc-700/50 backdrop-blur-sm hover:bg-zinc-800/70 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-zinc-400 mb-2">Total Donations</h3>
                    <p className="text-3xl font-bold text-white">
                      {stats.totalDonations || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/20">
                    <i className="pi pi-dollar text-red-400 text-xl"></i>
                  </div>
                </div>
              </div>
              <div className="bg-zinc-800/90 p-6 rounded-xl border border-zinc-700/50 backdrop-blur-sm hover:bg-zinc-800/70 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-zinc-400 mb-2">Monthly Revenue</h3>
                    <p className="text-3xl font-bold text-white">
                      ${stats.monthlyRevenue || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center border border-cyan-500/20">
                    <i className="pi pi-chart-line text-cyan-400 text-xl"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts and Other Components */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="col-span-1 md:col-span-3 bg-zinc-900/30 border border-zinc-800/50 p-6 rounded-xl backdrop-blur-sm hover:bg-zinc-800/30 transition-all duration-200">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-zinc-100">
                    Revenue Overview
                  </h2>
                  <select className="bg-zinc-800 border border-zinc-700 rounded-md p-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-600">
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                    <option>Quarterly</option>
                    <option>Yearly</option>
                  </select>
                </div>
                <LineChart />
              </div>

              <div className="bg-zinc-900/30 border border-zinc-800/50 p-6 rounded-xl backdrop-blur-sm hover:bg-zinc-800/30 transition-all duration-200">
                <h2 className="text-xl font-bold mb-4 text-zinc-100">
                  Donation Distribution
                </h2>
                <DoughnutChart />
              </div>
            </div>

            {/* Recent Activities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-zinc-900/30 border border-zinc-800/50 p-6 rounded-xl backdrop-blur-sm hover:bg-zinc-800/30 transition-all duration-200">
                <h2 className="text-xl font-bold mb-4 text-zinc-100">
                  Recent Activities
                </h2>
                <div className="space-y-3">
                  {activities && activities.length > 0 ? (
                    activities.slice(0, 5).map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg"
                      >
                        <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                          <i className="pi pi-info-circle text-blue-400 text-sm"></i>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-zinc-300">
                            {activity.description}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {new Date(activity.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-zinc-500 text-center py-4">
                      No recent activities
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-zinc-900/30 border border-zinc-800/50 p-6 rounded-xl backdrop-blur-sm hover:bg-zinc-800/30 transition-all duration-200">
                <h2 className="text-xl font-bold mb-4 text-zinc-100">
                  Latest Donations
                </h2>
                <DonationStats />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
