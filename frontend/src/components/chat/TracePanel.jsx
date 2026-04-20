// src/components/chat/TracePanel.jsx
import { useState } from "react";
import {
  GitBranch,
  Database,
  Globe,
  MessageSquare,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Activity,
  X,
} from "lucide-react";

const NODE_CONFIG = {
  router: {
    icon: GitBranch,
    label: "Router",
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.1)",
    border: "rgba(167,139,250,0.22)",
  },
  rag_lookup: {
    icon: Database,
    label: "RAG Lookup",
    color: "#00c8b0",
    bg: "rgba(0,200,180,0.1)",
    border: "rgba(0,200,180,0.22)",
  },
  web_search: {
    icon: Globe,
    label: "Web Search",
    color: "#34d399",
    bg: "rgba(52,211,153,0.1)",
    border: "rgba(52,211,153,0.22)",
  },
  answer: {
    icon: MessageSquare,
    label: "Answer",
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.1)",
    border: "rgba(251,191,36,0.22)",
  },
  __end__: {
    icon: CheckCircle,
    label: "Complete",
    color: "#34d399",
    bg: "rgba(52,211,153,0.08)",
    border: "rgba(52,211,153,0.18)",
  },
};

function TraceStep({ event, isLast }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = NODE_CONFIG[event.node_name] || NODE_CONFIG["answer"];
  const Icon = cfg.icon;
  const hasDetails = event.details && Object.keys(event.details).length > 0;

  return (
    <div style={{ display: "flex", gap: "0.75rem" }}>
      {/* Timeline */}
      <div
        style={{
          width: "28px",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            zIndex: 1,
            background: cfg.bg,
            border: `1px solid ${cfg.border}`,
          }}
        >
          <Icon size={13} color={cfg.color} />
        </div>
        {!isLast && (
          <div
            style={{
              flex: 1,
              width: "1px",
              marginTop: "4px",
              minHeight: "16px",
              background: "rgba(0,200,180,0.12)",
            }}
          />
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, paddingBottom: "0.85rem", minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.3rem",
          }}
        >
          <span
            style={{ fontSize: "0.78rem", fontWeight: 700, color: cfg.color }}
          >
            {cfg.label}
          </span>
          <span
            style={{
              fontSize: "0.7rem",
              padding: "1px 7px",
              borderRadius: "6px",
              background: "rgba(0,200,180,0.07)",
              border: "1px solid rgba(0,200,180,0.12)",
              color: "rgba(180,220,215,0.4)",
            }}
          >
            Step {event.step}
          </span>
        </div>

        <p
          style={{
            fontSize: "0.8rem",
            lineHeight: 1.6,
            color: "rgba(180,220,215,0.55)",
            margin: "0 0 0.4rem",
          }}
        >
          {event.description}
        </p>

        {hasDetails && (
          <button
            onClick={() => setExpanded((e) => !e)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "0.75rem",
              color: "rgba(0,200,180,0.5)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              fontFamily: "inherit",
              transition: "opacity 0.15s",
            }}
          >
            {expanded ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
            {expanded ? "Hide details" : "Show details"}
          </button>
        )}

        {expanded && hasDetails && (
          <div
            style={{
              marginTop: "0.5rem",
              borderRadius: "8px",
              padding: "0.65rem 0.85rem",
              fontSize: "0.78rem",
              background: "rgba(0,0,0,0.3)",
              border: "1px solid rgba(0,200,180,0.12)",
            }}
          >
            {Object.entries(event.details).map(([key, val]) => (
              <div key={key} style={{ marginBottom: "0.4rem" }}>
                <span style={{ color: "rgba(0,200,180,0.55)" }}>
                  {key.replace(/_/g, " ")}:{" "}
                </span>
                <span style={{ color: "rgba(180,220,215,0.65)" }}>
                  {typeof val === "boolean"
                    ? val
                      ? "✓ Yes"
                      : "✗ No"
                    : String(val).length > 200
                      ? String(val).slice(0, 200) + "…"
                      : String(val)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function TracePanel({ traceEvents, onClose }) {
  if (!traceEvents || traceEvents.length === 0) return null;

  const usedWeb = traceEvents.some((e) => e.node_name === "web_search");
  const usedRag = traceEvents.some((e) => e.node_name === "rag_lookup");

  return (
    <div
      style={{
        borderRadius: "12px",
        overflow: "hidden",
        marginTop: "0.6rem",
        background: "rgba(5,15,15,0.85)",
        border: "1px solid rgba(0,200,180,0.15)",
        animation: "fadeUp 0.2s ease",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.65rem 1rem",
          borderBottom: "1px solid rgba(0,200,180,0.1)",
          background: "rgba(0,0,0,0.25)",
        }}
      >
        <Activity size={13} color="rgba(0,200,180,0.6)" />
        <span
          style={{
            fontWeight: 700,
            fontSize: "0.78rem",
            color: "rgba(180,220,215,0.7)",
          }}
        >
          Agent Trace
        </span>

        {/* Pills */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            marginLeft: "0.4rem",
          }}
        >
          {usedRag && (
            <span
              style={{
                fontSize: "0.7rem",
                padding: "2px 8px",
                borderRadius: "20px",
                background: "rgba(0,200,180,0.1)",
                color: "#00c8b0",
                border: "1px solid rgba(0,200,180,0.22)",
                fontWeight: 600,
              }}
            >
              RAG
            </span>
          )}
          {usedWeb && (
            <span
              style={{
                fontSize: "0.7rem",
                padding: "2px 8px",
                borderRadius: "20px",
                background: "rgba(52,211,153,0.1)",
                color: "#34d399",
                border: "1px solid rgba(52,211,153,0.22)",
                fontWeight: 600,
              }}
            >
              Web
            </span>
          )}
        </div>

        <span
          style={{
            marginLeft: "auto",
            fontSize: "0.75rem",
            color: "rgba(180,220,215,0.3)",
          }}
        >
          {traceEvents.length} steps
        </span>

        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "3px",
            display: "flex",
            alignItems: "center",
            marginLeft: "0.25rem",
            opacity: 0.5,
            transition: "opacity 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.5")}
        >
          <X size={13} color="#c8eae8" />
        </button>
      </div>

      {/* Steps */}
      <div style={{ padding: "1rem" }}>
        {traceEvents.map((event, i) => (
          <TraceStep
            key={i}
            event={event}
            index={i}
            isLast={i === traceEvents.length - 1}
          />
        ))}
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
