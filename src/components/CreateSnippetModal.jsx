"use client";

import React, { useState } from "react";
import { FiX } from "react-icons/fi";

export default function CreateSnippetModal({ isOpen, onClose, onCreate }) {
  const [name, setName] = useState("");

  const handleNameKeyPress = (e) => {
    if (e.key === "Enter" && name.trim()) {
      handleCreate();
    }
  };

  const handleCreate = () => {
    if (!name.trim()) {
      alert("Please enter a snippet name");
      return;
    }

    onCreate({
      name: name.trim(),
    });

    setName("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 w-screen h-screen backdrop-blur flex items-center justify-center z-50">
      <div
        className="bg-dark-surface bg-opacity-95 backdrop-blur-lg border border-dark-border 
                      rounded-2xl shadow-2xl w-full max-w-2xl max-h-[300px] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-border bg-dark-bg bg-opacity-50">
          <h2 className="text-2xl font-bold text-gray-100">
            Create New Snippet
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <FiX size={28} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-3">
              Snippet Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleNameKeyPress}
              placeholder="e.g., React Hook Logic, API Call..."
              className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg 
                         text-gray-100 placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-primary-600 
                         focus:border-primary-600 transition-all"
              autoFocus
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-dark-border bg-dark-bg bg-opacity-50">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-dark-border text-gray-300 rounded-lg 
                       hover:bg-dark-hover hover:text-gray-100 transition-all font-medium"
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            disabled={!name.trim()}
            className="px-6 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 
                       disabled:cursor-not-allowed text-white rounded-lg 
                       transition-all font-semibold shadow-lg"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
