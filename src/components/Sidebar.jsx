"use client";

import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import SearchBar from "./SearchBar";
import SnippetItem from "./SnippetItem";
import CreateSnippetModal from "./CreateSnippetModal";

export default function Sidebar({
  snippets,
  selectedSnippet,
  onSelectSnippet,
  onCreateSnippet,
  onDeleteSnippet,
  onEditSnippet,
  searchQuery,
  setSearchQuery,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateSnippet = (snippetData) => {
    onCreateSnippet(snippetData);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="w-96 bg-dark-surface border-r border-dark-border flex flex-col h-screen">
        <div className="p-4 border-b border-dark-border">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>

        <div className="p-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 
                       text-white font-semibold rounded-lg transition-colors 
                       flex items-center justify-center gap-2 shadow-lg cursor-pointer"
          >
            <FiPlus size={20} />
            New Snippet
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin px-4 pb-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Snippets ({snippets?.length || 0})
          </h2>

          <div className="space-y-2">
            {!snippets || snippets.length === 0 ? (
              <p className="text-center text-gray-500 text-sm py-8">
                No snippets found. Create one!
              </p>
            ) : (
              snippets.map((snippet) => (
                <SnippetItem
                  key={snippet._id}
                  snippet={snippet}
                  isSelected={selectedSnippet?._id === snippet._id}
                  onSelect={() => onSelectSnippet(snippet)}
                  onEdit={onEditSnippet}
                  onDelete={onDeleteSnippet}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <CreateSnippetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateSnippet}
      />
    </>
  );
}
