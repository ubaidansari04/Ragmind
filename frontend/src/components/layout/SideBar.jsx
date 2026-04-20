// src/components/layout/Sidebar.jsx
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  MessageSquare,
  Plus,
  Trash2,
  Upload,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Globe,
  GlobeLock,
} from "lucide-react";
import {
  fetchSessions,
  createSession,
  deleteSession,
  setActiveSession,
  toggleWebSearch,
} from "@/store/slices/chatSlice";
import { logout } from "@/store/slices/authSlice";
import toast from "react-hot-toast";

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const { sessions, activeSessionId, webSearchEnabled } = useSelector(
    (s) => s.chat,
  );
  const { user } = useSelector((s) => s.auth);

  useEffect(() => {
    dispatch(fetchSessions());
  }, [dispatch]);

  const handleNewChat = async () => {
    const result = await dispatch(createSession("New Chat"));
    if (!result.error) {
      dispatch(setActiveSession(result.payload.session_id));
      navigate("/chat");
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    setDeletingId(id);
    const result = await dispatch(deleteSession(id));
    setDeletingId(null);
    if (!result.error) toast.success("Chat deleted");
    else toast.error("Failed to delete");
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    toast.success("Signed out");
  };

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "U";

  return (
    <aside
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: collapsed ? "64px" : "260px",
        transition: "width 0.3s ease",
        flexShrink: 0,
        background: "linear-gradient(180deg, #071e1e 0%, #050f0f 100%)",
        borderRight: "1px solid rgba(0,200,180,0.13)",
        overflow: "hidden",
      }}
    >
      {/* Subtle top glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "180px",
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(0,200,180,0.1) 0%, transparent 70%)",
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
          backgroundSize: "40px 40px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        style={{
          position: "absolute",
          right: "-12px",
          top: "68px",
          zIndex: 10,
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a2a2a",
          border: "1px solid rgba(0,200,180,0.3)",
          cursor: "pointer",
          transition: "transform 0.2s",
        }}
      >
        {collapsed ? (
          <ChevronRight size={12} color="rgba(0,200,180,0.8)" />
        ) : (
          <ChevronLeft size={12} color="rgba(0,200,180,0.8)" />
        )}
      </button>

      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.65rem",
          padding: collapsed ? "1.25rem 0" : "1.25rem 1rem",
          borderBottom: "1px solid rgba(0,200,180,0.12)",
          justifyContent: collapsed ? "center" : "flex-start",
          position: "relative",
          zIndex: 1,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: "34px",
            height: "34px",
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
        {!collapsed && (
          <span
            style={{
              fontWeight: 700,
              fontSize: "1.05rem",
              color: "#e0f7f5",
              whiteSpace: "nowrap",
              letterSpacing: "0.02em",
            }}
          >
            RAG<span style={{ color: "#00c8b0" }}>mind</span>
          </span>
        )}
      </div>

      {/* New Chat button */}
      <div
        style={{
          padding: collapsed ? "0.75rem 0.5rem" : "0.75rem",
          position: "relative",
          zIndex: 1,
          flexShrink: 0,
        }}
      >
        <button
          onClick={handleNewChat}
          style={{
            width: "100%",
            borderRadius: "10px",
            padding: collapsed ? "0.6rem 0" : "0.6rem 1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            justifyContent: collapsed ? "center" : "flex-start",
            background: "linear-gradient(135deg, #00c8b0, #00a896)",
            border: "none",
            cursor: "pointer",
            transition: "opacity 0.2s, transform 0.1s",
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          <Plus size={16} color="white" strokeWidth={2.5} />
          {!collapsed && (
            <span
              style={{
                color: "white",
                fontWeight: 700,
                fontSize: "0.875rem",
                letterSpacing: "0.03em",
              }}
            >
              New Chat
            </span>
          )}
        </button>
      </div>

      {/* Sessions list */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: collapsed ? "0 0.4rem" : "0 0.6rem",
          position: "relative",
          zIndex: 1,
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(0,200,180,0.15) transparent",
        }}
      >
        {!collapsed && sessions.length > 0 && (
          <p
            style={{
              padding: "0 0.5rem",
              marginBottom: "0.4rem",
              fontSize: "0.7rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "rgba(0,200,180,0.4)",
              fontWeight: 600,
            }}
          >
            Recents
          </p>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {sessions.map((session) => {
            const isActive = session.session_id === activeSessionId;
            return (
              <div
                key={session.session_id}
                onClick={() => {
                  dispatch(setActiveSession(session.session_id));
                  navigate("/chat");
                }}
                style={{
                  borderRadius: "9px",
                  padding: collapsed ? "0.6rem 0" : "0.55rem 0.75rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.55rem",
                  justifyContent: collapsed ? "center" : "flex-start",
                  background: isActive ? "rgba(0,200,180,0.1)" : "transparent",
                  border: `1px solid ${isActive ? "rgba(0,200,180,0.25)" : "transparent"}`,
                  transition: "background 0.15s, border-color 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (!isActive)
                    e.currentTarget.style.background = "rgba(0,200,180,0.05)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    e.currentTarget.style.background = "transparent";
                }}
              >
                <MessageSquare
                  size={14}
                  color={isActive ? "#00c8b0" : "rgba(180,220,215,0.4)"}
                  style={{ flexShrink: 0 }}
                />
                {!collapsed && (
                  <>
                    <span
                      style={{
                        flex: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontSize: "0.85rem",
                        color: isActive ? "#c8eae8" : "rgba(180,220,215,0.55)",
                      }}
                    >
                      {session.title}
                    </span>
                    <button
                      onClick={(e) => handleDelete(e, session.session_id)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "3px",
                        display: "flex",
                        alignItems: "center",
                        opacity: 0.6,
                        transition: "opacity 0.15s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.opacity = "1")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.opacity = "0.6")
                      }
                    >
                      {deletingId === session.session_id ? (
                        <Loader2
                          size={12}
                          color="#e05c5c"
                          style={{ animation: "spin 0.7s linear infinite" }}
                        />
                      ) : (
                        <Trash2 size={12} color="#e05c5c" />
                      )}
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom section */}
      <div
        style={{
          padding: collapsed ? "0.75rem 0.4rem" : "0.75rem",
          borderTop: "1px solid rgba(0,200,180,0.12)",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          position: "relative",
          zIndex: 1,
          flexShrink: 0,
        }}
      >
        {/* Web search toggle */}
        <button
          onClick={() => dispatch(toggleWebSearch())}
          title={webSearchEnabled ? "Web search ON" : "Web search OFF"}
          style={{
            width: "100%",
            borderRadius: "9px",
            padding: collapsed ? "0.6rem 0" : "0.6rem 0.75rem",
            display: "flex",
            alignItems: "center",
            gap: "0.55rem",
            justifyContent: collapsed ? "center" : "flex-start",
            background: webSearchEnabled
              ? "rgba(52,211,153,0.08)"
              : "rgba(255,255,255,0.03)",
            border: `1px solid ${webSearchEnabled ? "rgba(52,211,153,0.25)" : "rgba(0,200,180,0.1)"}`,
            cursor: "pointer",
            transition: "all 0.2s",
            fontFamily: "inherit",
          }}
        >
          {webSearchEnabled ? (
            <Globe size={14} color="#34d399" style={{ flexShrink: 0 }} />
          ) : (
            <GlobeLock
              size={14}
              color="rgba(180,220,215,0.4)"
              style={{ flexShrink: 0 }}
            />
          )}
          {!collapsed && (
            <span
              style={{
                fontSize: "0.8rem",
                fontWeight: 600,
                color: webSearchEnabled ? "#34d399" : "rgba(180,220,215,0.45)",
              }}
            >
              Web Search {webSearchEnabled ? "ON" : "OFF"}
            </span>
          )}
        </button>

        {/* Upload nav */}
        <NavLink
          to="/upload"
          style={({ isActive }) => ({
            width: "100%",
            borderRadius: "9px",
            padding: collapsed ? "0.6rem 0" : "0.6rem 0.75rem",
            display: "flex",
            alignItems: "center",
            gap: "0.55rem",
            justifyContent: collapsed ? "center" : "flex-start",
            background: isActive ? "rgba(0,200,180,0.1)" : "transparent",
            border: `1px solid ${isActive ? "rgba(0,200,180,0.25)" : "transparent"}`,
            textDecoration: "none",
            transition: "all 0.15s",
          })}
        >
          <Upload
            size={14}
            color="rgba(180,220,215,0.5)"
            style={{ flexShrink: 0 }}
          />
          {!collapsed && (
            <span
              style={{ fontSize: "0.85rem", color: "rgba(180,220,215,0.55)" }}
            >
              Upload Docs
            </span>
          )}
        </NavLink>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            background: "rgba(0,200,180,0.1)",
            margin: "4px 0",
          }}
        />

        {/* User + Logout */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0 0.1rem",
          }}
        >
          {!collapsed && (
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                gap: "0.55rem",
                minWidth: 0,
              }}
            >
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #00c8b0, #0096a0)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "white",
                  flexShrink: 0,
                  letterSpacing: "0.05em",
                }}
              >
                {initials}
              </div>
              <span
                style={{
                  fontSize: "0.85rem",
                  color: "rgba(180,220,215,0.6)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user?.username || "User"}
              </span>
            </div>
          )}
          <button
            onClick={handleLogout}
            title="Sign out"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "8px",
              transition: "background 0.15s",
              marginLeft: collapsed ? "auto" : 0,
              marginRight: collapsed ? "auto" : 0,
              width: collapsed ? "100%" : "auto",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(224,92,92,0.1)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
          >
            <LogOut size={14} color="rgba(180,220,215,0.4)" />
          </button>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </aside>
  );
}
