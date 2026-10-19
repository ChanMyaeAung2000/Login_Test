import { useState } from 'react'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import TokenCard from './TokenCard'

function AuthTabs({ mode, onChange }) {
  const base = 'flex-1 rounded-xl px-4 py-2 text-sm font-medium transition'
  return (
    <div className="mb-6 flex gap-1 rounded-2xl border border-white/10 bg-white/5 p-1">
      <button
        type="button"
        onClick={() => onChange('login')}
        className={`${base} ${mode === 'login' ? 'bg-white/15 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
      >
        Sign in
      </button>
      <button
        type="button"
        onClick={() => onChange('register')}
        className={`${base} ${mode === 'register' ? 'bg-white/15 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
      >
        Create account
      </button>
    </div>
  )
}

export default function LoginPage() {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [auth, setAuth] = useState(null) // { token, user } after success

  const isRegister = mode === 'register'

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-12">
      {/* Decorative background blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-600/30 blur-3xl" />
        <div className="absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-fuchsia-600/25 blur-3xl" />
        <div className="absolute top-1/3 right-1/4 h-64 w-64 rounded-full bg-sky-500/20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Brand header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 shadow-lg shadow-indigo-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {auth ? 'Welcome' : isRegister ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            {auth
              ? 'You are signed in'
              : isRegister
                ? 'It only takes a moment to get started'
                : 'Sign in to your account to continue'}
          </p>
        </div>

        {/* Auth card */}
        {auth ? (
          <TokenCard
            auth={auth}
            title={isRegister ? 'Account created' : 'Login successful'}
            onReset={() => setAuth(null)}
          />
        ) : (
          <div className="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl">
            <AuthTabs mode={mode} onChange={setMode} />
            {isRegister ? (
              <RegisterForm onSuccess={setAuth} />
            ) : (
              <LoginForm onSuccess={setAuth} />
            )}

            {/* 🕐 Hidden for now — social login (Google / GitHub) goes here in the future */}
          </div>
        )}
      </div>
    </div>
  )
}
