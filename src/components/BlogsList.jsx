"use client";

import { useState, useEffect, useCallback,useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../redux/slices/blogSlice";
import {
  Plus,
  Search,
  MoreVertical,
  Image as ImageIcon,
  X,
  ChevronLeft,
  Save,
  Trash2,
  Edit3,
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  Quote,
  List,
} from "lucide-react";

// --- LEXICAL IMPORTS ---
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  $getRoot,
} from "lexical";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Minimal non-empty Lexical state to satisfy backend validation and avoid empty root errors
const EMPTY_CONTENT = {
  root: {
    children: [
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            text: "",
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            version: 1,
          },
        ],
        direction: null,
        format: "",
        indent: 0,
        version: 1,
      },
    ],
    direction: null,
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
};

const ensureNonEmptyContent = (content) => {
  const safe = content && typeof content === "object" ? content : EMPTY_CONTENT;
  if (
    safe?.root?.children &&
    Array.isArray(safe.root.children) &&
    safe.root.children.length > 0
  ) {
    return safe;
  }
  return EMPTY_CONTENT;
};

// --- 1. LEXICAL TOOLBAR COMPONENT ---
function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
    }
  }, []);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  const ToolbarButton = ({ onClick, isActive, icon: Icon, label }) => (
    <button
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={twMerge(
        "p-2 rounded-md transition-colors hover:bg-zinc-700",
        isActive ? "bg-zinc-700 text-white" : "text-zinc-400"
      )}
      title={label}
      type="button"
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  return (
    <div className="flex items-center gap-1 border-b border-zinc-700 p-2 mb-2">
      <ToolbarButton
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
        isActive={isBold}
        icon={Bold}
        label="Bold"
      />
      <ToolbarButton
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
        isActive={isItalic}
        icon={Italic}
        label="Italic"
      />
      <ToolbarButton
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
        isActive={isUnderline}
        icon={Underline}
        label="Underline"
      />
      <div className="w-px h-6 bg-zinc-700 mx-1" />
      {/* Note: Heading commands require richer setup with nodes, simplified for demo */}
      <button type="button" className="p-2 text-zinc-400 hover:text-white">
        <Heading1 className="w-4 h-4" />
      </button>
      <button type="button" className="p-2 text-zinc-400 hover:text-white">
        <Heading2 className="w-4 h-4" />
      </button>
      <button type="button" className="p-2 text-zinc-400 hover:text-white">
        <Quote className="w-4 h-4" />
      </button>
    </div>
  );
}

// --- 2. EDITOR WRAPPER ---
const Editor = ({ initialContent, onChange }) => {
  const theme = {
    paragraph: "mb-2 text-zinc-300",
    text: {
      bold: "font-bold text-white",
      italic: "italic",
      underline: "underline",
    },
  };

  const onError = (error) => {
    console.error(error);
  };

  const initialConfig = {
    namespace: "MyBlogEditor",
    theme,
    onError,
    // IMPORTANT: Set editor state from initialContent
    editorState: initialContent
      ? JSON.stringify(ensureNonEmptyContent(initialContent))
      : null,
  };

  return (
    <div className="border border-zinc-700 rounded-lg bg-zinc-900/50 overflow-hidden focus-within:ring-2 focus-within:ring-zinc-600 transition-all">
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <div className="relative min-h-[300px] p-4">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="outline-none min-h-[300px] h-full text-zinc-300" />
            }
            placeholder={
              <div className="absolute top-4 left-4 text-zinc-600 pointer-events-none">
                Start writing your amazing story...
              </div>
            }
            ErrorBoundary={(e) => <div>Something went wrong!</div>}
          />
          <HistoryPlugin />
          {/* CAPTURE EDITOR STATE AND LIFT IT UP */}
          <OnChangePlugin
            onChange={(editorState) => {
              const json = editorState.toJSON();
              onChange(ensureNonEmptyContent(json));
            }}
          />
        </div>
      </LexicalComposer>
    </div>
  );
};

