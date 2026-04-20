// src/components/chat/EmptyState.jsx
import { BookOpen, Globe, Search } from "lucide-react";

const suggestions = [
  {
    icon: BookOpen,
    label: "Summarize my documents",
    color: "#00c8b0",
  },
  {
    icon: Search,
    label: "What are the key findings in my KB?",
    color: "#a78bfa",
  },
  {
    icon: Globe,
    label: "Latest AI research news",
    color: "#34d399",
  },
];

export default function EmptyState({ onSuggestion }) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 2rem 3rem",
        animation: "fadeUp 0.3s ease",
      }}
    >
      {/* Logo icon */}
      <div
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #00c8b0, #0096a0)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1.5rem",
          boxShadow: "0 0 32px rgba(0,200,180,0.2)",
        }}
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
        >
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      </div>

      <h2
        style={{
          fontWeight: 800,
          fontSize: "1.6rem",
          color: "#e0f7f5",
          marginBottom: "0.5rem",
          textAlign: "center",
          letterSpacing: "-0.01em",
        }}
      >
        What can I help you with?
      </h2>
      <p
        style={{
          color: "rgba(180,220,215,0.45)",
          fontSize: "0.9rem",
          textAlign: "center",
          maxWidth: "360px",
          lineHeight: 1.65,
          margin: 0,
        }}
      >
        Ask questions from your knowledge base, search the web, or upload
        documents to get started.
      </p>

      {/* Suggestion buttons */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.6rem",
          marginTop: "2rem",
          width: "100%",
          maxWidth: "420px",
        }}
      >
        {suggestions.map(({ icon: Icon, label, color }) => (
          <button
            key={label}
            onClick={() => onSuggestion(label)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.85rem 1.1rem",
              borderRadius: "12px",
              textAlign: "left",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(0,200,180,0.14)",
              cursor: "pointer",
              transition: "all 0.15s",
              fontFamily: "inherit",
              width: "100%",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(0,200,180,0.07)";
              e.currentTarget.style.borderColor = "rgba(0,200,180,0.28)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.03)";
              e.currentTarget.style.borderColor = "rgba(0,200,180,0.14)";
            }}
          >
            <Icon size={16} color={color} style={{ flexShrink: 0 }} />
            <span
              style={{ fontSize: "0.875rem", color: "rgba(180,220,215,0.65)" }}
            >
              {label}
            </span>
          </button>
        ))}
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
