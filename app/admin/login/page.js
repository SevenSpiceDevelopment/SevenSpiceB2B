"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, Mail, AlertCircle, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  // States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/admin/dashboard");
    }
  }, [status, router]);

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
        // Hard navigation to ensure middleware picks up the fresh session cookie
        window.location.href = "/admin/dashboard";
      }
    } catch (err) {
      setError("An unexpected authentication error occurred.");
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-on-surface-variant font-mono text-sm">
        <Loader2 className="animate-spin text-primary w-8 h-8 mb-2" />
        Checking Session Authorization...
      </div>
    );
  }

  if (status === "authenticated") {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-on-surface-variant font-mono text-sm">
        <Loader2 className="animate-spin text-primary w-8 h-8 mb-2" />
        Access Granted — Redirecting to Dashboard...
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-surface border border-on-surface/10 rounded-lg p-8 shadow-[0_20px_40px_rgba(26,26,26,0.05)] relative overflow-hidden animate-fadeIn">
      {/* Background radial pattern */}
      <div className="absolute inset-0 bg-subtle-pattern pointer-events-none opacity-50"></div>

      <div className="relative z-10 text-center mb-8">
        <div className="inline-flex p-3 bg-primary/5 rounded-full border border-primary/10 text-primary mb-3">
          <Lock size={24} />
        </div>
        <h2 className="font-headline-md-mobile text-primary font-bold">Admin Portal Login</h2>
        <p className="text-xs text-on-surface-variant mt-1 font-mono uppercase tracking-wider">
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
          <label className="font-label-md text-xs text-on-surface-variant mb-1 flex items-center gap-1.5" htmlFor="login-password">
            <Lock size={12} className="text-secondary" /> Access Password
          </label>
          <input
            id="login-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-primary px-0 py-2 font-body-md text-on-surface placeholder:text-on-surface/30 transition-colors"
          />
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
