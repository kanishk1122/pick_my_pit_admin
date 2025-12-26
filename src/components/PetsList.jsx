"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllPosts,
  banPost,
  fetchPostByIdForAdmin,
  clearSelectedPost,
} from "../redux/slices/postSlice";

// --- ICONS (Styled for Dashboard) ---
const EyeIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);
const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);
const FilterIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);
const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);
const WarningIcon = () => (
  <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

// --- HELPER: Status Badge ---
const StatusBadge = ({ status }) => {
  const styles = {
    active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    rejected: "bg-red-500/10 text-red-400 border-red-500/20",
    banned: "bg-rose-950 text-rose-500 border-rose-900",
    adopted: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    sold: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  };
  
  const defaultStyle = "bg-zinc-800 text-zinc-400 border-zinc-700";

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status?.toLowerCase()] || defaultStyle} capitalize flex items-center gap-1.5 w-fit`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'active' ? 'bg-emerald-400' : 'bg-current opacity-50'}`}></span>
      {status}
    </span>
  );
};

// --- CUSTOM MODAL 1: Ban Action ---
const BanModal = ({ isOpen, onClose, onConfirm }) => {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!reason.trim()) return alert("Please enter a reason");
    onConfirm(reason);
    setReason("");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md overflow-hidden shadow-2xl ring-1 ring-white/5">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-5">
            <div className="bg-red-500/10 p-3 rounded-full border border-red-500/20">
               <WarningIcon className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Ban Listing</h3>
              <p className="text-zinc-400 text-sm">This action cannot be undone easily.</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Reason for Ban
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Violation of Terms of Service..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white placeholder-zinc-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 min-h-[100px] resize-none text-sm transition-all"
            />
          </div>
        </div>

        <div className="bg-zinc-950 px-6 py-4 flex justify-end gap-3 border-t border-zinc-800">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg font-medium transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors text-sm shadow-lg shadow-red-900/20"
          >
            Confirm Ban
          </button>
        </div>
      </div>
    </div>
  );
};

