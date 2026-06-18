"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, Mail, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";
import { forgotPasswordAction } from "@/app/actions";

export default function AdminLoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  // States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Phase 2: UI States
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (status === "authenticated") {
      window.location.href = "/admin/dashboard";
    }
  }, [status]);

  // Load remembered email on mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("admin_remember_email");
    const rememberMeState = localStorage.getItem("admin_remember_me");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
    }
    if (rememberMeState === "false") {
      setRememberMe(false);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please fill in both email and password.");
      setLoading(false);
      return;
    }

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false
      });

      if (res?.error) {
        setError("Invalid administrative credentials. Please try again.");
        setLoading(false);
      } else {
        // Save or clear remembered email
        if (rememberMe) {
          localStorage.setItem("admin_remember_email", email);
          localStorage.setItem("admin_remember_me", "true");
        } else {
          localStorage.removeItem("admin_remember_email");
          localStorage.setItem("admin_remember_me", "false");
        }

        // Hard navigation to ensure middleware picks up the fresh session cookie
        window.location.href = "/admin/dashboard";
      }
    } catch (err) {
      setError("An unexpected authentication error occurred.");
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotError("");
    setForgotSuccess("");
    setForgotLoading(true);

    if (!forgotEmail) {
      setForgotError("Please fill in your email address.");
      setForgotLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("email", forgotEmail);
      const res = await forgotPasswordAction(null, formData);

      if (res?.success) {
        setForgotSuccess(res.message);
      } else {
        setForgotError(res?.error || "Failed to trigger recovery log.");
      }
    } catch (err) {
      setForgotError("An unexpected error occurred during password recovery.");
    } finally {
      setForgotLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-on-surface-variant font-semibold text-sm">
        <Loader2 className="animate-spin text-primary w-8 h-8 mb-2" />
        Checking Session Authorization...
      </div>
    );
  }

  if (status === "authenticated") {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-on-surface-variant font-semibold text-sm">
        <Loader2 className="animate-spin text-primary w-8 h-8 mb-2" />
        Access Granted — Redirecting to Dashboard...
      </div>
    );
  }

  // Render Forgot Password Form
  if (isForgotMode) {
    return (
      <div className="w-full max-w-md bg-surface border border-on-surface/10 rounded-lg p-8 shadow-[0_20px_40px_rgba(26,26,26,0.05)] relative overflow-hidden animate-fadeIn">
        {/* Background radial pattern */}
        <div className="absolute inset-0 bg-subtle-pattern pointer-events-none opacity-50"></div>

        <div className="relative z-10 text-center mb-8">
          <div className="inline-flex p-3 bg-primary/5 rounded-full border border-primary/10 text-primary mb-3">
            <Mail size={24} />
          </div>
          <h2 className="font-headline-md-mobile text-primary font-bold">Recover Admin Password</h2>
          <p className="text-xs text-on-surface-variant mt-1 font-semibold uppercase tracking-wider">
            Password Reset Request
          </p>
        </div>

        {forgotError && (
          <div className="relative z-10 bg-error-container border border-error/20 text-on-error-container p-4 rounded mb-6 flex items-start gap-3 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 text-error mt-0.5" />
            <span>{forgotError}</span>
          </div>
        )}

        {forgotSuccess && (
          <div className="relative z-10 bg-secondary/10 border border-secondary/20 text-primary p-4 rounded mb-6 flex items-start gap-3 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 text-secondary mt-0.5" />
            <span>{forgotSuccess}</span>
          </div>
        )}

        <form onSubmit={handleForgotSubmit} className="relative z-10 space-y-6">
          {/* Email */}
          <div className="flex flex-col">
            <label className="font-label-md text-xs text-on-surface-variant mb-1 flex items-center gap-1.5" htmlFor="forgot-email">
              <Mail size={12} className="text-secondary" /> Email Address
            </label>
            <input
              id="forgot-email"
              type="email"
              placeholder="admin@thesevenspice.com"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              required
              disabled={forgotLoading}
              className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-primary px-0 py-2 font-body-md text-on-surface placeholder:text-on-surface/30 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={forgotLoading}
            className="w-full bg-primary text-on-primary font-label-md text-sm py-3.5 rounded hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:bg-primary/70 disabled:cursor-not-allowed shadow-sm"
          >
            {forgotLoading ? (
              <>
                Sending instructions...
                <Loader2 className="animate-spin w-4 h-4" />
              </>
            ) : (
              "Send Recovery Log"
            )}
          </button>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => {
                setIsForgotMode(false);
                setForgotError("");
                setForgotSuccess("");
              }}
              className="text-xs text-secondary hover:text-primary transition-colors font-semibold uppercase tracking-wider"
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Render standard Login Form
  return (
    <div className="w-full max-w-md bg-surface border border-on-surface/10 rounded-lg p-8 shadow-[0_20px_40px_rgba(26,26,26,0.05)] relative overflow-hidden animate-fadeIn">
      {/* Background radial pattern */}
      <div className="absolute inset-0 bg-subtle-pattern pointer-events-none opacity-50"></div>

      <div className="relative z-10 text-center mb-8">
        <div className="inline-flex p-3 bg-primary/5 rounded-full border border-primary/10 text-primary mb-3">
          <Lock size={24} />
        </div>
        <h2 className="font-headline-md-mobile text-primary font-bold">Admin Portal Login</h2>
        <p className="text-xs text-on-surface-variant mt-1 font-semibold uppercase tracking-wider">
          TheSevenSpice Logistics Control
        </p>
      </div>

      {error && (
        <div className="relative z-10 bg-error-container border border-error/20 text-on-error-container p-4 rounded mb-6 flex items-start gap-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-error mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
        {/* Email */}
        <div className="flex flex-col">
          <label className="font-label-md text-xs text-on-surface-variant mb-1 flex items-center gap-1.5" htmlFor="login-email">
            <Mail size={12} className="text-secondary" /> Email Address
          </label>
          <input
            id="login-email"
            type="email"
            placeholder="admin@thesevenspice.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-primary px-0 py-2 font-body-md text-on-surface placeholder:text-on-surface/30 transition-colors"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-1">
            <label className="font-label-md text-xs text-on-surface-variant flex items-center gap-1.5" htmlFor="login-password">
              <Lock size={12} className="text-secondary" /> Access Password
            </label>
            <button
              type="button"
              onClick={() => {
                setIsForgotMode(true);
                setForgotEmail(email);
              }}
              className="text-xs text-secondary hover:text-primary transition-colors font-medium"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative flex items-center">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-primary px-0 py-2 font-body-md text-on-surface placeholder:text-on-surface/30 transition-colors w-full pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 bottom-2 text-on-surface-variant/70 hover:text-primary transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Remember Me */}
        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={loading}
            className="h-4 w-4 rounded border-on-surface/20 text-primary focus:ring-primary bg-transparent transition-colors cursor-pointer"
          />
          <label htmlFor="remember-me" className="ml-2 font-label-md text-xs text-on-surface-variant cursor-pointer select-none">
            Remember me
          </label>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-on-primary font-label-md text-sm py-3.5 rounded hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:bg-primary/70 disabled:cursor-not-allowed shadow-sm mt-8"
        >
          {loading ? (
            <>
              Authenticating...
              <Loader2 className="animate-spin w-4 h-4" />
            </>
          ) : (
            "Grant Access Profile"
          )}
        </button>
      </form>
    </div>
  );
}
