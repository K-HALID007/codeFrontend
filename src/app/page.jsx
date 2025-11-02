"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import CodeEditor from "../components/CodeEditor";
import { snippetAPI } from "../services/api";

export default function Home() {
  const [snippets, setSnippets] = useState([]);
  const [selectedSnippet, setSelectedSnippet] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchSnippets();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchSnippets(searchQuery);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const fetchSnippets = async (search = "") => {
    try {
      const response = await snippetAPI.getAll(search);
      setSnippets(response.data || []);
    } catch (err) {
      console.error("Error fetching snippets:", err);
    }
  };

  const createSnippet = async (snippetData) => {
    try {
      const dataToSend = {
        ...snippetData,
        code: snippetData.code || "// Start coding here\n",
      };
      const response = await snippetAPI.create(dataToSend);
      setSnippets([response.data, ...snippets]);
      setSelectedSnippet(response.data);
      setIsEditMode(true); // Auto-enter edit mode for new snippets
    } catch (err) {
      console.error("Error creating snippet:", err);
    }
  };

  const updateSnippet = async (id, snippetData) => {
    try {
      const response = await snippetAPI.update(id, snippetData);
      setSnippets(snippets.map((s) => (s._id === id ? response.data : s)));
      setSelectedSnippet(response.data);
    } catch (err) {
      console.error("Error updating snippet:", err);
    }
  };

  const deleteSnippet = async (id) => {
    try {
      await snippetAPI.delete(id);
      setSnippets(snippets.filter((s) => s._id !== id));
      if (selectedSnippet?._id === id) {
        setSelectedSnippet(null);
      }
    } catch (err) {
      console.error("Error deleting snippet:", err);
    }
  };

  const handleEditSnippet = (snippet) => {
    setSelectedSnippet(snippet);
    setIsEditMode(true); // Auto-enter edit mode
  };

  return (
    <div className="flex h-screen overflow-hidden bg-dark-bg">
      <Sidebar
        snippets={snippets}
        selectedSnippet={selectedSnippet}
        onSelectSnippet={setSelectedSnippet}
        onCreateSnippet={createSnippet}
        onDeleteSnippet={deleteSnippet}
        onEditSnippet={handleEditSnippet}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <CodeEditor
        snippet={selectedSnippet}
        onUpdateSnippet={updateSnippet}
        onDeleteSnippet={deleteSnippet}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
      />
    </div>
  );
}
