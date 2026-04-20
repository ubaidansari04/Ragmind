// src/App.jsx
import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "@/store/slices/authSlice";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ChatPage from "@/pages/ChatPage";
import UploadPage from "@/pages/UploadPage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";

export default function App() {
  const dispatch = useDispatch();
  const { token, initialized, guestMode } = useSelector((s) => s.auth);

  useEffect(() => {
    if (token) dispatch(fetchCurrentUser());
  }, [token, dispatch]);

  // Token hai aur initialize nahi hua — loading spinner dikhao
  if (token && !initialized) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(ellipse at 50% 0%, #0a2a2a 0%, #071a1a 40%, #050f0f 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              border: "2.5px solid rgba(0,200,180,0.2)",
              borderTopColor: "#00c8b0",
              borderRadius: "50%",
              animation: "spin 0.7s linear infinite",
            }}
          />
          <p style={{ color: "rgba(180,220,215,0.4)", fontSize: "0.875rem" }}>
            Initializing...
          </p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const isAuthed = token || guestMode;

  return (
    <Routes>
      <Route
        path="/login"
        element={!isAuthed ? <LoginPage /> : <Navigate to="/chat" replace />}
      />
      <Route
        path="/register"
        element={!isAuthed ? <RegisterPage /> : <Navigate to="/chat" replace />}
      />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/upload" element={<UploadPage />} />
        </Route>
      </Route>
      <Route
        path="*"
        element={<Navigate to={isAuthed ? "/chat" : "/login"} replace />}
      />
    </Routes>
  );
}
