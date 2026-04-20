// src/components/chat/TypingIndicator.jsx
export default function TypingIndicator() {
  return (
    <div
      style={{
        display: "flex",
        gap: "0.75rem",
        padding: "0.75rem 1rem",
        alignItems: "flex-start",
        animation: "fadeUp 0.25s ease",
      }}
    >
      {/* Avatar */}
      <div style={{ flexShrink: 0, marginTop: "2px" }}>
        <div
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #00c8b0, #0096a0)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
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
      </div>

      {/* Content */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
        <span
          style={{
            fontSize: "0.8rem",
            fontWeight: 700,
            color: "#00c8b0",
            letterSpacing: "0.02em",
          }}
        >
          RAGmind
        </span>

        {/* Bubble with dots */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            padding: "0.65rem 0.9rem",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(0,200,180,0.12)",
            borderRadius: "4px 14px 14px 14px",
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "#00c8b0",
                animation: "typingBounce 1.2s ease-in-out infinite",
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
