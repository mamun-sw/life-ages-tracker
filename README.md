# Life Ages Tracker

Track the age of everything that matters — people, gadgets, milestones, and more. Supports both Gregorian and Hijri calendars.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript 5.8 |
| Build | Vite 6 |
| Styling | Tailwind CSS 4 |
| Auth | Firebase Auth 11 (Google Sign-In) |
| Database | Firestore (Firebase Spark — free) |
| Hosting | Vercel (free) |
| CI/CD | GitHub Actions → auto-deploy on master push |

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/life-ages-tracker.git
cd life-ages-tracker
npm install
```

### 2. Set up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **Add project** → give it a name → Create
3. In the project, go to **Authentication** → Get started → Enable **Google** sign-in
4. Go to **Firestore Database** → Create database → Start in **production mode** → choose a region
5. Go to **Project Settings** → **Your apps** → click the web icon `</>` → Register app
6. Copy the config values

### 3. Add environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local` with your Firebase config values.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Deploying to Vercel

### First-time setup

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Add all environment variables from `.env.example` in the Vercel dashboard
4. Deploy

### Auto-deploy on master push (GitHub Actions)

Add these secrets to your GitHub repo under **Settings → Secrets → Actions**:

| Secret | Where to get it |
|---|---|
| `VERCEL_TOKEN` | Vercel → Account Settings → Tokens |
| `VITE_FIREBASE_API_KEY` | Firebase project config |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase project config |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project config |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase project config |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase project config |
| `VITE_FIREBASE_APP_ID` | Firebase project config |

Once set up, every push to `master` will:
1. Lint the code
2. Build the project
3. Deploy to Vercel automatically

---

## Firestore Security Rules

In Firebase Console → Firestore → Rules, paste these rules to secure your data:

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

## Switching the Database

All database operations are in `src/lib/db.ts`. To migrate to MongoDB Atlas later:

1. Install the MongoDB driver or use the Atlas Data API
2. Rewrite only `src/lib/db.ts` — the functions stay the same (`getItems`, `addItem`, `deleteItem`, `getCategories`, `saveCategories`)
3. Nothing else in the app changes

---

## Features

- Google Sign-In only
- Track people, gadgets, events, or any custom category
- Age shown in Gregorian or Hijri (toggle anytime)
- Date input is always Gregorian
- Anniversary alert when an item's date is within 7 days
- Custom categories with emoji picker
- Per-user data storage in Firestore
- Auto-deploy to Vercel on every master push
