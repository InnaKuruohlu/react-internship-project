import { useAuthViewModel } from './useAuthViewModel'
import './AuthView.css'

function AuthView() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    mode,
    loading,
    error,
    handleSubmit,
    toggleMode,
  } = useAuthViewModel()

  const title = mode === 'login' ? 'Login' : 'Create Account'
  const submitLabel = loading
    ? mode === 'login'
      ? 'Signing in...'
      : 'Creating account...'
    : title
  const switchLabel =
    mode === 'login'
      ? "Don't have an account? Create Account"
      : 'Already have an account? Login'

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void handleSubmit()
  }

  return (
    <main className="auth">
      <form className="auth__form" onSubmit={onSubmit}>
        <h1 className="auth__title">{title}</h1>

        <label className="auth__field">
          <span className="auth__label">Email</span>
          <input
            type="email"
            className="auth__input"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </label>

        <label className="auth__field">
          <span className="auth__label">Password</span>
          <input
            type="password"
            className="auth__input"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 6 characters"
            autoComplete={
              mode === 'login' ? 'current-password' : 'new-password'
            }
            required
            minLength={6}
          />
        </label>

        {error && <p className="auth__error">{error}</p>}

        <button
          type="submit"
          className="auth__submit"
          disabled={loading}
        >
          {submitLabel}
        </button>

        <button
          type="button"
          className="auth__toggle"
          onClick={toggleMode}
          disabled={loading}
        >
          {switchLabel}
        </button>
      </form>
    </main>
  )
}

export default AuthView
