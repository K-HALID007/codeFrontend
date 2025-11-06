"use client";

import React, { useState, useEffect } from "react";
import { FiCopy, FiSave, FiCheck, FiX } from "react-icons/fi";
import dynamic from "next/dynamic";
import { io } from "socket.io-client";

const socket = io(
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000"
);

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-black text-gray-400">
      Loading editor...
    </div>
  ),
});

function CodeEditor({
  snippet,
  onUpdateSnippet,
  isEditMode,
  setIsEditMode,
  onSnippetDeleted,
}) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isUpdatingFromSocket, setIsUpdatingFromSocket] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    if (snippet) {
      setName(snippet.name || "");
      setCode(snippet.code || "");
    }
  }, [snippet]);

  // Listen for socket connection status
  useEffect(() => {
    const handleConnect = () => {
      console.log("✅ Socket connected");
      setSocketConnected(true);
    };

    const handleDisconnect = () => {
      console.log("❌ Socket disconnected");
      setSocketConnected(false);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    // Check initial connection state
    setSocketConnected(socket.connected);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  // Listen for real-time snippet updates
  useEffect(() => {
    if (!snippet) return;

    const handleSnippetUpdated = (updated) => {
      if (updated._id === snippet._id) {
        setIsUpdatingFromSocket(true);
        setName(updated.name);
        setCode(updated.code);
        console.log("🔁 Snippet updated by another user:", updated.name);
        setTimeout(() => setIsUpdatingFromSocket(false), 500);
      }
    };

    const handleSnippetDeleted = (deletedId) => {
      if (deletedId === snippet._id) {
        console.log("🗑️ Snippet deleted by another user");
        onSnippetDeleted(deletedId);
      }
    };

    socket.on("snippet-updated", handleSnippetUpdated);
    socket.on("snippet-deleted", handleSnippetDeleted);

    return () => {
      socket.off("snippet-updated", handleSnippetUpdated);
      socket.off("snippet-deleted", handleSnippetDeleted);
    };
  }, [snippet, onSnippetDeleted]);

  const handleSave = async () => {
    if (snippet) {
      const updated = { _id: snippet._id, name, code };
      await onUpdateSnippet(snippet._id, updated);
      socket.emit("update-snippet", updated);
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

  const handleCancel = () => {
    setName(snippet.name || "");
    setCode(snippet.code || "");
    setIsEditMode(false);
  };

  const detectLanguage = (name) => {
    const ext = name.split(".").pop().toLowerCase();
    const map = {
      js: "javascript",
      jsx: "javascript",
      ts: "typescript",
      html: "html",
      css: "css",
      py: "python",
      java: "java",
      cpp: "cpp",
      c: "c",
      json: "json",
      md: "markdown",
      php: "php",
      rb: "ruby",
      go: "go",
      swift: "swift",
      kt: "kotlin",
      sql: "sql",
      sh: "shell",
      xml: "xml",
      yaml: "yaml",
    };
    return map[ext] || "javascript";
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
      {/* Header */}
      <div className="border-b border-dark-border p-4 bg-dark-surface shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div>
            {isEditMode ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Snippet Name"
                className="text-2xl font-bold bg-transparent border-none 
                           text-gray-100 placeholder-gray-500 focus:outline-none"
              />
            ) : (
              <h1 className="text-2xl font-bold text-gray-100">{name}</h1>
            )}
          </div>

          {/* Socket Status Indicator */}
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                socketConnected ? "bg-green-500" : "bg-red-500"
              } animate-pulse`}
            ></div>
            <span
              className={`text-xs font-semibold ${
                socketConnected ? "text-green-400" : "text-red-400"
              }`}
            >
              {socketConnected ? "Live" : "Offline"}
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-500">
          Created on{" "}
          {snippet.createdAt
            ? new Date(snippet.createdAt).toLocaleDateString()
            : "Unknown"}
          {isUpdatingFromSocket && (
            <span className="ml-2 text-blue-400">● Syncing...</span>
          )}
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-dark-surface border-b border-dark-border shrink-0">
        <span className="text-xs text-gray-400 bg-dark-bg px-3 py-1 rounded-lg">
          {code.split("\n").length} lines • {code.length} chars
        </span>

        <div className="flex items-center gap-2">
          {isEditMode ? (
            <>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-1.5 text-sm border border-dark-border rounded-lg hover:bg-gray-600 transition-colors text-gray-300"
              >
                <FiX size={16} /> Cancel
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
          )}
        </div>
      </div>

      {/* Code Editor */}
      <div className="flex-1 overflow-hidden bg-black">
        <MonacoEditor
          height="100%"
          language={detectLanguage(name)}
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
            hover: { enabled: true },
            folding: true,
            quickSuggestions: false,
            suggestOnTriggerCharacters: false,
            wordBasedSuggestions: false,
            parameterHints: { enabled: false },
            formatOnType: false,
            formatOnPaste: false,
            renderValidationDecorations: "off",
            renderLineHighlight: isEditMode ? "all" : "none",
            cursorBlinking: isEditMode ? "blink" : "solid",
          }}
        />
      </div>
    </div>
  );
}

export default CodeEditor;
