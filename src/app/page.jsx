"use client";

import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import Sidebar from "@/components/Sidebar";
import CodeEditor from "@/components/CodeEditor";
import { snippetAPI } from "@/services/api";


const socket = io(
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000"
);

export default function Home() {
  const [snippets, setSnippets] = useState([]);
  const [selectedSnippet, setSelectedSnippet] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch initial snippets
  useEffect(() => {
    fetchSnippets();
  }, []);

  // Search snippets
  useEffect(() => {
    if (searchQuery.trim()) {
      fetchSnippets(searchQuery);
    } else {
      fetchSnippets();
    }
  }, [searchQuery]);

  // ========== SET UP SOCKET LISTENERS (Only in App) ==========
  useEffect(() => {
    // When another user creates a snippet
    const handleSnippetCreated = (newSnippet) => {
      console.log(
        "📝 Socket: Snippet created by another user:",
        newSnippet.name
      );
      setSnippets((prev) => {
        if (prev.some((s) => s._id === newSnippet._id)) {
          console.warn("⚠️ Already exists, skipping");
          return prev;
        }
        toast.info(`📝 "${newSnippet.name}" created by another user`);
        return [newSnippet, ...prev];
      });
    };

    // When another user updates a snippet
    const handleSnippetUpdated = (updatedSnippet) => {
      console.log(
        "🔄 Socket: Snippet updated by another user:",
        updatedSnippet.name
      );
      setSnippets((prev) =>
        prev.map((s) => (s._id === updatedSnippet._id ? updatedSnippet : s))
      );

      if (selectedSnippet?._id === updatedSnippet._id) {
        setSelectedSnippet(updatedSnippet);
      }

      toast.info(`🔄 "${updatedSnippet.name}" updated by another user`);
    };

    // When another user deletes a snippet
    const handleSnippetDeleted = (deletedId) => {
      console.log("🗑️ Socket: Snippet deleted by another user:", deletedId);
      const deletedSnippet = snippets.find((s) => s._id === deletedId);

      setSnippets((prev) => prev.filter((s) => s._id !== deletedId));

      if (selectedSnippet?._id === deletedId) {
        setSelectedSnippet(null);
      }

      toast.warning(`🗑️ "${deletedSnippet?.name}" deleted by another user`);
    };

    // Attach listeners
    socket.on("snippet-created", handleSnippetCreated);
    socket.on("snippet-updated", handleSnippetUpdated);
    socket.on("snippet-deleted", handleSnippetDeleted);

    console.log("✅ Socket listeners attached");

    // Cleanup
    return () => {
      socket.off("snippet-created", handleSnippetCreated);
      socket.off("snippet-updated", handleSnippetUpdated);
      socket.off("snippet-deleted", handleSnippetDeleted);
      console.log("🧹 Socket listeners removed");
    };
  }, [selectedSnippet, snippets]);

  const fetchSnippets = async (search = "") => {
    try {
      const data = await snippetAPI.getAll(search);
      setSnippets(data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch snippets:", error);
      toast.error("Failed to load snippets");
      setLoading(false);
    }
  };

  // Create new snippet
  const handleCreateSnippet = async (snippetData) => {
    try {
      const response = await snippetAPI.create(snippetData);
      const newSnippet = response.data;

      // Add to local state immediately
      setSnippets((prev) => [newSnippet, ...prev]);
      setSelectedSnippet(newSnippet);

      // Broadcast to OTHER users (NOT back to self)
      socket.emit("create-snippet", newSnippet);

      toast.success(`"${newSnippet.name}" created!`);
    } catch (error) {
      console.error("Failed to create snippet:", error);
      toast.error("Failed to create snippet");
    }
  };

  // Update snippet
  const handleUpdateSnippet = async (id, snippetData) => {
    try {
      const response = await snippetAPI.update(id, snippetData);
      const updatedSnippet = response.data;

      // Update local state
      setSnippets((prev) =>
        prev.map((s) => (s._id === id ? updatedSnippet : s))
      );
      setSelectedSnippet(updatedSnippet);

      // Broadcast to other users
      socket.emit("update-snippet", updatedSnippet);

      toast.success("Snippet updated!");
    } catch (error) {
      console.error("Failed to update snippet:", error);
      toast.error("Failed to update snippet");
    }
  };

  // Delete snippet
  const handleDeleteSnippet = async (id) => {
    try {
      await snippetAPI.delete(id);

      // Remove from local state
      setSnippets((prev) => prev.filter((s) => s._id !== id));
      if (selectedSnippet?._id === id) {
        setSelectedSnippet(null);
      }

      // Broadcast to other users
      socket.emit("delete-snippet", id);

      toast.success("Snippet deleted!");
    } catch (error) {
      console.error("Failed to delete snippet:", error);
      toast.error("Failed to delete snippet");
    }
  };

  // Edit snippet
  const handleEditSnippet = (snippet) => {
    setSelectedSnippet(snippet);
    setIsEditMode(true);
  };

  // When snippet is deleted from editor
  const handleSnippetDeletedFromEditor = (deletedId) => {
    setSnippets((prev) => prev.filter((s) => s._id !== deletedId));
    setSelectedSnippet(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading snippets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black">
      <Sidebar
        snippets={snippets}
        selectedSnippet={selectedSnippet}
        onSelectSnippet={setSelectedSnippet}
        onCreateSnippet={handleCreateSnippet}
        onDeleteSnippet={handleDeleteSnippet}
        onEditSnippet={handleEditSnippet}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <CodeEditor
        snippet={selectedSnippet}
        onUpdateSnippet={handleUpdateSnippet}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
        onSnippetDeleted={handleSnippetDeletedFromEditor}
      />
    </div>
  );
}
