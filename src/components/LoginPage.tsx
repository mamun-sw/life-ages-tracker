import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'

interface LoginPageProps {
  onSignIn: () => void
}

export function LoginPage({ onSignIn }: LoginPageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-linear-to-br from-background via-background to-muted/40 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="w-full max-w-sm relative">
        {/* Brand */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-foreground text-background text-xl mb-4 font-serif font-bold shadow-md">
            L
          </div>
          <h1 className="font-serif text-4xl text-foreground mb-2 tracking-tight">Life Ages</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Track the age of everything that matters —<br />
            people, gadgets, milestones, and more.
          </p>
        </div>

        {/* Card */}
        <Card className="shadow-lg ring-1 ring-foreground/8 border-0">
          <CardContent className="px-8 pb-7 pt-2">
            <div className="space-y-3.5 mb-7">
              {[
                { emoji: '👤', text: "Your children's exact ages" },
                { emoji: '📱', text: "How long you've had your phone" },
                { emoji: '🎯', text: 'Days since any milestone' },
              ].map(({ emoji, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <span className="text-lg w-8 h-8 flex items-center justify-center rounded-xl bg-muted text-center shrink-0">
                    {emoji}
                  </span>
                  <span className="text-sm text-foreground/80">{text}</span>
                </div>
              ))}
            </div>

            <Button
              onClick={onSignIn}
              className="w-full gap-2.5 bg-foreground hover:bg-foreground/90 active:scale-[0.98] text-background rounded-xl h-11 text-sm font-medium shadow-sm"
            >
              <GoogleIcon />
              Continue with Google
            </Button>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              Your data is private and tied to your Google account.
            </p>
          </CardContent>
        </Card>

        <p className="mt-5 text-center text-xs text-muted-foreground/60">
          Supports Gregorian & Hijri calendars
        </p>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
      <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05" />
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
    </svg>
  )
}
