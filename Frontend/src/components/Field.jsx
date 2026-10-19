// Reusable text input with a label, inline error and optional right-side slot
// (used for the show/hide password button).

function inputClasses(hasError) {
  return `w-full rounded-xl border bg-white/70 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 shadow-sm outline-none transition focus:ring-2 ${
    hasError
      ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
      : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-200'
  }`
}

export default function Field({ id, label, error, rightSlot, hint, ...inputProps }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-200">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          aria-invalid={error ? 'true' : 'false'}
          className={`${inputClasses(error)} ${rightSlot ? 'pr-12' : ''}`}
          {...inputProps}
        />
        {rightSlot}
      </div>
      {error ? (
        <p role="alert" className="mt-1.5 text-xs font-medium text-red-400">
          {error}
        </p>
      ) : (
        hint && <p className="mt-1.5 text-xs text-slate-400">{hint}</p>
      )}
    </div>
  )
}
