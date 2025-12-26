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

const PhoneIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const RefreshIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ImageIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

// --- Helper Components ---

const StatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-amber-500/10 text-amber-500 ring-amber-500/20",
    approved: "bg-emerald-500/10 text-emerald-500 ring-emerald-500/20",
    rejected: "bg-rose-500/10 text-rose-500 ring-rose-500/20",
  };

  const defaultStyle = "bg-zinc-500/10 text-zinc-400 ring-zinc-500/20";
  const currentStyle = styles[status] || defaultStyle;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${currentStyle}`}>
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
    </span>
  );
};

// --- Sub-Component: Post Card ---
const PostCard = memo(({ post, onApprove, onReject }) => {
  const [showAllImages, setShowAllImages] = useState(false);

  // Use the first image as cover, or a placeholder
  const coverImage = post.images?.[0] || "/placeholder-pet.png";
  const additionalImages = post.images?.slice(1) || [];

  return (
    <div className="group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all duration-300 shadow-lg flex flex-col h-full">
      
      {/* --- Card Header / Cover Image --- */}
      <div className="relative h-48 w-full bg-zinc-800 overflow-hidden">
        {/* Main Image */}
        <Image
          src={coverImage}
          alt={post.title}
          width={400}
          height={300}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-transparent to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <StatusBadge status={post.status} />
        </div>

        {/* Price Tag (Bottom Left of Image) */}
        <div className="absolute bottom-3 left-3">
           <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg text-white text-sm font-semibold shadow-sm">
             <PriceTagIcon />
             <span>{post.type === "free" ? "Free Adoption" : `₹${post.amount}`}</span>
           </div>
        </div>

        {/* More Images Indicator */}
        {additionalImages.length > 0 && (
          <button 
            onClick={(e) => { e.stopPropagation(); setShowAllImages(!showAllImages); }}
            className="absolute bottom-3 right-3 bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 px-2 py-1.5 rounded-lg text-xs text-white flex items-center gap-1 transition-colors"
          >
            <ImageIcon />
            <span>+{additionalImages.length}</span>
          </button>
        )}
      </div>

      {/* --- Expandable Image Gallery --- */}
      {showAllImages && additionalImages.length > 0 && (
        <div className="grid grid-cols-3 gap-1 bg-zinc-950 p-1 border-b border-zinc-800 animate-in slide-in-from-top-2">
          {additionalImages.map((img, i) => (
            <div key={i} className="relative h-20 w-full rounded overflow-hidden">
               <Image src={img} alt="Gallery" fill className="object-cover" />
            </div>
          ))}
        </div>
      )}

      {/* --- Content Body --- */}
      <div className="p-5 flex-1 flex flex-col">
        
        {/* Title & Breed */}
        <div className="mb-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-bold text-zinc-100 line-clamp-1" title={post.title}>
              {post.title}
            </h3>
          </div>
          <div className="flex items-center gap-2 mt-1 text-sm text-zinc-400">
            <span className="flex items-center gap-1">
               <PetIcon /> {post.species}
            </span>
            <span className="w-1 h-1 rounded-full bg-zinc-600" />
            <span>{post.breed}</span>
            {post.formattedAge && (
              <>
                <span className="w-1 h-1 rounded-full bg-zinc-600" />
                <span>{post.formattedAge}</span>
              </>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-zinc-500 line-clamp-2 mb-4 flex-1">
          {post.discription}
        </p>

        {/* Owner Info */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50 mt-auto">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-zinc-700">
              <Image
                src={post.owner?.userpic || "/placeholder-user.jpg"}
                alt="Owner"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-zinc-200">
                {post.owner?.firstname}
              </span>
              <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                <PhoneIcon /> {post.owner?.phone || "N/A"}
              </div>
            </div>
          </div>
          <div className="text-[10px] text-zinc-600 font-mono">
            {new Date(post.date).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* --- Action Footer --- */}
      {post.status === "pending" && (
        <div className="grid grid-cols-2 divide-x divide-zinc-800 border-t border-zinc-800">
          <button
            onClick={() => onReject(post.id)}
            className="flex items-center justify-center gap-2 py-3 text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
          >
            <XIcon /> Reject
          </button>
          <button
            onClick={() => onApprove(post.id)}
            className="flex items-center justify-center gap-2 py-3 text-sm font-medium text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 transition-colors"
          >
            <CheckIcon /> Approve
          </button>
        </div>
      )}
    </div>
  );
});

PostCard.displayName = "PostCard";

// --- Main Component ---
const ApprovalPost = () => {
  const dispatch = useDispatch();
  const { approvalPosts, loading, error } = useSelector((state) => state.posts);

  // --- Filter State ---
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [speciesFilter, setSpeciesFilter] = useState("all");

  // Debounce Logic
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch Logic
  const fetchFilters = useMemo(() => ({
    search: debouncedSearch,
    status: statusFilter,
    species: speciesFilter,
  }), [debouncedSearch, statusFilter, speciesFilter]);

  useEffect(() => {
    dispatch(fetchApprovalPosts(fetchFilters));
  }, [dispatch, fetchFilters]);

  const handleRefresh = () => {
    dispatch(fetchApprovalPosts(fetchFilters));
  };

  const handleApprove = useCallback((postId) => dispatch(approveListing(postId)), [dispatch]);
  const handleReject = useCallback((postId) => dispatch(rejectListing(postId)), [dispatch]);

  const commonSpecies = ["Dog", "Cat", "Bird", "Rabbit", "Fish", "Other"];

  return (
    <div className="min-h-screen bg-zinc-950 p-6 md:p-8 text-zinc-100">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Pet Approvals</h1>
          <p className="text-sm text-zinc-400 mt-1">Review and manage pet listing requests.</p>
        </div>
        
        <button 
          onClick={handleRefresh}
          disabled={loading}
          className="self-start md:self-auto flex items-center gap-2 px-4 py-2 bg-white text-zinc-900 text-sm font-semibold rounded-lg hover:bg-zinc-200 disabled:opacity-50 transition-all shadow-sm shadow-zinc-900/50"
        >
          <span className={`${loading ? "animate-spin" : ""}`}>
            <RefreshIcon />
          </span>
          {loading ? "Syncing..." : "Sync Posts"}
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-zinc-900/50 border border-zinc-800 p-1.5 rounded-xl mb-8 flex flex-col md:flex-row gap-2">
        {/* Search */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Search by title, owner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer hover:bg-zinc-800 transition-colors"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={speciesFilter}
            onChange={(e) => setSpeciesFilter(e.target.value)}
            className="h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer hover:bg-zinc-800 transition-colors"
          >
            <option value="all">All Species</option>
            {commonSpecies.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      
      {/* Error Banner */}
      {error && (
        <div className="p-4 mb-6 bg-red-950/30 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
          <XIcon />
          <span>{error}</span>
        </div>
      )}

      {/* Grid Content */}
      {loading && !approvalPosts.length ? (
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-[400px] bg-zinc-900/50 rounded-2xl animate-pulse border border-zinc-800"></div>
            ))}
         </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
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
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-zinc-500 border-2 border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20">
               <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                 <SearchIcon />
               </div>
               <p className="text-lg font-medium text-zinc-300">No requests found</p>
               <p className="text-sm">Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApprovalPost;