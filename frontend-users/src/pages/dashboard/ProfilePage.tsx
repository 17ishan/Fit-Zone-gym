import { useState } from "react";
import { Mail, KeyRound, Save } from "lucide-react";
import { useAuth } from "@/auth/AuthContext";
import { updateMyProfile } from "@/services/me.service";
import { Panel, PageHeader } from "@/components/dashboard/parts";

const inputClass =
  "w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 text-[#FFFADC] placeholder-zinc-600 outline-none transition focus:border-[#FF0000]/60 focus:ring-1 focus:ring-[#FF0000]/40";

export default function ProfilePage() {
  const { user, forgotPassword, refreshUser } = useAuth();

  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [address, setAddress] = useState(user?.address ?? "");
  const [age, setAge] = useState(user?.age != null ? String(user.age) : "");

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [pwMsg, setPwMsg] = useState<string | null>(null);
  const [pwBusy, setPwBusy] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      await updateMyProfile({
        name: name.trim() || undefined,
        phone: phone.trim() || undefined,
        address: address.trim() || undefined,
        age: age.trim() ? parseInt(age, 10) : undefined,
      });
      await refreshUser();
      setMsg({ kind: "ok", text: "Profile updated." });
    } catch (err) {
      setMsg({ kind: "err", text: err instanceof Error ? err.message : "Update failed." });
    } finally {
      setBusy(false);
    }
  }

  async function handleChangePassword() {
    if (!user?.email) return;
    setPwBusy(true);
    setPwMsg(null);
    try {
      const m = await forgotPassword(user.email);
      setPwMsg(m || "We've emailed you a password reset link.");
    } catch (err) {
      setPwMsg(err instanceof Error ? err.message : "Could not send reset link.");
    } finally {
      setPwBusy(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <PageHeader title="Profile" subtitle="Manage your personal details and password." />

      <Panel>
        <form onSubmit={handleSave} className="space-y-5">
          <Field label="Full name">
            <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </Field>

          <Field label="Email">
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/20 px-3 py-2.5 text-zinc-400">
              <Mail className="h-4 w-4" />
              <span>{user?.email}</span>
            </div>
            <p className="mt-1 text-xs text-zinc-600">Email is linked to your sign-in and can't be changed here.</p>
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Phone">
              <input className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit number" />
            </Field>
            <Field label="Age">
              <input className={inputClass} type="number" min={16} max={100} value={age} onChange={(e) => setAge(e.target.value)} placeholder="Age" />
            </Field>
          </div>

          <Field label="Address">
            <textarea className={`${inputClass} resize-none`} rows={3} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Your address" />
          </Field>

          {msg && (
            <p
              className={`rounded-lg border px-3 py-2 text-sm ${
                msg.kind === "ok"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  : "border-[#FF0000]/30 bg-[#FF0000]/10 text-[#FF5757]"
              }`}
            >
              {msg.text}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-full bg-[#FF0000] px-6 py-2.5 font-semibold text-white transition hover:bg-[#AF0404] disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {busy ? "Saving…" : "Save changes"}
          </button>
        </form>
      </Panel>

      <Panel className="mt-6">
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF0000]/10 ring-1 ring-[#FF0000]/30">
              <KeyRound className="h-5 w-5 text-[#FF0000]" />
            </span>
            <div>
              <div className="font-semibold text-[#FFFADC]">Password</div>
              <div className="text-sm text-zinc-400">We'll email a secure reset link to {user?.email}.</div>
            </div>
          </div>
          <button
            onClick={handleChangePassword}
            disabled={pwBusy}
            className="rounded-full border border-white/15 px-5 py-2 text-sm font-medium text-white transition hover:bg-white/10 disabled:opacity-60"
          >
            {pwBusy ? "Sending…" : "Change password"}
          </button>
        </div>
        {pwMsg && <p className="mt-3 text-sm text-emerald-400">{pwMsg}</p>}
      </Panel>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-zinc-300">{label}</span>
      {children}
    </label>
  );
}
