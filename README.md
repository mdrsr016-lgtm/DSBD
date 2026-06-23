# DSBD — Daily Budget Manager & Loan Tracker

A web-first financial app built with **React + Vite + TypeScript + Firebase**, designed to convert to Android via **Capacitor**.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/DSBD)

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Set up Firebase
1. Create a project at [firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** (Email/Password)
3. Enable **Firestore Database**
4. Copy `.env.example` → `.env` and fill in your credentials

### 3. Run the dev server
```bash
npm run dev
```
Open: http://localhost:5173

---

## 📁 Project Structure

```
src/
├── features/
│   ├── auth/          # Login, Register, AuthGuard, AuthContext
│   ├── budget/        # Income/expense tracking
│   ├── loans/         # Loan management
│   └── dashboard/     # Summary & overview
├── lib/
│   └── firebase.ts    # Firebase initialization
├── store/
│   └── index.ts       # Zustand global state
├── styles/
│   └── index.css      # Design tokens & CSS reset
├── types/
│   └── index.ts       # TypeScript interfaces
└── utils/
    └── index.ts       # Currency, date, calculation helpers
```

---

## 🚀 Deploy to Vercel

### Option A — Vercel CLI
```bash
npm install -g vercel
vercel
```

### Option B — Vercel Dashboard
1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo
3. Vercel auto-detects Vite — no build settings needed
4. Add your Firebase environment variables:

| Variable | Where to find it |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase Console → Project Settings → Web App |
| `VITE_FIREBASE_AUTH_DOMAIN` | Same |
| `VITE_FIREBASE_PROJECT_ID` | Same |
| `VITE_FIREBASE_STORAGE_BUCKET` | Same |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Same |
| `VITE_FIREBASE_APP_ID` | Same |

> **Important**: In Vercel dashboard → Settings → Environment Variables,
> add all 6 `VITE_` variables. They must start with `VITE_` to be exposed to the client.

5. Click **Deploy** — done!

> The `vercel.json` in this repo handles SPA routing automatically.
> All routes (e.g. `/dashboard`, `/loans`) correctly serve `index.html`.

---

## 📱 Converting to Android (Future)

When the web app is complete:

```bash
# 1. Build the web app
npm run build

# 2. Add Android platform
npx cap add android

# 3. Sync web assets to Android
npx cap sync android

# 4. Open in Android Studio
npx cap open android
```

> Requires: Android Studio, JDK 17+

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite 5 |
| Routing | React Router v6 |
| State | Zustand |
| Backend | Firebase (Auth + Firestore) |
| Mobile Bridge | Capacitor |
| Icons | React Icons |
| Dates | date-fns |

---

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Run Prettier |