// --- CUSTOM MODAL 2: Pet Details (Pro Style) ---
const PetDetailsModal = ({ postId, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { data: pet, loading, error } = useSelector((state) => state.posts.selectedPost) || {};

  useEffect(() => {
    if (isOpen && postId) {
      dispatch(fetchPostByIdForAdmin(postId));
    }
  }, [isOpen, postId, dispatch]);

  const handleClose = () => {
    dispatch(clearSelectedPost());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={handleClose}>
      <div 
        className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/50">
          <h2 className="text-lg font-semibold text-white">Listing Details</h2>
          <button onClick={handleClose} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center p-12">
             <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
           <div className="p-8 text-center text-red-400">Error: {error}</div>
        ) : pet ? (
          <div className="flex-1 overflow-y-auto">
            {/* Image Banner */}
            <div className="relative h-64 w-full bg-zinc-950">
              <img 
                src={pet.images?.[0] || "/placeholder.jpg"} 
                alt={pet.title} 
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-zinc-900 to-transparent h-32"></div>
              <div className="absolute bottom-4 left-6">
                <StatusBadge status={pet.status} />
                <h1 className="text-3xl font-bold text-white mt-2 shadow-sm">{pet.title}</h1>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="md:col-span-2 space-y-6">
                {pet.meta?.rejectmes && (
                  <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-xl">
                    <p className="text-red-400 text-sm font-medium">Rejection Reason:</p>
                    <p className="text-red-300/80 text-sm mt-1">{pet.meta.rejectmes}</p>
                  </div>
                )}
                
                <div>
                  <h4 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-2">Description</h4>
                  <p className="text-zinc-300 leading-relaxed text-sm whitespace-pre-wrap">{pet.discription || "No description provided."}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50">
                        <span className="text-xs text-zinc-500 block">Category</span>
                        <span className="text-zinc-200 font-medium">{pet.category}</span>
                    </div>
                    <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50">
                        <span className="text-xs text-zinc-500 block">Age</span>
                        <span className="text-zinc-200 font-medium">{pet.formattedAge}</span>
                    </div>
                    <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50">
                        <span className="text-xs text-zinc-500 block">Gender</span>
                        <span className="text-zinc-200 font-medium capitalize">{pet.gender || 'N/A'}</span>
                    </div>
                    <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50">
                        <span className="text-xs text-zinc-500 block">Price</span>
                        <span className="text-emerald-400 font-bold">{pet.amount > 0 ? `₹${pet.amount}` : "Free"}</span>
                    </div>
                </div>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-3">Owner Info</h4>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm overflow-hidden ring-2 ring-zinc-800">
                        {pet.owner?.userpic ? <img src={pet.owner.userpic} className="w-full h-full object-cover" /> : pet.owner?.firstname?.[0]}
                    </div>
                    <div>
                        <p className="text-white text-sm font-medium">{pet.owner?.firstname} {pet.owner?.lastname}</p>
                        <p className="text-zinc-500 text-xs">Joined: {pet.owner?.createdAt ? new Date(pet.owner.createdAt).getFullYear() : 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-zinc-800">
                   <h4 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-3">Location</h4>
                   <p className="text-zinc-300 text-sm flex items-start gap-2">
                     <svg className="w-4 h-4 text-zinc-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                     {pet.address?.city || "Unknown City"}, <br/> {pet.address?.state || "Unknown State"}
                   </p>
                </div>
                
                <div className="pt-6 border-t border-zinc-800">
                   <h4 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-3">Metadata</h4>
                   <p className="text-zinc-500 text-xs mb-1">Created: {new Date(pet.createdAt).toLocaleString()}</p>
                   <p className="text-zinc-500 text-xs">ID: {pet._id}</p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        
        <div className="p-4 border-t border-zinc-800 bg-zinc-900 flex justify-end">
            <button onClick={handleClose} className="px-5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium rounded-lg transition-colors">Close Details</button>
        </div>
      </div>
    </div>
  );
};

// --- DASHBOARD STAT CARD ---
const StatCard = ({ title, value, color }) => (
    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex flex-col justify-between h-24">
        <h3 className="text-zinc-500 text-xs font-medium uppercase tracking-wider">{title}</h3>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
);

// --- MAIN COMPONENT ---
export default function PetsList() {
  const dispatch = useDispatch();
  const { data: posts, pagination } = useSelector((state) => state.posts.allPosts);
  const { loading, error } = useSelector((state) => state.posts);

  const [isBanModalOpen, setBanModalOpen] = useState(false);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  // Filters state
  const [filters, setFilters] = useState({ status: "all" });
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  useEffect(() => {
    dispatch(fetchAllPosts({ page: currentPage, limit: postsPerPage, status: filters.status }));
  }, [dispatch, currentPage, filters]);

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setCurrentPage(1);
  };

  const handleBanClick = (e, postId) => {
    e.stopPropagation(); // Prevent row click
    setSelectedPostId(postId);
    setBanModalOpen(true);
  };

  const handleViewDetails = (postId) => {
    setSelectedPostId(postId);
    setDetailsModalOpen(true);
  };

  const handleConfirmBan = (reason) => {
    if (selectedPostId) {
      dispatch(banPost({ postId: selectedPostId, reason }));
    }
    setBanModalOpen(false);
    setSelectedPostId(null);
  };

  // Mock stats - you would typically get these from the backend
  const activeCount = posts?.filter(p => p.status === 'active').length || 0;
  const pendingCount = posts?.filter(p => p.status === 'pending').length || 0;

  return (
    <div className="bg-black min-h-screen text-zinc-100 font-sans selection:bg-indigo-500/30">
      <div className="max-w-[1600px] mx-auto p-6 md:p-8">
        
        {/* --- Header Section --- */}
        <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Pet Listings Management</h1>
            <p className="text-zinc-400">Monitor, approve, and manage all pet listings on the platform.</p>
        </div>

        {/* --- Stats Row (Optional Visual Upgrade) --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard title="Total Posts" value={pagination?.total || 0} color="text-white" />
            <StatCard title="Active Listings" value={activeCount} color="text-emerald-400" />
            <StatCard title="Pending Review" value={pendingCount} color="text-amber-400" />
            <StatCard title="Current Page" value={pagination?.currentPage || 1} color="text-indigo-400" />
        </div>

        {/* --- Controls Bar --- */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
          <div className="flex items-center gap-2 relative group w-full sm:w-64">
             <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                <SearchIcon />
             </div>
             <input 
                type="text" 
                placeholder="Search by title or owner..." 
                className="w-full bg-zinc-950 border border-zinc-700 text-sm text-white rounded-lg pl-10 pr-3 py-2.5 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
             />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
             <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
                    <FilterIcon />
                </div>
                <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="appearance-none bg-zinc-950 border border-zinc-700 text-white text-sm rounded-lg pl-10 pr-10 py-2.5 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none cursor-pointer transition-all hover:bg-zinc-900"
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                    <option value="banned">Banned</option>
                    <option value="sold">Sold</option>
                    <option value="adopted">Adopted</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
             </div>
          </div>
        </div>

        {/* --- Data Table --- */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
            {loading ? (
                <div className="h-64 flex flex-col items-center justify-center gap-3">
                     <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                     <p className="text-zinc-500 text-sm">Fetching data...</p>
                </div>
            ) : error ? (
                <div className="h-64 flex items-center justify-center text-red-400 gap-2">
                    <WarningIcon className="w-6 h-6" />
                    <p>{error}</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-zinc-800">
                    <thead className="bg-zinc-950/50">
                        <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Listing</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Owner</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Created</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-zinc-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800 bg-zinc-900">
                        {posts.map((post) => (
                        <tr 
                            key={post._id} 
                            onClick={() => handleViewDetails(post._id)}
                            className="group hover:bg-zinc-800/50 transition-colors cursor-pointer"
                        >
                            <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 h-12 w-12 rounded-lg overflow-hidden border border-zinc-700">
                                    <img className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300" src={post.images?.[0] || "/placeholder.jpg"} alt="" />
                                </div>
                                <div className="ml-4">
                                <div className="text-sm font-medium text-white group-hover:text-indigo-400 transition-colors">{post.title}</div>
                                <div className="text-xs text-zinc-500">{post.category} • {post.species}</div>
                                </div>
                            </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <StatusBadge status={post.status} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-zinc-400 overflow-hidden">
                                        {post.owner?.userpic ? <img src={post.owner.userpic} className="w-full h-full object-cover"/> : post.owner?.firstname?.[0]}
                                    </div>
                                    <span className="text-sm text-zinc-300">{post.owner?.firstname || "Unknown"}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 font-mono">
                                {new Date(post.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex items-center justify-end gap-2">
                                    <button
                                    onClick={(e) => { e.stopPropagation(); handleViewDetails(post._id); }}
                                    className="p-2 text-zinc-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all"
                                    title="View Details"
                                    >
                                    <EyeIcon />
                                    </button>
                                    <button
                                    onClick={(e) => handleBanClick(e, post._id)}
                                    className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                    title="Ban Post"
                                    >
                                    <TrashIcon />
                                    </button>
                                </div>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            )}
            
            {/* --- Pagination --- */}
            {pagination && pagination.totalPages > 1 && (
            <div className="bg-zinc-950/30 px-6 py-4 border-t border-zinc-800 flex items-center justify-between">
                <span className="text-sm text-zinc-500">
                Page <span className="font-medium text-white">{pagination.currentPage}</span> of {pagination.totalPages}
                </span>
                <div className="flex gap-2">
                <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Previous
                </button>
                <button
                    onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                    disabled={currentPage === pagination.totalPages}
                    className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Next
                </button>
                </div>
            </div>
            )}
        </div>

        {/* --- Modals --- */}
        <BanModal isOpen={isBanModalOpen} onClose={() => setBanModalOpen(false)} onConfirm={handleConfirmBan} />
        <PetDetailsModal postId={selectedPostId} isOpen={isDetailsModalOpen} onClose={() => setDetailsModalOpen(false)} />
      </div>
    </div>
  );
}