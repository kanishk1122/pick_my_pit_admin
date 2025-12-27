"use client";

import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from "@/redux/slices/blogSlice";
import BlogListView from "./BlogListView";
import BlogEditorView from "./BlogEditorView";
import Toast from "@/components/Toast";

export default function BlogManager() {
  const dispatch = useDispatch();
  const { posts, pagination, loading, error } = useSelector(
    (state) => state.blogs
  );

  const [view, setView] = useState("list"); // 'list' | 'editor'
  const [currentPost, setCurrentPost] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [toast, setToast] = useState(null);

  // Fetch posts on component mount
  useEffect(() => {
    dispatch(fetchBlogs({ status: "all" }));
  }, [dispatch]);

  const showToast = useCallback((message, type = "success", duration = 3000) => {
    setToast({ message, type, id: Date.now() });
    if (duration > 0) {
      setTimeout(() => setToast(null), duration);
    }
  }, []);

  const handleCreate = useCallback(() => {
    setCurrentPost(null);
    setSaveError(null);
    setView("editor");
  }, []);

  const handleEdit = useCallback((post) => {
    setCurrentPost(post);
    setSaveError(null);
    setView("editor");
  }, []);

  const handleDelete = useCallback(
    (id) => {
      const post = posts.find((p) => p._id === id);
      if (
        window.confirm(
          `Are you sure you want to delete "${post?.title || "this post"}"?`
        )
      ) {
        dispatch(deleteBlog(id))
          .then(() => {
            showToast(`Post deleted successfully`, "success");
          })
          .catch((error) => {
            showToast(
              error?.message || "Failed to delete post",
              "error"
            );
          });
      }
    },
    [posts, dispatch, showToast]
  );

  const handleSave = useCallback(
    async (formData) => {
      try {
        setIsSaving(true);
        setSaveError(null);

        if (currentPost?._id) {
          // Update
          await dispatch(
            updateBlog({ id: currentPost._id, ...formData })
          ).unwrap();
          showToast("Post updated successfully", "success");
        } else {
          // Create
          await dispatch(createBlog(formData)).unwrap();
          showToast("Post created successfully", "success");
        }

        setView("list");
        setCurrentPost(null);
      } catch (err) {
        const errorMessage =
          err?.message ||
          err?.payload?.message ||
          "Failed to save post. Please try again.";
        setSaveError(errorMessage);
        showToast(errorMessage, "error", 5000);
      } finally {
        setIsSaving(false);
      }
    },
    [currentPost, dispatch, showToast]
  );

  const handleCancel = useCallback(() => {
    setView("list");
    setCurrentPost(null);
    setSaveError(null);
  }, []);

  return (
    <>
      {view === "list" ? (
        <BlogListView
          posts={posts}
          loading={loading}
          error={error}
          onCreate={handleCreate}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <BlogEditorView
          post={currentPost}
          onSave={handleSave}
          onCancel={handleCancel}
          isSaving={isSaving}
          error={saveError}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
