import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import { renderGoogleButton } from "@/lib/google";
import PasswordInput from "@/components/PasswordInput";
import { BorderBeam } from "@/components/magicui/border-beam";
import GradientText from "@/components/reactbits/GradientText";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-left text-sm text-foreground outline-none transition focus:border-[#FF0000]/60 focus:ring-1 focus:ring-[#FF0000]/40";

export default function LoginPage() {
  const { user, loading, loginWithGoogle, login, forgotPassword } = useAuth();
  const navigate = useNavigate();
  const btnRef = useRef<HTMLDivElement>(null);

  const [forgot, setForgot] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate("/", { replace: true });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (forgot) return;
    const el = btnRef.current;
    if (!el) return;
    el.innerHTML = "";
    renderGoogleButton(el, async (idToken) => {
      setError(null);
      try {
        await loginWithGoogle(idToken);
        navigate("/", { replace: true });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Login failed");
      }
    }).catch((e) => setError(e instanceof Error ? e.message : "Failed to load Google sign-in"));
  }, [forgot, loginWithGoogle, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);
    try {
      if (forgot) {
        const msg = await forgotPassword(email);
        setInfo(msg);
      } else {
        await login(email, password);
        navigate("/", { replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  function toggleForgot(next: boolean) {
    setForgot(next);
    setError(null);
    setInfo(null);
    setPassword("");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card p-8 text-center">
        <BorderBeam duration={8} />
        <div className="mb-2 font-serif text-3xl font-bold">
          <span className="text-[#FFFADC]">Fit</span>
          <span className="text-[#FF0000]">Zone</span>
        </div>
        <GradientText className="text-xl font-semibold">Admin Portal</GradientText>
        <p className="mt-3 text-sm text-muted-foreground">
          {forgot
            ? "Enter your email and we'll send you a reset link."
            : "Sign in with an authorized admin account to manage the gym."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3 text-left">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="admin@example.com"
            autoComplete="email"
          />
          {!forgot && (
            <PasswordInput
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              placeholder="Password"
              autoComplete="current-password"
            />
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg bg-[#FF0000] py-2.5 text-sm font-semibold text-white transition hover:bg-[#AF0404] disabled:opacity-60"
          >
            {busy ? "Please wait…" : forgot ? "Send reset link" : "Sign in"}
          </button>
        </form>

        <button
          onClick={() => toggleForgot(!forgot)}
          className="mt-3 text-sm text-muted-foreground hover:text-foreground"
        >
          {forgot ? "Back to sign in" : "Forgot password?"}
        </button>

        {!forgot && (
          <>
            <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
              <div className="h-px flex-1 bg-border" />
              OR
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="flex justify-center">
              <div ref={btnRef} />
            </div>
          </>
        )}

        {error && (
          <p className="mt-4 rounded-lg border border-[#FF0000]/30 bg-[#FF0000]/10 px-3 py-2 text-sm text-[#FF5757]">
            {error}
          </p>
        )}
        {info && (
          <p className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
            {info}
          </p>
        )}
      </div>
    </div>
  );
}
