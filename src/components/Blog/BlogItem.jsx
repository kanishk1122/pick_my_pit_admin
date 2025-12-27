import { Edit3, Trash2, Image as ImageIcon } from "lucide-react";

export default function BlogItem({ blog, onEdit, onDelete }) {
  return (
    <div className="group flex flex-col sm:flex-row gap-4 p-4 bg-zinc-900/50 border border-zinc-800/50 rounded-xl hover:bg-zinc-800/50 hover:border-zinc-700 transition-all">
      {/* Image Thumbnail */}
      <div className="w-full sm:w-24 h-24 sm:h-20 bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
        {blog.coverImage ? (
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-600">
            <ImageIcon className="w-8 h-8" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full ${
              blog.status === "published"
                ? "bg-green-900/30 text-green-400"
                : "bg-yellow-900/30 text-yellow-400"
            }`}
          >
            {blog.status}
          </span>
          <span className="text-xs text-zinc-500">• {blog.category}</span>
        </div>
        <h3 className="font-semibold text-zinc-100 truncate">{blog.title}</h3>
        <p className="text-sm text-zinc-500 mt-1">
          By {blog.author?.firstname || "Unknown"} •{" "}
          {new Date(blog.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Actions */}
      <div className="flex sm:flex-col items-center justify-end gap-2 sm:opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(blog)}
          className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
          title="Edit"
        >
          <Edit3 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(blog._id)}
          className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
