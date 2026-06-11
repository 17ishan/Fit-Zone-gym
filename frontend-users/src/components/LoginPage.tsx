import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dumbbell } from "lucide-react";
import { useAuth } from "@/auth/AuthContext";
import { renderGoogleButton } from "@/lib/google";
import PasswordInput from "./PasswordInput";

type Mode = "signin" | "register" | "forgot";

const inputClass =
  "w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 text-white placeholder-zinc-500 outline-none transition focus:border-[#FF0000]/60 focus:ring-1 focus:ring-[#FF0000]/40";

export default function LoginPage() {
  const { user, loading, loginWithGoogle, login, register, forgotPassword } = useAuth();
  const navigate = useNavigate();
  const googleRef = useRef<HTMLDivElement>(null);

  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Redirect away once authenticated.
  useEffect(() => {
    if (!loading && user) navigate("/dashboard", { replace: true });
  }, [user, loading, navigate]);

  // Render the Google button (sign-in / register modes only).
  useEffect(() => {
    if (mode === "forgot") return;
    const el = googleRef.current;
    if (!el) return;
    el.innerHTML = "";
    renderGoogleButton(el, async (idToken) => {
      setError(null);
      try {
        await loginWithGoogle(idToken);
        navigate("/dashboard", { replace: true });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Google sign-in failed");
      }
    }).catch((e) => setError(e instanceof Error ? e.message : "Google sign-in unavailable"));
  }, [mode, loginWithGoogle, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);
    try {
      if (mode === "signin") {
        await login(identifier, password);
        navigate("/dashboard", { replace: true });
      } else if (mode === "register") {
        await register(name, email, password);
        navigate("/dashboard", { replace: true });
      } else {
        const msg = await forgotPassword(email);
        setInfo(msg);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
    setInfo(null);
    setPassword("");
  }

  const title = mode === "register" ? "Create your account" : mode === "forgot" ? "Reset your password" : "Welcome back";
  const subtitle =
    mode === "register"
      ? "Join FitZone to manage your membership."
      : mode === "forgot"
        ? "Enter your email and we'll send you a reset link."
        : "Sign in to your FitZone account.";

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4 font-serif">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900/80 p-8 shadow-xl">
        <button onClick={() => navigate("/")} className="mb-6 flex items-center justify-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF0000] text-white">
            <Dumbbell className="h-5 w-5" />
          </span>
          <span className="text-2xl font-bold text-[#FFFADC]">
            Fit<span className="text-[#FF0000]">Zone</span>
          </span>
        </button>

        <h1 className="text-center text-xl font-semibold text-white">{title}</h1>
        <p className="mt-1 text-center text-sm text-zinc-400">{subtitle}</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === "register" && (
            <Field label="Full name">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                placeholder="Jane Doe"
                autoComplete="name"
              />
            </Field>
          )}

          {mode === "signin" ? (
            <Field label="Email or username">
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className={inputClass}
                placeholder="you@example.com or janedoe"
                autoComplete="username"
              />
            </Field>
          ) : (
            <Field label="Email">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </Field>
          )}

          {mode !== "forgot" && (
            <Field label="Password">
              <PasswordInput
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                placeholder="At least 8 characters"
                autoComplete={mode === "register" ? "new-password" : "current-password"}
              />
            </Field>
          )}

          {error && (
            <p className="rounded-lg border border-[#FF0000]/30 bg-[#FF0000]/10 px-3 py-2 text-sm text-[#FF5757]">
              {error}
            </p>
          )}
          {info && (
            <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
              {info}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-[#FF0000] py-2.5 font-semibold text-white transition hover:bg-[#AF0404] disabled:opacity-60"
          >
            {busy
              ? "Please wait…"
              : mode === "register"
                ? "Create account"
                : mode === "forgot"
                  ? "Send reset link"
                  : "Sign in"}
          </button>
        </form>

        {mode === "signin" && (
          <button
            onClick={() => switchMode("forgot")}
            className="mt-3 block w-full text-center text-sm text-zinc-400 hover:text-white"
          >
            Forgot password?
          </button>
        )}

        {mode !== "forgot" && (
          <>
            <div className="my-6 flex items-center gap-3 text-xs text-zinc-500">
              <div className="h-px flex-1 bg-white/10" />
              OR
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <div className="flex justify-center">
              <div ref={googleRef} />
            </div>
          </>
        )}

        <div className="mt-6 text-center text-sm text-zinc-400">
          {mode === "signin" && (
            <>
              New to FitZone?{" "}
              <button onClick={() => switchMode("register")} className="font-semibold text-[#FF5757] hover:underline">
                Create an account
              </button>
            </>
          )}
          {mode === "register" && (
            <>
              Already have an account?{" "}
              <button onClick={() => switchMode("signin")} className="font-semibold text-[#FF5757] hover:underline">
                Sign in
              </button>
            </>
          )}
          {mode === "forgot" && (
            <button onClick={() => switchMode("signin")} className="font-semibold text-[#FF5757] hover:underline">
              Back to sign in
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-zinc-300">{label}</span>
      {children}
    </label>
  );
}
