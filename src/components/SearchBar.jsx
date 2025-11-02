import React from "react";
import { FiSearch } from "react-icons/fi";

function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div className="relative">
      <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder="Search snippets..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-10 pr-4 py-3 bg-dark-bg border border-dark-border rounded-lg 
                   text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 
                   focus:ring-primary-600 focus:border-transparent transition-all"
      />
    </div>
  );
}

export default SearchBar;
