import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { registerUser } from '../api/auth'
import { registerSchema } from '../schemas/registerSchema'
import Field from './Field'
import PasswordField from './PasswordField'

export default function RegisterForm({ onSuccess }) {
  const [serverError, setServerError] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  const onSubmit = async (data) => {
    setServerError(null)
    try {
      const res = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      })
      // Registered users are logged in straight away (backend returns a token)
      onSuccess({ token: res.token, user: res.user })
    } catch (err) {
      setServerError(err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {serverError && (
        <p role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm font-medium text-red-300">
          {serverError}
        </p>
      )}

      <Field
        id="name"
        label="Full name"
        autoComplete="name"
        placeholder="Aung Aung"
        error={errors.name?.message}
        {...register('name')}
      />

      <Field
        id="email"
        label="Email address"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <PasswordField
        id="password"
        autoComplete="new-password"
        placeholder="••••••••"
        error={errors.password?.message}
        hint="At least 8 characters, 1 uppercase letter and 1 number."
        {...register('password')}
      />

      <PasswordField
        id="confirmPassword"
        label="Confirm password"
        autoComplete="new-password"
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:from-indigo-600 hover:to-fuchsia-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            Creating account…
          </span>
        ) : (
          'Create account'
        )}
      </button>
    </form>
  )
}
