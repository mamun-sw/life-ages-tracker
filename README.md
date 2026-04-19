# Life Ages Tracker

Track the age of everything that matters — people, gadgets, milestones, and more. Supports both Gregorian and Hijri calendars.

## Tech Stack

| Layer    | Technology                                  |
| -------- | ------------------------------------------- |
| Frontend | React 19 + TypeScript 5.8                   |
| Build    | Vite 6                                      |
| Styling  | Tailwind CSS 4                              |
| Auth     | Firebase Auth 11 (Google Sign-In)           |
| Database | Firestore (Firebase Spark — free)           |
| Hosting  | Vercel (free)                               |
| CI/CD    | GitHub Actions → Vercel (preview + production) |

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/mamun-sw/life-ages-tracker.git
cd life-ages-tracker
npm install
```

### 2. Set up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **Add project** → give it a name → Create
3. Go to **Authentication** → Get started → Enable **Google** sign-in
4. Go to **Firestore Database** → Create database → Start in **production mode** → choose a region
5. Go to **Project Settings** → **Your apps** → click the web icon `</>` → Register app
6. Copy the config values

### 3. Add environment variables

Create a `.env.local` file in the project root:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Deploying to Vercel

### CI/CD via GitHub Actions (recommended)

Every push to `master` runs lint → type-check → build → deploy to **production**.
Every pull request deploys a **preview URL** posted back to the PR.

Add these secrets to your GitHub repo under **Settings → Secrets and variables → Actions**:

| Secret                              | Where to get it                                        |
| ----------------------------------- | ------------------------------------------------------ |
| `VERCEL_TOKEN`                      | [vercel.com/account/tokens](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID`                     | Run `vercel link` locally → check `.vercel/project.json` |
| `VERCEL_PROJECT_ID`                 | Run `vercel link` locally → check `.vercel/project.json` |
| `VITE_FIREBASE_API_KEY`             | Firebase project settings                              |
| `VITE_FIREBASE_AUTH_DOMAIN`         | Firebase project settings                              |
| `VITE_FIREBASE_PROJECT_ID`          | Firebase project settings                              |
| `VITE_FIREBASE_STORAGE_BUCKET`      | Firebase project settings                              |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase project settings                              |
| `VITE_FIREBASE_APP_ID`              | Firebase project settings                              |

Also add the 6 `VITE_FIREBASE_*` variables in the **Vercel dashboard** under Project → Settings → Environment Variables.

### Manual one-time deploy

```bash
npm install -g vercel
vercel link
vercel --prod
```

---

## Firebase: Authorized Domains

After deploying, add your Vercel URL to Firebase's allowed list or sign-in will be blocked:

1. Firebase Console → **Authentication → Settings → Authorized domains**
2. Add `your-project.vercel.app`

---

## Firestore Security Rules

In Firebase Console → Firestore → Rules, paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

This ensures each user can only access their own data.

---

## Features

- Google Sign-In
- Track people, gadgets, events, or any custom category
- Age displayed in Gregorian or Hijri calendar (toggle anytime)
- Date input is always Gregorian
- Anniversary alert when an item's date falls within 7 days
- Custom categories with emoji picker
- Filter by category
- Per-user data stored in Firestore
- Responsive — works on mobile and desktop
- Dark mode support
- CI/CD: preview deployments on PRs, production deploy on merge to `master`
