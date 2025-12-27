import { useState, useCallback } from "react";
import { ChevronLeft, Save, AlertCircle } from "lucide-react";
import ImageUploader from "./ImageUploader";
import BlogEditor from "./BlogEditor";

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

export default function BlogEditorView({
  post,
  onSave,
  onCancel,
  isSaving,
  error,
}) {
  const [formData, setFormData] = useState({
    title: post?.title || "",
    category: post?.category || "General",
    coverImage: post?.coverImage || "",
    content: post?.content
      ? ensureNonEmptyContent(post.content)
      : EMPTY_CONTENT,
    status: post?.status || "draft",
  });

  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = useCallback(() => {
    const errors = {};

    if (!formData.title?.trim()) {
      errors.title = "Title is required (minimum 5 characters)";
    } else if (formData.title.trim().length < 5) {
      errors.title = "Title must be at least 5 characters";
    }

    if (!formData.content || !formData.content.root?.children?.length) {
      errors.content = "Content is required";
    }

    if (!formData.category) {
      errors.category = "Category is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleSave = useCallback(() => {
    if (!validateForm()) return;

    onSave({
      id: post?._id,
      ...formData,
    });
  }, [formData, onSave, validateForm, post]);

  const handleTitleChange = useCallback(
    (e) => {
      setFormData((prev) => ({ ...prev, title: e.target.value }));
      if (validationErrors.title) {
        setValidationErrors((prev) => ({ ...prev, title: "" }));
      }
    },
    [validationErrors.title]
  );

  const handleContentChange = useCallback(
    (val) => {
      setFormData((prev) => ({ ...prev, content: val }));
      if (validationErrors.content) {
        setValidationErrors((prev) => ({ ...prev, content: "" }));
      }
    },
    [validationErrors.content]
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Editor Header */}
      <div className="flex items-center justify-between mb-6 sticky top-0 bg-black z-10 py-4 border-b border-zinc-800">
        <div className="flex items-center gap-4">
          <button
            onClick={onCancel}
            disabled={isSaving}
            className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white disabled:opacity-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-bold text-white">
            {post ? "Edit Post" : "Create Post"}
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            disabled={isSaving}
            className="px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save
              </>
            )}
          </button>
        </div>
      </div>

      <div className="space-y-6 pb-20">
        {/* Global Error */}
        {error && (
          <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-lg flex gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Failed to save post</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Cover Image Uploader */}
        <div>
          <label className="text-xs font-semibold text-zinc-500 uppercase block mb-3">
            Cover Image
          </label>
          <ImageUploader
            value={formData.coverImage}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, coverImage: val }))
            }
            isUploading={isSaving}
          />
          <p className="text-xs text-zinc-500 mt-2">
            Recommended: 1200x630px, max 5MB
          </p>
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
              onChange={handleTitleChange}
              disabled={isSaving}
              className={`w-full bg-zinc-900 border rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 transition-all disabled:opacity-50 ${
                validationErrors.title
                  ? "border-red-600 focus:ring-red-600"
                  : "border-zinc-800 focus:ring-zinc-700"
              }`}
              placeholder="Enter a catchy title..."
            />
            {validationErrors.title && (
              <p className="text-xs text-red-400">{validationErrors.title}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-500 uppercase">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value }))
              }
              disabled={isSaving}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all disabled:opacity-50"
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
                setFormData((prev) => ({ ...prev, status: e.target.value }))
              }
              disabled={isSaving}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all disabled:opacity-50"
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
          <BlogEditor
            initialContent={formData.content}
            onChange={handleContentChange}
          />
          {validationErrors.content && (
            <p className="text-xs text-red-400 mt-2">
              {validationErrors.content}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
