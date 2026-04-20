// src/pages/RegisterPage.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "@/store/slices/authSlice";
import { Eye, EyeOff, AlertCircle, User, Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const password = watch("password", "");

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const onSubmit = async (data) => {
    const { confirmPassword, ...payload } = data;
    const result = await dispatch(registerUser(payload));
    if (!result.error) {
      toast.success("Account created!");
      navigate("/chat");
    }
  };

  const inputBox = (hasError) => ({
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    background: "rgba(0, 0, 0, 0.35)",
    border: `1.5px solid ${hasError ? "#e05c5c" : "rgba(0, 200, 180, 0.2)"}`,
    borderRadius: "10px",
    padding: "0.9rem 1.1rem",
    transition: "border-color 0.2s",
  });

  const inputStyle = {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#c8eae8",
    fontSize: "0.95rem",
    fontFamily: "inherit",
  };

  const labelStyle = {
    color: "rgba(180, 220, 215, 0.75)",
    fontSize: "0.9rem",
    fontWeight: 500,
  };

  const errorStyle = {
    color: "#e05c5c",
    fontSize: "0.82rem",
    margin: 0,
    display: "flex",
    alignItems: "center",
    gap: "0.3rem",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(ellipse at 50% 0%, #0a2a2a 0%, #071a1a 40%, #050f0f 100%)",
        padding: "2rem",
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
          width: "600px",
          height: "400px",
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(0,200,180,0.18) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Grid pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(0,200,180,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,180,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          pointerEvents: "none",
        }}
      />

      {/* Logo top-left */}
      <div
        style={{
          position: "absolute",
          top: "1.5rem",
          left: "2rem",
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #00c8b0, #0096a0)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="18"
            height="18"
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
            fontWeight: 600,
            fontSize: "1rem",
            letterSpacing: "0.02em",
          }}
        >
          RAGmind
        </span>
      </div>

      {/* Hero headline */}
      {/* <div
        style={{
          textAlign: "center",
          marginBottom: "2.5rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        <h1
          style={{
            fontSize: "clamp(2.2rem, 5vw, 3.2rem)",
            fontWeight: 700,
            color: "#c8eae8",
            lineHeight: 1.15,
            margin: 0,
            letterSpacing: "-0.01em",
          }}
        >
          Build with Confidence
        </h1>
        <h2
          style={{
            fontSize: "clamp(2rem, 4.5vw, 3rem)",
            fontWeight: 700,
            color: "#00c8b0",
            lineHeight: 1.15,
            margin: "0.3rem 0 0",
            letterSpacing: "-0.01em",
          }}
        >
          Deploy with Ease
        </h2>
      </div> */}

      {/* Register Card */}
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          background: "rgba(10, 26, 26, 0.92)",
          border: "1px solid rgba(0, 200, 180, 0.18)",
          borderRadius: "20px",
          padding: "2.8rem 2.8rem 2.4rem",
          position: "relative",
          zIndex: 1,
          boxShadow: "0 0 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,200,180,0.08)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2.2rem" }}>
          <h3
            style={{
              color: "#e0f7f5",
              fontSize: "1.6rem",
              fontWeight: 700,
              margin: 0,
              letterSpacing: "-0.01em",
            }}
          >
            Create Account
          </h3>
          <p
            style={{
              color: "rgba(180, 220, 215, 0.55)",
              fontSize: "0.95rem",
              margin: "0.5rem 0 0",
            }}
          >
            Start exploring your knowledge base
          </p>
        </div>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.3rem" }}
        >
          {/* Username */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <label style={labelStyle}>Username</label>
            <div style={inputBox(errors.username)}>
              <User size={18} color="rgba(0,200,180,0.55)" strokeWidth={2} />
              <input
                type="text"
                placeholder="yourname"
                style={inputStyle}
                {...register("username", {
                  required: "Username is required",
                  minLength: { value: 3, message: "Min 3 characters" },
                })}
              />
            </div>
            {errors.username && (
              <p style={errorStyle}>
                <AlertCircle size={13} /> {errors.username.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <label style={labelStyle}>Email address</label>
            <div style={inputBox(errors.email)}>
              <Mail size={18} color="rgba(0,200,180,0.55)" strokeWidth={2} />
              <input
                type="email"
                placeholder="you@example.com"
                style={inputStyle}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email",
                  },
                })}
              />
            </div>
            {errors.email && (
              <p style={errorStyle}>
                <AlertCircle size={13} /> {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <label style={labelStyle}>Password</label>
            <div style={inputBox(errors.password)}>
              <Lock size={18} color="rgba(0,200,180,0.55)" strokeWidth={2} />
              <input
                type={showPass ? "text" : "password"}
                placeholder="Min 6 characters"
                style={inputStyle}
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Min 6 characters" },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPass((p) => !p)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "2px",
                  color: "rgba(0,200,180,0.5)",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p style={errorStyle}>
                <AlertCircle size={13} /> {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <label style={labelStyle}>Confirm password</label>
            <div style={inputBox(errors.confirmPassword)}>
              <Lock size={18} color="rgba(0,200,180,0.55)" strokeWidth={2} />
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter password"
                style={inputStyle}
                {...register("confirmPassword", {
                  required: "Please confirm password",
                  validate: (v) => v === password || "Passwords do not match",
                })}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "2px",
                  color: "rgba(0,200,180,0.5)",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p style={errorStyle}>
                <AlertCircle size={13} /> {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit(onSubmit)}
            style={{
              marginTop: "0.4rem",
              width: "100%",
              padding: "1rem",
              borderRadius: "10px",
              border: "none",
              background: "linear-gradient(135deg, #00c8b0, #00a896)",
              color: "white",
              fontSize: "1.05rem",
              fontWeight: 700,
              letterSpacing: "0.05em",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.65 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              transition: "opacity 0.2s, transform 0.1s",
              fontFamily: "inherit",
            }}
          >
            {loading ? (
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  border: "2.5px solid rgba(255,255,255,0.3)",
                  borderTopColor: "white",
                  borderRadius: "50%",
                  animation: "spin 0.7s linear infinite",
                }}
              />
            ) : (
              "Create Account"
            )}
          </button>
        </div>
      </div>

      {/* Login link */}
      <p
        style={{
          textAlign: "center",
          marginTop: "1.6rem",
          color: "rgba(180, 220, 215, 0.5)",
          fontSize: "0.9rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        Already have an account?{" "}
        <Link
          to="/login"
          style={{ color: "#00c8b0", fontWeight: 600, textDecoration: "none" }}
        >
          Sign in
        </Link>
      </p>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
