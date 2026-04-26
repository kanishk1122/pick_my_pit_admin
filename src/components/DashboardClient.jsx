"use client";
import React, { useState, useEffect } from "react";
import { 
  Users, 
  Heart, 
  DollarSign, 
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  Filter,
  FileText,
  Check,
  X as XIcon,
  AlertCircle,
  PawPrint,
  ArrowRight
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Mock Data to replace Redux/Backend
const MOCK_DATA = {
  user: { firstname: "Admin", email: "admin@shelter.com" },
  stats: {
    totalPets: 142,
    availablePets: 89,
    totalUsers: 2150,
    pendingAdoptions: 12,
    totalSpecies: 8,
    activeSpecies: 5,
    totalDonations: 450,
    monthlyRevenue: 12500,
  },
  // UPDATED DATA: User-created pet listings
  pendingPetListings: [
    { 
      id: 101, 
      title: "Golden Retriever needs new home", 
      petName: "Bella", 
      breed: "Golden Retriever", 
      author: "Sarah Smith", 
      type: "Rehoming", 
      time: "2 hours ago" 
    },
    { 
      id: 102, 
      title: "Found 3 kittens near park", 
      petName: "Unknown", 
      breed: "Domestic Short Hair", 
      author: "Mike Ross", 
      type: "Rescue/Found", 
      time: "5 hours ago" 
    },
  ],
  activities: [
    { id: 1, description: "New adoption request for 'Luna'", timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), type: "adoption" },
    { id: 2, description: "Received $50 donation from John D.", timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), type: "donation" },
    { id: 3, description: "New user registered: Sarah Smith", timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(), type: "user" },
    { id: 4, description: "Updated medical record for 'Max'", timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(), type: "medical" },
    { id: 5, description: "Weekly system backup completed", timestamp: new Date(Date.now() - 1000 * 60 * 600).toISOString(), type: "system" },
  ],
  donations: [
    { id: 1, donor: "Alice Freeman", amount: 150, date: "Today, 10:23 AM", status: "Completed" },
    { id: 2, donor: "Bob Wilson", amount: 50, date: "Yesterday, 4:15 PM", status: "Completed" },
    { id: 3, donor: "Carol Danvers", amount: 500, date: "Oct 24, 2023", status: "Completed" },
    { id: 4, donor: "Dave Grohl", amount: 25, date: "Oct 23, 2023", status: "Pending" },
  ]
};

// Data for Recharts
const CHART_DATA = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
  { name: 'Jul', value: 3490 },
];

const PIE_DATA = [
  { name: 'Dogs', value: 45, color: '#6366f1' }, // Indigo
  { name: 'Cats', value: 30, color: '#10b981' }, // Emerald
  { name: 'Birds', value: 15, color: '#f59e0b' }, // Amber
  { name: 'Other', value: 10, color: '#52525b' }, // Zinc
];

