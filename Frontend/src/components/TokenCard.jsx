import { useState } from 'react'

// Shown after a successful login/register.
// The token lives ONLY in React state — no cookie, no localStorage (by design for now).
export default function TokenCard({ auth, onReset, title = 'Login successful' }) {
  const [copied, setCopied] = useState(false)

  const copyToken = async () => {
    try {
      await navigator.clipboard.writeText(auth.token)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard not available — ignore, the token is visible anyway
    }
  }

  return (
    <div className="rounded-3xl border border-emerald-400/20 bg-white/10 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-400/15 text-2xl">✅</span>
        <div>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <p className="text-sm text-slate-400">
            Hello, <span className="font-medium text-slate-200">{auth.user.name}</span>
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            JWT Token received from backend
          </p>
          <button
            type="button"
            onClick={copyToken}
            className="rounded-lg border border-white/10 px-2 py-1 text-xs font-medium text-slate-300 transition hover:bg-white/10"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <code className="block max-h-40 overflow-y-auto break-all text-xs leading-relaxed text-emerald-300">
          {auth.token}
        </code>
      </div>

      <p className="mt-3 text-xs text-slate-400">
        🔒 This token is only kept in memory (React state) for now — not saved in cookie or
        localStorage. Refresh the page and it&apos;s gone.
      </p>

      <button
        type="button"
        onClick={onReset}
        className="mt-5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10"
      >
        Sign in again
      </button>
    </div>
  )
}
