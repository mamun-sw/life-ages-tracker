import { useAuth } from './hooks/useAuth'
import { LoginPage } from './components/LoginPage'
import { Dashboard } from './components/Dashboard'

export default function App() {
  const { user, loading, signIn, signOut } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-7 h-7 border-2 border-stone-200 border-t-stone-500 rounded-full animate-spin" />
          <p className="text-sm text-stone-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginPage onSignIn={signIn} />
  }

  return <Dashboard user={user} onSignOut={signOut} />
}