export default function DashboardClient() {
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState("");
  
  // Simulate data fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      const date = new Date();
      setCurrentDate(date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }));
    }, 1000); 
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30 p-4 sm:p-6 lg:p-8">
      <div className=" mx-auto space-y-8">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800 pb-6">
          <div className="space-y-1">
            <p className="text-zinc-500 text-sm font-medium uppercase tracking-wider">{currentDate}</p>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="text-zinc-400">
              Welcome back, <span className="text-zinc-100 font-medium">Admin</span>.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-800 transition-colors text-sm font-medium flex items-center gap-2">
              <Filter size={16} /> Filter
            </button>
            
            {/* Go To Pending Requests Button */}
            <button className="px-4 py-2 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-lg hover:bg-amber-500/20 transition-all text-sm font-medium flex items-center gap-2 group">
              <span>Review Requests</span>
              <span className="bg-amber-500 text-zinc-950 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {MOCK_DATA.pendingPetListings.length}
              </span>
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-lg shadow-indigo-500/20 transition-all text-sm font-medium flex items-center gap-2">
              <ArrowDownRight size={16} /> Download Report
            </button>
          </div>
        </div>

        {/* Pending Pet Listings */}
        <div className="bg-gradient-to-r from-indigo-900/20 to-zinc-900/50 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 bg-indigo-500 h-full"></div>
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="text-indigo-400" size={20} />
            <h2 className="text-lg font-bold text-zinc-100">User Pet Listings Waiting for Approval</h2>
            <span className="bg-indigo-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {MOCK_DATA.pendingPetListings.length}
            </span>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            {MOCK_DATA.pendingPetListings.map((post) => (
              <div key={post.id} className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-zinc-800 rounded-lg shrink-0">
                    <PawPrint size={20} className="text-indigo-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-medium text-zinc-200 truncate">{post.title}</h3>
                    <p className="text-xs text-zinc-500 mt-1 truncate">
                      <span className="text-zinc-300 font-medium">{post.petName}</span> ({post.breed}) • Posted by {post.author}
                    </p>
                    <p className="text-[10px] text-zinc-600 mt-0.5">{post.time} • {post.type}</p>
                  </div>
                </div>
                <div className="flex gap-2 self-end sm:self-center shrink-0">
                  <button className="p-2 hover:bg-red-500/10 text-zinc-500 hover:text-red-400 rounded-lg transition-colors" title="Reject">
                    <XIcon size={18} />
                  </button>
                  <button className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors">
                    <Check size={16} /> Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Pets" 
            value={MOCK_DATA.stats.totalPets} 
            icon={Heart} 
            color="blue" 
            trend="+12%" 
          />
          <StatCard 
            title="Available" 
            value={MOCK_DATA.stats.availablePets} 
            icon={CheckCircle} 
            color="green" 
            trend="+5%" 
          />
          <StatCard 
            title="Total Users" 
            value={MOCK_DATA.stats.totalUsers} 
            icon={Users} 
            color="purple" 
            trend="+18%" 
          />
          <StatCard 
            title="Revenue" 
            value={`$${MOCK_DATA.stats.monthlyRevenue.toLocaleString()}`} 
            icon={DollarSign} 
            color="indigo" 
            trend="+8.2%" 
            isCurrency
          />
        </div>

        {/* Charts Section with Recharts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Line Chart */}
          <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl backdrop-blur-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-zinc-100">Revenue Analytics</h3>
                <p className="text-xs text-zinc-500">Income trends over the last 6 months</p>
              </div>
              <div className="flex gap-2">
                {['1M', '3M', '6M', '1Y'].map((period) => (
                  <button 
                    key={period}
                    className={`text-xs px-2 py-1 rounded ${period === '6M' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={CHART_DATA}
                  margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#71717a" 
                    tick={{fill: '#71717a', fontSize: 12}} 
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis 
                    stroke="#71717a" 
                    tick={{fill: '#71717a', fontSize: 12}} 
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#18181b', 
                      borderColor: '#27272a',
                      color: '#f4f4f5',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    itemStyle={{ color: '#818cf8' }}
                    labelStyle={{ color: '#a1a1aa', marginBottom: '0.25rem' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    dot={{ fill: '#18181b', stroke: '#6366f1', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#6366f1' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Donut Chart / Distribution */}
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl backdrop-blur-sm flex flex-col">
            <h3 className="text-lg font-semibold text-zinc-100 mb-1">Pet Distribution</h3>
            <p className="text-xs text-zinc-500 mb-6">By Species</p>
            
            <div className="flex-1 min-h-[200px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={PIE_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {PIE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#18181b', 
                      borderColor: '#27272a',
                      color: '#f4f4f5',
                      borderRadius: '8px'
                    }}
                    itemStyle={{ color: '#f4f4f5' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Text for Donut Chart */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-white">{MOCK_DATA.stats.availablePets}</span>
                <span className="text-xs text-zinc-500 font-medium uppercase tracking-wide">Available</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              {PIE_DATA.map((item, index) => (
                 <LegendItem key={index} color={item.color} label={item.name} value={`${item.value}%`} />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Recent Activity */}
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-zinc-100">Recent Activity</h3>
              <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors">View All</button>
            </div>
            <div className="space-y-4">
              {MOCK_DATA.activities.map((activity) => (
                <div key={activity.id} className="group flex gap-4 items-start">
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
                  <div className="flex-1 pb-4 border-b border-zinc-800/50 group-last:border-0">
                    <p className="text-sm text-zinc-300 font-medium group-hover:text-zinc-100 transition-colors">
                      {activity.description}
                    </p>
                    <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
                      <Clock size={10} />
                      {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Donations List */}
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-zinc-100">Latest Donations</h3>
              <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors">View All</button>
            </div>
            <div className="space-y-3">
              {MOCK_DATA.donations.map((donation) => (
                <div key={donation.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/30 hover:bg-zinc-800/50 border border-zinc-800/50 hover:border-zinc-700 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold text-sm border border-indigo-500/20">
                      {donation.donor.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-200">{donation.donor}</p>
                      <p className="text-xs text-zinc-500">{donation.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-400">+${donation.amount}</p>
                    <p className="text-[10px] uppercase tracking-wide text-zinc-500 font-medium">{donation.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// --- Sub Components ---

function StatCard({ title, value, icon: Icon, color, trend, isCurrency }) {
  const colorStyles = {
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20 shadow-blue-500/10",
    green: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/10",
    purple: "text-purple-400 bg-purple-500/10 border-purple-500/20 shadow-purple-500/10",
    indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20 shadow-indigo-500/10",
  };
  
  const activeStyle = colorStyles[color] || colorStyles.blue;
  const isPositive = trend.startsWith('+');

  return (
    <div className="bg-zinc-900/60 p-6 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-all duration-300 hover:shadow-lg hover:shadow-black/20 group relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-${color}-500/10 to-transparent rounded-bl-full -mr-10 -mt-10 transition-opacity opacity-50 group-hover:opacity-100`} />
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-inner ${activeStyle}`}>
          <Icon size={24} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
            {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {trend}
          </div>
        )}
      </div>
      
      <div className="relative z-10">
        <h3 className="text-zinc-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">{value}</p>
      </div>
    </div>
  );
}

function LegendItem({ color, label, value }) {
  // Check if color is a hex code or tailwind class
  const isHex = color.startsWith('#');
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div 
          className={`w-3 h-3 rounded-full ${!isHex ? color : ''}`}
          style={isHex ? { backgroundColor: color } : {}}
        ></div>
        <span className="text-sm text-zinc-300">{label}</span>
      </div>
      <span className="text-sm font-medium text-zinc-400">{value}</span>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-950 p-8 space-y-8 animate-pulse">
      <div className="h-20 w-full bg-zinc-900/50 rounded-xl border border-zinc-800"></div>
      <div className="h-40 w-full bg-zinc-900/50 rounded-xl border border-zinc-800"></div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => (
          <div key={i} className="h-32 bg-zinc-900/50 rounded-xl border border-zinc-800"></div>
        ))}
      </div>
    </div>
  );
}