// --- 3. MAIN BLOG MANAGEMENT COMPONENT ---
export default function BlogManager() {
  const dispatch = useDispatch();
  const { posts, pagination, loading, error } = useSelector(
    (state) => state.blogs
  );
  const { user } = useSelector((state) => state.auth);

  const [view, setView] = useState("list"); // 'list' | 'editor'
  const [currentPost, setCurrentPost] = useState(null);
  const fileInputRef = useRef(null);

  // Fetch posts on component mount
  useEffect(() => {
    dispatch(fetchBlogs({ status: "all" }));
  }, [dispatch]);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "General",
    coverImage: "",
    content: EMPTY_CONTENT, // Will hold Lexical JSON state
    status: "draft",
  });

  const handleEdit = (post) => {
    setCurrentPost(post);
    setFormData({
      title: post.title,
      category: post.category,
      coverImage: post.coverImage || "",
      content: ensureNonEmptyContent(post.content), // Load existing Lexical content
      status: post.status,
    });
    setView("editor");
  };

  const handleCreate = () => {
    setCurrentPost(null);
    setFormData({
      title: "",
      category: "General",
      coverImage: "",
      content: EMPTY_CONTENT,
      status: "draft",
    });
    setView("editor");
  };

  const handleSave = () => {
    if (!formData.title?.trim()) {
      alert("Title is required");
      return;
    }
    if (!formData.content) {
      alert("Content is required");
      return;
    }
    if (currentPost) {
      // Update existing
      dispatch(updateBlog({ id: currentPost._id, ...formData }));
    } else {
      // Create new
      dispatch(createBlog(formData));
    }
    setView("list");
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this post?")) {
      dispatch(deleteBlog(id));
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result;
        if (typeof base64 === "string") {
          setFormData({ ...formData, coverImage: base64 });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlPaste = (e) => {
    const url = e.target.value;
    setFormData({ ...formData, coverImage: url });
  };

  // --- VIEW: LIST ---
  if (view === "list") {
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
            onClick={handleCreate}
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
            <option>Products</option>
          </select>
        </div>

        {/* Loading and Error States */}
        {loading && <p className="text-zinc-400">Loading posts...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        {/* List */}
        <div className="grid gap-3">
          {!loading &&
            posts.map((blog) => (
              <div
                key={blog._id}
                className="group flex flex-col sm:flex-row gap-4 p-4 bg-zinc-900/50 border border-zinc-800/50 rounded-xl hover:bg-zinc-800/50 hover:border-zinc-700 transition-all"
              >
                {/* Image Thumbnail */}
                <div className="w-full sm:w-24 h-24 sm:h-20 bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
                  {blog.coverImage ? (
                    <img
                      src={blog.coverImage}
                      alt=""
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
                    <span className="text-xs text-zinc-500">
                      • {blog.category}
                    </span>
                  </div>
                  <h3 className="font-semibold text-zinc-100 truncate">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-zinc-500 mt-1">
                    By {blog.author?.firstname || "Unknown"} •{" "}
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col items-center justify-end gap-2 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(blog)}
                    className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg"
                    title="Edit"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  // --- VIEW: EDITOR ---
  return (
    <div className="max-w-4xl mx-auto">
      {/* Editor Header */}
      <div className="flex items-center justify-between mb-6 sticky top-0 bg-black z-10 py-4 border-b border-zinc-800">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setView("list")}
            className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-bold text-white">
            {currentPost ? "Edit Post" : "Create Post"}
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView("list")}
            className="px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-200"
          >
            <Save className="w-4 h-4" /> Save
          </button>
        </div>
      </div>

      <div className="space-y-6 pb-20">
        {/* Cover Image Uploader */}
        <div
          className="group relative w-full h-48 bg-zinc-900 border-2 border-dashed border-zinc-800 rounded-xl overflow-hidden flex flex-col items-center justify-center transition-colors hover:border-zinc-700 hover:bg-zinc-800/50 cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          {formData.coverImage ? (
            <>
              <img
                src={formData.coverImage}
                className="w-full h-full object-cover"
                alt="Cover"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFormData({ ...formData, coverImage: "" });
                }}
                className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="text-center p-6">
              <ImageIcon className="w-10 h-10 text-zinc-600 mx-auto mb-2 group-hover:text-zinc-400" />
              <p className="text-sm text-zinc-500 mb-4">
                Click to upload cover image or paste URL below
              </p>
              <input
                type="text"
                placeholder="Or paste image URL here..."
                value={formData.coverImage}
                onChange={handleImageUrlPaste}
                onClick={(e) => e.stopPropagation()}
                className="w-64 bg-black border border-zinc-700 rounded px-3 py-2 text-xs text-white text-center focus:outline-none focus:border-zinc-500"
              />
            </div>
          )}
        </div>

        {/* Meta Data Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-500 uppercase">
              Post Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all"
              placeholder="Enter a catchy title..."
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-500 uppercase">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all"
            >
              <option value="General">General</option>
              <option value="Pet Health">Pet Health</option>
              <option value="Behavior">Behavior</option>
              <option value="Products">Products</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-500 uppercase">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        {/* Lexical Editor */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-500 uppercase">
            Content
          </label>
          <Editor
            initialContent={formData.content}
            onChange={(val) => setFormData({ ...formData, content: val })}
          />
        </div>
      </div>
    </div>
  );
}
