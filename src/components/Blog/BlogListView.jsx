import { Plus, Search } from "lucide-react";
import BlogItem from "./BlogItem";

export default function BlogListView({
  posts,
  loading,
  error,
  onCreate,
  onEdit,
  onDelete,
}) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog Posts</h1>
          <p className="text-zinc-400 text-sm">
            Manage your content and publications
          </p>
        </div>
        <button
          onClick={onCreate}
          className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-zinc-200 transition-colors"
        >
          <Plus className="w-4 h-4" /> Create New Post
        </button>
      </div>

      {/* Filters / Search */}
      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search posts..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-600"
          />
        </div>
        <select className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-400 focus:outline-none">
          <option>All Categories</option>
          <option>Pet Health</option>
          <option>Behavior</option>
          <option>Products</option>
        </select>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
      {error && (
        <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-lg">
          <p className="font-medium">Error loading posts</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-zinc-400">
            No blog posts yet. Create one to get started!
          </p>
        </div>
      )}

      {/* List */}
      <div className="grid gap-3">
        {!loading &&
          posts.map((blog) => (
            <BlogItem
              key={blog._id}
              blog={blog}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
      </div>
    </div>
  );
}
