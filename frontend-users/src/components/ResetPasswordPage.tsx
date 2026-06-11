import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Dumbbell } from "lucide-react";
import { useAuth } from "@/auth/AuthContext";
import PasswordInput from "./PasswordInput";

const inputClass =
  "w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 text-white placeholder-zinc-500 outline-none transition focus:border-[#FF0000]/60 focus:ring-1 focus:ring-[#FF0000]/40";

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
    <div className="flex min-h-screen items-center justify-center bg-black p-4 font-serif">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900/80 p-8 shadow-xl">
        <div className="mb-6 flex items-center justify-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF0000] text-white">
            <Dumbbell className="h-5 w-5" />
          </span>
          <span className="text-2xl font-bold text-[#FFFADC]">
            Fit<span className="text-[#FF0000]">Zone</span>
          </span>
        </div>

        {!token ? (
          <p className="text-center text-sm text-[#FF5757]">
            This reset link is missing its token. Please request a new one.
          </p>
        ) : done ? (
          <div className="text-center">
            <p className="text-emerald-400">Your password has been reset.</p>
            <button
              onClick={() => navigate("/login", { replace: true })}
              className="mt-5 w-full rounded-full bg-[#FF0000] py-2.5 font-semibold text-white transition hover:bg-[#AF0404]"
            >
              Go to sign in
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-center text-xl font-semibold text-white">Choose a new password</h1>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
                className="w-full rounded-full bg-[#FF0000] py-2.5 font-semibold text-white transition hover:bg-[#AF0404] disabled:opacity-60"
              >
                {busy ? "Resetting…" : "Reset password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
