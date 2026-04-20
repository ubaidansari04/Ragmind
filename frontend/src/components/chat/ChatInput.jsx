import { useState, useRef, useCallback } from "react";
import { Send, Globe, GlobeLock } from "lucide-react";
import { useSelector } from "react-redux";

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);
  const { webSearchEnabled } = useSelector((s) => s.chat);

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [value, disabled, onSend]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChange = (e) => {
    setValue(e.target.value);
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
    }
  };

  const hasValue = value.trim() && !disabled;

  return (
    <div>
      {/* Input box */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "0.75rem",
          background: "rgba(0,0,0,0.35)",
          border: `1.5px solid ${hasValue ? "rgba(0,200,180,0.4)" : "rgba(0,200,180,0.15)"}`,
          borderRadius: "14px",
          padding: "0.75rem 1rem",
          transition: "border-color 0.2s",
        }}
      >
        {/* Web search indicator */}
        <div
          style={{ flexShrink: 0, marginBottom: "5.5px" }}
          title={
            webSearchEnabled ? "Web search enabled" : "Web search disabled"
          }
        >
          {webSearchEnabled ? (
            <Globe size={18} color="#34d399" />
          ) : (
            <GlobeLock size={18} color="rgba(180,220,215,0.3)" />
          )}
        </div>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Ask anything..."
          rows={1}
          style={{
            flex: 1,
            outline: "none",
            background: "transparent",
            resize: "none",
            border: "none",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "#c8eae8",
            fontFamily: "inherit",
            maxHeight: "200px",
            overflowY: "auto",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(0,200,180,0.15) transparent",
          }}
        />

        {/* Send button */}
        <button
          onClick={handleSubmit}
          disabled={!value.trim() || disabled}
          style={{
            flexShrink: 0,
            width: "34px",
            height: "34px",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1px",
            border: "none",
            cursor: hasValue ? "pointer" : "not-allowed",
            background: hasValue
              ? "linear-gradient(135deg, #00c8b0, #00a896)"
              : "rgba(0,200,180,0.08)",
            opacity: !value.trim() || disabled ? 0.45 : 1,
            transition: "all 0.15s",
          }}
        >
          {disabled ? (
            <div
              style={{
                width: "14px",
                height: "14px",
                border: "2px solid rgba(255,255,255,0.3)",
                borderTopColor: "white",
                borderRadius: "50%",
                animation: "spin 0.7s linear infinite",
              }}
            />
          ) : (
            <Send size={14} color="white" strokeWidth={2.5} />
          )}
        </button>
      </div>

      {/* Hint */}
      <p
        style={{
          textAlign: "center",
          marginTop: "0.5rem",
          fontSize: "0.95rem",
          color: "rgba(180,220,215,0.3)",
        }}
      >
        Press{" "}
        <kbd
          style={{
            padding: "1px 5px",
            borderRadius: "5px",
            fontSize: "1rem",
            background: "rgba(0,200,180,0.08)",
            border: "1px solid rgba(0,200,180,0.15)",
            color: "rgba(180,220,215,0.5)",
          }}
        >
          Enter
        </kbd>{" "}
        to send ·{" "}
        <kbd
          style={{
            padding: "1px 5px",
            borderRadius: "5px",
            fontSize: "1rem",
            background: "rgba(0,200,180,0.08)",
            border: "1px solid rgba(0,200,180,0.15)",
            color: "rgba(180,220,215,0.5)",
          }}
        >
          Shift+Enter
        </kbd>{" "}
        for newline
      </p>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
