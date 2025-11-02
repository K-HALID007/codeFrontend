import React, { useState } from "react";
import { FiTrash2, FiEdit2 } from "react-icons/fi";
import { getLanguageIcon } from "../utils/languageIcons.jsx";
import { toast } from "react-toastify";

function SnippetItem({ snippet, isSelected, onSelect, onDelete, onEdit }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = (e) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setShowDeleteModal(false);
    onDelete(snippet._id);
    toast.success(`"${snippet.name}" deleted successfully`, {
      position: "bottom-right",
      autoClose: 3000,
    });
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(snippet);
  };

  return (
    <div
      onClick={onSelect}
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 border-l-4
        ${
          isSelected
            ? "bg-gradient-to-r from-primary-600/20 to-transparent border-l-primary-600 shadow-lg shadow-primary-500/20"
            : "border-l-transparent hover:bg-dark-hover/50"
        }`}
    >
      <div
        className={`text-2xl flex-shrink-0 transition-transform ${
          isSelected ? "scale-110" : ""
        }`}
      >
        {getLanguageIcon(snippet.language)}
      </div>

      <div className="flex-1 min-w-0">
        <h3
          className={`text-sm font-semibold truncate transition-colors ${
            isSelected ? "text-primary-300" : "text-gray-100"
          }`}
        >
          {snippet.name}
        </h3>
        <p
          className={`text-xs truncate transition-colors ${
            isSelected ? "text-primary-200/70" : "text-gray-400"
          }`}
        >
          {snippet.language} • {snippet.code?.split("\n").length || 0} lines
        </p>
      </div>

      {/* Edit & Delete Buttons - Only When Selected */}
      {isSelected && (
        <div className="flex gap-1 flex-shrink-0">
          <button
            onClick={handleEdit}
            className="p-1.5 hover:bg-blue-600 hover:text-white text-gray-400 rounded transition-all cursor-pointer"
            title="Edit"
          >
            <FiEdit2 size={16} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 hover:bg-red-600 hover:text-white text-gray-400 rounded transition-all cursor-pointer"
            title="Delete"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      )}

      {isSelected && (
        <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
      )}

      {showDeleteModal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-lg p-6 max-w-sm shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-white mb-2">
              Delete snippet?
            </h3>
            <p className="text-slate-300 text-sm mb-6">
              Are you sure you want to delete{" "}
              <span className="font-medium text-primary-300">
                "{snippet.name}"
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors text-sm font-medium border border-slate-600 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors text-sm font-medium shadow-lg shadow-red-600/30 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SnippetItem;
