import React from "react";
import { FiTrash2, FiEdit2 } from "react-icons/fi";
import { getLanguageIcon } from "../utils/languageIcons.jsx";

function SnippetItem({ snippet, isSelected, onSelect, onDelete, onEdit }) {
  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm("Delete this snippet?")) {
      onDelete(snippet._id);
    }
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
            className="p-1.5 hover:bg-blue-600 hover:text-white text-gray-400 rounded transition-all"
            title="Edit"
          >
            <FiEdit2 size={16} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 hover:bg-red-600 hover:text-white text-gray-400 rounded transition-all"
            title="Delete"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      )}

      {isSelected && (
        <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
      )}
    </div>
  );
}

export default SnippetItem;
