// src/pages/ChatPage.jsx
import { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMessages,
  sendMessage,
  createSession,
  setActiveSession,
} from "@/store/slices/chatSlice";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatInput from "@/components/chat/ChatInput";
import TypingIndicator from "@/components/chat/TypingIndicator";
import EmptyState from "@/components/chat/EmptyState";
import toast from "react-hot-toast";
import { MessageSquare } from "lucide-react";

export default function ChatPage() {
  const dispatch = useDispatch();
  const bottomRef = useRef(null);

  const {
    activeSessionId,
    messages,
    sendingMessage,
    webSearchEnabled,
    sessions,
  } = useSelector((s) => s.chat);
  const currentMessages = activeSessionId
    ? messages[activeSessionId] || []
    : [];

  useEffect(() => {
    if (!activeSessionId && sessions.length > 0) {
      dispatch(setActiveSession(sessions[0].session_id));
    }
  }, [sessions, activeSessionId, dispatch]);

  useEffect(() => {
    if (activeSessionId) dispatch(fetchMessages(activeSessionId));
  }, [activeSessionId, dispatch]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages.length, sendingMessage]);

  const handleSend = useCallback(
    async (text) => {
      let sessionId = activeSessionId;
      if (!sessionId) {
        const result = await dispatch(createSession(text.slice(0, 40)));
        sessionId = result.payload.session_id;
        dispatch(setActiveSession(sessionId));
      }
      const result = await dispatch(
        sendMessage({ sessionId, message: text, webSearchEnabled }),
      );
      if (result.error) toast.error("Failed to get response. Try again.");
    },
    [activeSessionId, dispatch, webSearchEnabled],
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background:
          "radial-gradient(ellipse at 50% 0%, #0a2a2a 0%, #071a1a 40%, #050f0f 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Spotlight */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "700px",
          height: "320px",
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(0,200,180,0.13) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Grid pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(0,200,180,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,180,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Header */}
      <ChatHeader />

      {/* Chat area — lighter card */}
      <div
        style={{
          flex: 1,
          margin: "0 1.5rem 0 1.5rem",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(0,200,180,0.12)",
          borderRadius: "16px 16px 0 0",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Messages scroll area */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "1.5rem 1.5rem 1rem",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(0,200,180,0.2) transparent",
          }}
        >
          {currentMessages.length === 0 && !sendingMessage ? (
            <EmptyState onSuggestion={handleSend} />
          ) : (
            <>
              {currentMessages.map((msg, i) => (
                <ChatMessage
                  key={msg.id || i}
                  message={msg}
                  isNew={i === currentMessages.length - 1}
                />
              ))}
              {sendingMessage && <TypingIndicator />}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        {/* Input pinned at bottom of card */}
        <div
          style={{
            borderTop: "1px solid rgba(0,200,180,0.1)",
            padding: "1rem 1.5rem",
            background: "rgba(0,0,0,0.2)",
          }}
        >
          <ChatInput onSend={handleSend} disabled={sendingMessage} />
        </div>
      </div>

      {/* Bottom gap so card doesn't touch edge */}
      <div style={{ height: "1.5rem", position: "relative", zIndex: 1 }} />
    </div>
  );
}

function ChatHeader() {
  const { sessions, activeSessionId } = useSelector((s) => s.chat);
  const activeSession = sessions.find((s) => s.session_id === activeSessionId);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        padding: "1.1rem 2rem",
        borderBottom: "1px solid rgba(0,200,180,0.12)",
        background: "rgba(0,0,0,0.25)",
        backdropFilter: "blur(8px)",
        position: "relative",
        zIndex: 2,
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.55rem",
          marginRight: "0.5rem",
        }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #00c8b0, #0096a0)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg
            width="16"
            height="16"
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
        <span
          style={{
            color: "#e0f7f5",
            fontWeight: 700,
            fontSize: "1rem",
            letterSpacing: "0.02em",
          }}
        >
          RAG<span style={{ color: "#00c8b0" }}>mind</span>
        </span>
      </div>

      {/* Divider */}
      <div
        style={{
          width: "1px",
          height: "20px",
          background: "rgba(0,200,180,0.25)",
        }}
      />

      {/* Session title */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <MessageSquare size={15} color="rgba(0,200,180,0.7)" strokeWidth={2} />
        <h2
          style={{
            fontWeight: 600,
            fontSize: "0.95rem",
            color: "#c8eae8",
            margin: 0,
            letterSpacing: "0.01em",
          }}
        >
          {activeSession?.title || "New Chat"}
        </h2>
      </div>
    </div>
  );
}
