import { useEffect, useState, useMemo, memo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import {
  fetchApprovalPosts,
  approveListing,
  rejectListing,
} from "../redux/slices/postSlice";

// --- Icons ---
const PetIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-8 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-8 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
  </svg>
);

const PriceTagIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const RefreshIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const FilterIcon = () => (
  <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

// --- Helper Components ---

const StatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    approved: "bg-green-500/10 text-green-400 border-green-500/20",
    rejected: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  const defaultStyle = "bg-gray-500/10 text-gray-400 border-gray-500/20";
  const currentStyle = styles[status] || defaultStyle;

  return (
    <div className={`px-3 py-1 rounded-full text-sm font-medium border ${currentStyle}`}>
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
    </div>
  );
};

// --- Sub-Component: Post Card ---
const PostCard = memo(({ post, onApprove, onReject }) => {
  const [showImages, setShowImages] = useState(false);

  const gridClass = useMemo(() => {
    const len = post.images?.length || 0;
    if (len === 1) return "grid-cols-1";
    if (len === 2) return "grid-cols-2";
    return "grid-cols-3";
  }, [post.images]);

  return (
    <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl overflow-hidden">
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Image
              src={post.owner?.userpic}
              alt="User"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            <div>
              <h3 className="text-zinc-100 font-medium">
                {post.owner?.firstname} {post.owner?.lastname}
              </h3>
              <p className="text-sm text-zinc-400">
                {new Date(post.date).toLocaleDateString()}
              </p>
            </div>
          </div>
          <StatusBadge status={post.status} />
        </div>

        {/* Content */}
        <div>
          <h4 className="text-xl text-zinc-100 font-medium mb-2">
            {post.title}
          </h4>
          <p className="text-zinc-300">{post.discription}</p>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center bg-indigo-500/10 px-3 py-1 rounded-full text-indigo-400 text-sm">
            <PriceTagIcon />
            <span className="ml-2">
              {post.type === "free" ? "Free" : `₹${post.amount}`}
            </span>
          </div>

          <div className="flex items-center bg-zinc-800/50 px-3 py-1 rounded-full text-zinc-300 text-sm">
            <PetIcon />
            <span className="ml-2">
              {post.species} • {post.breed}
            </span>
          </div>

          {post.formattedAge && (
            <div className="bg-zinc-800/50 px-3 py-1 rounded-full text-zinc-300 text-sm">
              {post.formattedAge}
            </div>
          )}
        </div>

        {/* Contact */}
        <div className="flex items-center text-sm text-zinc-400">
          <PhoneIcon />
          {post.owner?.phone}
        </div>

        {/* Images */}
        {post.images?.length > 0 && (
          <>
            <button
              className="text-sm text-zinc-400 underline"
              onClick={() => setShowImages(!showImages)}
            >
              {showImages ? "Hide images" : `Show images (${post.images.length})`}
            </button>

            {showImages && (
              <div className={`grid ${gridClass} gap-3`}>
                {post.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt="Pet"
                    className="aspect-square object-cover rounded-lg"
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Actions */}
        {post.status === "pending" && (
          <div className="flex gap-4 pt-4">
            <button
              onClick={() => onApprove(post.id)}
              className="flex-1 bg-green-500/10 text-green-400 py-2 rounded-lg"
            >
              Approve
            </button>
            <button
              onClick={() => onReject(post.id)}
              className="flex-1 bg-red-500/10 text-red-400 py-2 rounded-lg"
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

PostCard.displayName = "PostCard";

// --- Main Container Component ---
const ApprovalPost = () => {
  const dispatch = useDispatch();
  const { approvalPosts, loading, error } = useSelector((state) => state.posts);

  // --- Filter State ---
  const [searchTerm, setSearchTerm] = useState("");
  // New state for debouncing
  const [debouncedSearch, setDebouncedSearch] = useState(""); 
  const [statusFilter, setStatusFilter] = useState("all");
  const [speciesFilter, setSpeciesFilter] = useState("all");

  // --- Debounce Effect ---
  // Wait 500ms after user stops typing before updating debouncedSearch
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // --- Fetch Data Effect ---
  // Trigger fetch when debouncedSearch, status, or species changes
  useEffect(() => {
    const filters = {
      search: debouncedSearch,
      status: statusFilter,
      species: speciesFilter,
    };
    dispatch(fetchApprovalPosts(filters));
  }, [dispatch, debouncedSearch, statusFilter, speciesFilter]);

  const handleRefresh = () => {
    const filters = {
      search: debouncedSearch,
      status: statusFilter,
      species: speciesFilter,
    };
    dispatch(fetchApprovalPosts(filters));
  };

  const handleApprove = useCallback((postId) => {
    dispatch(approveListing(postId));
  }, [dispatch]);

  const handleReject = useCallback((postId) => {
    dispatch(rejectListing(postId));
  }, [dispatch]);

  // Static species list for dropdown (since server filtering might return empty list)
  const commonSpecies = ["Dog", "Cat", "Bird", "Rabbit", "Fish", "Other"];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-zinc-100">Pet Sale Approvals</h2>
        
        {/* Refresh Button */}
        <button 
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center px-3 py-2 text-sm text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors disabled:opacity-50"
        >
          <span className={`mr-2 ${loading ? "animate-spin" : ""}`}>
            <RefreshIcon />
          </span>
          {loading ? "Refetching..." : "Refresh"}
        </button>
      </div>

      {/* --- Filter Section --- */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Search Input */}
        <div className="md:col-span-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Search by title, author, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
          />
        </div>

        {/* Status Dropdown */}
        <div className="md:col-span-3 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FilterIcon />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 appearance-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Species Dropdown */}
        <div className="md:col-span-3 relative">
           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <PetIcon />
          </div>
          <select
            value={speciesFilter}
            onChange={(e) => setSpeciesFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 appearance-none cursor-pointer"
          >
            <option value="all">All Species</option>
            {commonSpecies.map(species => (
              <option key={species} value={species}>
                {species}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Show Error if any */}
      {error && (
        <div className="p-4 mb-6 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Grid Content */}
      {/* Note: We map 'approvalPosts' directly now, as the backend does the filtering */}
      {loading ? (
         <div className="text-zinc-400 animate-pulse">Loading approvals...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {approvalPosts && approvalPosts.length > 0 ? (
            approvalPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))
          ) : (
            <div className="col-span-full py-10 flex flex-col items-center justify-center text-zinc-400 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
               <p className="text-lg font-medium">No posts found</p>
               <p className="text-sm text-zinc-500">Try adjusting your filters</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApprovalPost;