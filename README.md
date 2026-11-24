# taskOra

A clean, responsive todo workspace built with React. taskOra includes account registration with OTP verification, password reset, per-user categories and tasks, image attachments, profile photos and a light/dark theme.

> **Status:** frontend demo. There is no backend yet — data is kept in the browser. See [Security notes](#security-notes) and [Connecting a backend](#connecting-a-backend).

## Features

- Register, verify with OTP, sign in, "Remember me", forgot / reset password
- Protected routes that return you to the page you were trying to open after sign-in
- Dashboard with progress, upcoming deadlines and recent activity
- Categories with custom colors and icons
- Todos with search, filters, due dates and optional image attachments
- Profile photo upload (JPG, PNG, WEBP, max 2 MB)
- Light / dark theme (follows the system preference on first visit)
- Accessible forms and navigation, route-level code splitting, error boundary and 404 page

## Tech stack

React 18 · Vite 6 · React Router 6 · Tailwind CSS 3 · Lucide icons · Axios (ready for the API layer)

## Getting started

Requires Node.js 18 or newer.

```bash
npm install
npm run dev       # start the dev server
npm run build     # production build in dist/
npm run preview   # serve the production build locally
```

## Demo flow

1. Register with a name, email and a password of at least 8 characters.
2. Enter the demo OTP **123456**. The account is created only after verification.
3. Sign out, then sign in with the same credentials.
4. Use **Forgot password**, enter the demo OTP, and set a new password.

## Project structure

```
src/
├── components/   Reusable UI (AuthCard, Field, PasswordInput, Notice, Avatar, ErrorBoundary)
├── context/      Auth, Theme, Category and Todo state
├── hooks/        usePageTitle
├── layouts/      DashboardLayout (sidebar + topbar)
├── pages/        Route screens
├── routes/       ProtectedRoute
├── services/     api.js — Axios instance for the future backend
└── utils/        Validation, password hashing and storage helpers
```

## Security notes

This project simulates authentication entirely in the browser and is **not suitable for production use as-is**.

- Accounts, sessions, categories and tasks live in `localStorage` / `sessionStorage`.
- Passwords are salted and hashed with PBKDF2 (Web Crypto) rather than stored in plain text, but client-side hashing does not replace server-side authentication.
- The OTP is always `123456`; no email is sent.
- Images are stored as data URLs, so keep them small.

## Connecting a backend

1. Copy `.env.example` to `.env` and set `VITE_API_URL`.
2. Replace the demo methods in `src/context/AuthContext.jsx` with requests made through `src/services/api.js`.
3. Move categories and todos from `localStorage` to API calls in their contexts.
4. On the server: hash passwords with bcrypt/argon2, issue expiring one-time codes by email, and use secure, HttpOnly session cookies or short-lived tokens.
