import React, { useState } from "react";
import { FiTrash2, FiEdit2 } from "react-icons/fi";
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
      className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all duration-300 border-2 mb-2
        ${
          isSelected
            ? "bg-linear-to-r from-blue-600/15 via-transparent to-transparent border-blue-500/60 shadow-lg shadow-blue-500/30"
            : "bg-dark-surface/30 border-gray-700/40 hover:border-gray-600/60 hover:bg-dark-surface/50"
        }`}
    >
      <div className="flex-1 min-w-0">
        <h3
          className={`text-sm font-semibold truncate transition-colors ${
            isSelected ? "text-primary-300" : "text-gray-100"
          }`}
        >
          {snippet.name}
        </h3>
      </div>

      {isSelected && (
        <div className="flex gap-1 shrink-0">
          <button
            onClick={handleEdit}
            className="p-2 hover:bg-blue-500/30 hover:text-blue-300 text-gray-400 rounded-md transition-all cursor-pointer border border-transparent hover:border-blue-500/40"
            title="Edit"
          >
            <FiEdit2 size={18} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 hover:bg-red-500/30 hover:text-red-300 text-gray-400 rounded-md transition-all cursor-pointer border border-transparent hover:border-red-500/40"
            title="Delete"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      )}

      {isSelected && (
        <div className="shrink-0 w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
      )}

      {showDeleteModal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="bg-black border border-slate-700 rounded-lg p-6 max-w-sm shadow-2xl"
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
