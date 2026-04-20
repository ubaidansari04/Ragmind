// src/components/chat/ChatMessage.jsx
import { useState } from "react";
import { useSelector } from "react-redux";
import ReactMarkdown from "react-markdown";
import { User, Activity } from "lucide-react";
import TracePanel from "./TracePanel";

export default function ChatMessage({ message, isNew }) {
  const isAssistant = message.role === "assistant";
  const [showTrace, setShowTrace] = useState(false);

  const traces = useSelector((s) => s.chat.traces);
  const traceEvents = isAssistant ? traces[message.id] || [] : [];
  const hasTrace = traceEvents.length > 0;

  return (
    <div
      style={{
        padding: "0.75rem 1rem",
        animation: isNew ? "fadeUp 0.25s ease" : "none",
      }}
    >
      <div
        style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}
      >
        {/* Avatar */}
        <div style={{ flexShrink: 0, marginTop: "2px" }}>
          {isAssistant ? (
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #00c8b0, #0096a0)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg
                width="14"
                height="14"
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
          ) : (
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "rgba(0,200,180,0.1)",
                border: "1px solid rgba(0,200,180,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <User size={13} color="rgba(0,200,180,0.7)" />
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Name + time + trace button */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.35rem",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: "1.2rem",
                fontWeight: 750,
                color: isAssistant ? "#00c8b0" : "rgba(180,220,215,0.6)",
                letterSpacing: "0.1em",
              }}
            >
              {isAssistant ? "RAGmind" : "You"}
            </span>
            <span
              style={{ fontSize: "0.80rem", color: "rgba(180,220,215,0.3)" }}
            >
              {new Date(message.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>

            {hasTrace && (
              <button
                onClick={() => setShowTrace((v) => !v)}
                style={{
                  marginLeft: "auto",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "3px 10px",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  background: showTrace
                    ? "rgba(0,200,180,0.12)"
                    : "rgba(0,200,180,0.05)",
                  border: `1px solid ${showTrace ? "rgba(0,200,180,0.35)" : "rgba(0,200,180,0.15)"}`,
                  color: showTrace ? "#00c8b0" : "rgba(180,220,215,0.4)",
                  fontFamily: "inherit",
                }}
              >
                <Activity size={11} />
                {showTrace ? "Hide trace" : "View trace"}
              </button>
            )}
          </div>

          {/* Message bubble */}
          <div
            style={{
              background: isAssistant
                ? "rgba(255,255,255,0.03)"
                : "rgba(0,200,180,0.07)",
              border: `1px solid ${isAssistant ? "rgba(0,200,180,0.1)" : "rgba(0,200,180,0.18)"}`,
              borderRadius: isAssistant
                ? "4px 14px 14px 14px"
                : "14px 4px 14px 14px",
              padding: "0.75rem 1rem",
              fontSize: "1rem",
              lineHeight: 1.9,
              color: "#c8eae8",
            }}
          >
            {isAssistant ? (
              <div className="prose-chat">
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            ) : (
              <p style={{ whiteSpace: "pre-wrap", margin: 0 }}>
                {message.content}
              </p>
            )}
          </div>

          {/* Trace panel */}
          {showTrace && hasTrace && (
            <TracePanel
              traceEvents={traceEvents}
              onClose={() => setShowTrace(false)}
            />
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .prose-chat p { margin: 0 0 0.5rem; }
        .prose-chat p:last-child { margin-bottom: 0; }
        .prose-chat pre {
          background: rgba(0,0,0,0.4);
          border: 1px solid rgba(0,200,180,0.15);
          border-radius: 8px;
          padding: 0.75rem 1rem;
          overflow-x: auto;
          font-size: 0.82rem;
        }
        .prose-chat code {
          background: rgba(0,200,180,0.1);
          border-radius: 4px;
          padding: 1px 5px;
          font-size: 0.85em;
          color: #00c8b0;
        }
        .prose-chat pre code {
          background: transparent;
          padding: 0;
          color: #c8eae8;
        }
        .prose-chat ul, .prose-chat ol {
          padding-left: 1.25rem;
          margin: 0.4rem 0;
        }
        .prose-chat li { margin: 0.2rem 0; }
        .prose-chat strong { color: #e0f7f5; font-weight: 600; }
        .prose-chat a { color: #00c8b0; }
        .prose-chat h1, .prose-chat h2, .prose-chat h3 {
          color: #e0f7f5;
          font-weight: 700;
          margin: 0.75rem 0 0.4rem;
        }
        .prose-chat blockquote {
          border-left: 3px solid rgba(0,200,180,0.4);
          margin: 0.5rem 0;
          padding-left: 0.75rem;
          color: rgba(180,220,215,0.6);
        }
      `}</style>
    </div>
  );
}
