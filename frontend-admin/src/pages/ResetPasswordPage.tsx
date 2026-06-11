import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import PasswordInput from "@/components/PasswordInput";
import { BorderBeam } from "@/components/magicui/border-beam";
import GradientText from "@/components/reactbits/GradientText";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-[#FF0000]/60 focus:ring-1 focus:ring-[#FF0000]/40";

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setBusy(true);
    try {
      await resetPassword(token, password);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reset password");
    } finally {
      setBusy(false);
    }
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

        {!token ? (
          <p className="mt-6 text-sm text-[#FF5757]">
            This reset link is missing its token. Please request a new one.
          </p>
        ) : done ? (
          <div className="mt-6">
            <p className="text-sm text-emerald-400">Your password has been reset.</p>
            <button
              onClick={() => navigate("/login", { replace: true })}
              className="mt-5 w-full rounded-lg bg-[#FF0000] py-2.5 text-sm font-semibold text-white transition hover:bg-[#AF0404]"
            >
              Go to sign in
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-3 text-left">
            <PasswordInput
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              placeholder="New password (min 8 chars)"
              autoComplete="new-password"
            />
            <PasswordInput
              required
              minLength={8}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={inputClass}
              placeholder="Confirm new password"
              autoComplete="new-password"
            />
            {error && (
              <p className="rounded-lg border border-[#FF0000]/30 bg-[#FF0000]/10 px-3 py-2 text-sm text-[#FF5757]">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-lg bg-[#FF0000] py-2.5 text-sm font-semibold text-white transition hover:bg-[#AF0404] disabled:opacity-60"
            >
              {busy ? "Resetting…" : "Reset password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
