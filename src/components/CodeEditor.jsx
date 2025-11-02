"use client";

import React, { useState, useEffect } from "react";
import { FiCopy, FiSave, FiCheck, FiDownload, FiX } from "react-icons/fi";
import dynamic from "next/dynamic";

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-black text-gray-400">
      Loading editor...
    </div>
  ),
});

function CodeEditor({ snippet, onUpdateSnippet, isEditMode, setIsEditMode }) {
  const [name, setName] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (snippet) {
      setName(snippet.name);
      setLanguage(snippet.language || "javascript");
      setCode(snippet.code);
      setDescription(snippet.description || "");
    }
  }, [snippet]);

  const handleSave = async () => {
    if (snippet) {
      await onUpdateSnippet(snippet._id, {
        name,
        language,
        code,
        description,
      });
      setSaved(true);
      setIsEditMode(false);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([code], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${name}.${getFileExtension(language)}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCancel = () => {
    setName(snippet.name);
    setLanguage(snippet.language || "javascript");
    setCode(snippet.code);
    setDescription(snippet.description || "");
    setIsEditMode(false);
  };

  const getFileExtension = (lang) => {
    const extensions = {
      javascript: "js",
      python: "py",
      css: "css",
      html: "html",
      typescript: "ts",
      bash: "sh",
      cpp: "cpp",
      java: "java",
      csharp: "cs",
      php: "php",
      ruby: "rb",
      go: "go",
      rust: "rs",
      swift: "swift",
      kotlin: "kt",
      sql: "sql",
      json: "json",
      xml: "xml",
      yaml: "yml",
      markdown: "md",
      lua: "lua",
      perl: "pl",
      r: "r",
      matlab: "m",
      dart: "dart",
      c: "c",
    };
    return extensions[lang] || "txt";
  };

  const getMonacoLanguage = (lang) => {
    const languageMap = {
      javascript: "javascript",
      python: "python",
      css: "css",
      html: "html",
      typescript: "typescript",
      bash: "shell",
      json: "json",
      jsx: "javascript",
      tsx: "typescript",
      cpp: "cpp",
      java: "java",
      csharp: "csharp",
      php: "php",
      ruby: "ruby",
      go: "go",
      rust: "rust",
      swift: "swift",
      kotlin: "kotlin",
      sql: "sql",
      xml: "xml",
      yaml: "yaml",
      markdown: "markdown",
      lua: "lua",
      perl: "perl",
      r: "r",
      matlab: "matlab",
      dart: "dart",
      c: "c",
      scss: "scss",
      less: "less",
    };
    return languageMap[lang] || "plaintext";
  };

  if (!snippet) {
    return (
      <div className="flex-1 flex items-center justify-center bg-black">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-300 mb-2">
            No Snippet Selected
          </h2>
          <p className="text-gray-500">
            Select or create a snippet to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-black overflow-hidden">
      {/* Header with Title */}
      <div className="border-b border-dark-border p-4 bg-dark-surface shrink-0">
        {isEditMode ? (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Snippet Name"
            className="w-full text-2xl font-bold bg-transparent border-none 
                       text-gray-100 placeholder-gray-500 focus:outline-none"
          />
        ) : (
          <h1 className="w-full text-2xl font-bold text-gray-100">{name}</h1>
        )}
        <p className="text-xs text-gray-500 mt-2">
          Created on{" "}
          {snippet.createdAt
            ? new Date(snippet.createdAt).toLocaleDateString()
            : "Unknown"}
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-dark-surface border-b border-dark-border shrink-0">
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400 bg-dark-bg px-3 py-1 rounded-lg">
            {code.split("\n").length} lines • {code.length} chars
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isEditMode ? (
            <>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-1.5 text-sm border border-dark-border rounded-lg hover:bg-gray-600 transition-colors text-gray-300"
              >
                <FiX size={16} />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-1.5 text-sm bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-white"
              >
                {saved ? (
                  <>
                    <FiCheck size={16} /> Saved
                  </>
                ) : (
                  <>
                    <FiSave size={16} /> Save
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-3 py-1.5 text-sm border border-dark-border rounded-lg hover:bg-dark-hover transition-colors text-gray-300 cursor-pointer"
              >
                <FiDownload size={16} />
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1.5 text-sm border border-dark-border rounded-lg hover:bg-dark-hover transition-colors text-gray-300 cursor-pointer"
              >
                {copied ? (
                  <>
                    <FiCheck size={16} className="text-green-400" /> Copied
                  </>
                ) : (
                  <>
                    <FiCopy size={16} /> Copy
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Code Display Area */}
      <div className="flex-1 overflow-hidden bg-black">
        <MonacoEditor
          height="100%"
          language={getMonacoLanguage(language)}
          value={code}
          onChange={isEditMode ? (value) => setCode(value || "") : undefined}
          theme="vs-dark"
          options={{
            readOnly: !isEditMode,
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: "on",
            wrappingIndent: "indent",
            padding: { top: 16, bottom: 16 },
            contextmenu: !isEditMode,
            quickSuggestions: isEditMode,
            suggestOnTriggerCharacters: isEditMode,
            parameterHints: { enabled: isEditMode },
            hover: { enabled: true },
            folding: true,
            renderLineHighlight: isEditMode ? "all" : "none",
            cursorBlinking: isEditMode ? "blink" : "solid",
          }}
        />
      </div>
    </div>
  );
}

export default CodeEditor;
