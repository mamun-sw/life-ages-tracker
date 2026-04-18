interface LoginPageProps {
  onSignIn: () => void
}

export function LoginPage({ onSignIn }: LoginPageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-stone-50">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <h1 className="font-serif text-4xl text-stone-900 mb-3">
            Life Ages
          </h1>
          <p className="text-stone-500 text-sm leading-relaxed">
            Track the age of everything that matters —<br />
            people, gadgets, milestones, and more.
          </p>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm">
          <div className="space-y-4 mb-8">
            {[
              { emoji: '👤', text: 'Your children\'s exact ages' },
              { emoji: '📱', text: 'How long you\'ve had your phone' },
              { emoji: '🎯', text: 'Days since any milestone' },
            ].map(({ emoji, text }) => (
              <div key={text} className="flex items-center gap-3">
                <span className="text-lg w-7 text-center">{emoji}</span>
                <span className="text-sm text-stone-600">{text}</span>
              </div>
            ))}
          </div>

          <button
            onClick={onSignIn}
            className="w-full flex items-center justify-center gap-3 bg-stone-900 hover:bg-stone-800 active:scale-[0.98] text-white rounded-xl px-5 py-3.5 text-sm font-medium transition-all duration-150"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <p className="mt-4 text-center text-xs text-stone-400">
            Your data is private and tied to your Google account.
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-stone-400">
          Supports Gregorian & Hijri calendars
        </p>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
      <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05" />
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
    </svg>
  )
}
