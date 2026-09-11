# Luma Todo

A Firebase-powered todo application built with Next.js and TypeScript, with authentication, responsive UI, and deployment-ready GitHub Pages configuration.

## Project overview

Luma Todo is a productivity-focused task manager that lets users:

- create an account
- log in securely
- add tasks
- mark tasks as complete or incomplete
- delete tasks
- manage account settings
- use the app on desktop and mobile devices

The app uses:

- Next.js App Router
- React
- TypeScript
- Firebase Authentication
- Firebase Realtime Database
- Tailwind CSS

## Features

### Authentication

- Email/password signup
- Email/password login
- Password reset
- Email verification
- Email change with confirmation flow
- Password change with reauthentication
- Google account linking
- Account deletion with related todo cleanup
- Inline error feedback and loading states

### Todo management

- Add new task
- Toggle task completion state
- Delete task
- View live updates from Firebase
- Empty-state messaging when no tasks exist
- Dashboard summary metrics for total, done, and pending tasks

### UI and responsiveness

- Dark premium dashboard style
- Responsive layout for mobile and desktop
- Consistent branded shell across auth, profile, and tasks pages
- App icon and favicon support
- Shared responsive navigation shell

## Tech stack

- Next.js 16
- React 19
- TypeScript
- Firebase JS SDK
- Tailwind CSS
- GitHub Pages static export

## Project structure

- `app/` — app pages and UI components
- `app/page.tsx` — home page
- `app/login/page.tsx` — login page
- `app/signup/page.tsx` — signup page
- `app/profile/page.tsx` — profile and account management
- `app/todos/page.tsx` — task dashboard page
- `app/components/` — reusable UI components
- `firebase.ts` — Firebase configuration and instance exports
- `next.config.ts` — Next.js config and static export setup
- `.github/workflows/deploy-pages.yml` — GitHub Actions Pages deployment workflow
- `app/icon.svg` — app icon

## Firebase setup

The app uses Firebase for two main services:

1. Firebase Authentication
2. Firebase Realtime Database

The Firebase config is stored with environment variables in `.env.local`.

Key variables include:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_DB_URL`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE`
- `NEXT_PUBLIC_FIREBASE_SENDER`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

## Firebase database design

The app stores tasks per user under their Firebase UID.

Example structure:

```json
{
  "todos": {
    "userUid123": {
      "taskId1": {
        "text": "Buy milk",
        "done": false
      },
      "taskId2": {
        "text": "Finish project draft",
        "done": true
      }
    }
  }
}
```

This ensures that:

- each user sees only their own tasks
- database access is scoped to the logged-in user
- task data updates reflect live in the UI

## Database boilerplate and logic

The Firebase app is initialized in `firebase.ts` using:

- `initializeApp()`
- `getAuth()`
- `getDatabase()`

The app uses the following operations from Firebase Realtime Database:

- `ref()` — create a database reference
- `onValue()` — listen for live updates
- `push()` — add new task
- `update()` — toggle completion state
- `remove()` — delete task

The main database logic is in:

- `app/components/TodoList.tsx`

## User flow

### Sign up

1. User opens the app.
2. User clicks Create account.
3. User enters email and password.
4. Firebase creates the user.
5. User is redirected to the app dashboard.

### Log in

1. User enters email and password.
2. Firebase authenticates the user.
3. App loads that user’s todo list from the database.

### Manage tasks

1. User enters a task in the add form.
2. Task is pushed to the user’s path in Realtime Database.
3. App listens and updates the UI automatically.
4. User can toggle task status or delete it.

### Profile management

From the profile page a user can:

- verify email
- reset password
- change email
- change password
- connect Google account
- delete account

## Local development guide

### Install dependencies

```bash
npm install
```

### Start the app locally

```bash
npm run dev -- --hostname 0.0.0.0
```

### Build for production

```bash
npm run build
```

## GitHub Pages deployment

The app includes a static export and GitHub Pages workflow.

Main deployment files:

- `next.config.ts`
- `.github/workflows/deploy-pages.yml`

### Deployment requirements

1. Push the project to GitHub.
2. Add Firebase environment variables as GitHub repository secrets.
3. Enable GitHub Pages in repository settings.
4. Run the GitHub Actions workflow.
5. Add the deployed domain to Firebase authorized domains.

## GitHub repository secrets required

Add these secrets in GitHub:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_DB_URL`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE`
- `NEXT_PUBLIC_FIREBASE_SENDER`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

## Firebase authorized domains

For deployed GitHub Pages usage, add:

```text
snbhante.github.io
```

This is required for authentication to work on the deployed site.

## Notes for production

For production-grade use, also consider:

- Firebase Realtime Database rules
- App Check security
- stronger password policy enforcement
- optional social login providers
- proper domain validation for production hosts

## Troubleshooting

### Build issues

- check all Firebase env values are present
- verify `npm run build` works locally
- inspect GitHub Actions logs for missing secrets

### Auth issues

- ensure Firebase Authentication is enabled for Email/Password
- ensure the correct domain is added to authorized domains
- verify the API key and project values match the Firebase project

### Data issues

- verify the user is logged in
- verify the database path is `todos/{uid}`
- confirm the database URL matches the correct project and region

## Final summary

Luma Todo is a responsive Firebase todo app with user authentication, live task storage, profile controls, and GitHub Pages deployment support. It is suitable for local use, personal hosting, and deployment as a static GitHub Pages app with Firebase backend support.
