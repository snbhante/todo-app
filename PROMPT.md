# AI Project Regeneration Prompt

Copy and paste the following prompt into ChatGPT, Copilot, Claude, or any strong AI coding agent to regenerate this project with more advanced features and a much better user experience.

---

You are a senior full-stack engineer and product designer. Build a modern, production-quality todo application in Next.js using TypeScript, Firebase, and a polished responsive UI.

Project goal:
Create an advanced personal productivity app that feels premium, modern, fast, and highly usable on desktop, tablet, and mobile. The app must support user authentication, task management, profile controls, beautiful UI design, clean architecture, and deployment-ready configuration.

This project should be regenerated from scratch or improved from the current codebase while preserving the best ideas already present in the app.

## Tech stack
Use the following stack:
- Next.js App Router
- TypeScript
- React
- Tailwind CSS
- Firebase Authentication
- Firebase Realtime Database
- Modern responsive design
- Static export compatibility for GitHub Pages

## Core app idea
Build a premium todo app that allows each authenticated user to:
- sign up with email/password
- log in securely
- reset password
- verify email
- manage profile settings
- create tasks
- edit tasks
- delete tasks
- mark tasks complete/incomplete
- filter and sort tasks
- view progress metrics
- work across multiple devices

## Functional requirements
Implement all of the following features in a clean, working, production-ready way.

### Authentication
- Email/password signup
- Email/password login
- Password reset email
- Email verification flow
- User session handling
- Redirect logic after login/signup
- Protected routes or guarded access for authenticated users
- Logout action
- User-specific todo data isolation
- Account deletion flow
- Google account linking (optional but recommended)
- Clear error handling and loading states

### Todo functionality
- Add a new todo item
- Mark todo as complete/incomplete
- Delete todo
- Update todo text or metadata
- Live sync with Firebase database
- Empty state when no tasks are present
- Task counters: total, completed, pending
- Filters: all, active, completed
- Optional sorting: newest first, oldest first, completed first
- Optional due date support
- Optional priority labels: low, medium, high
- Optional note/description support
- Keyboard-friendly interaction

### User experience
- Beautiful dark theme by default
- premium UI styling
- soft gradients, glassmorphism, or modern card layouts
- mobile-first responsive design
- adaptive layout for mobile, tablet, and desktop
- smooth hover and micro-interactions
- intuitive form validation
- accessible button states and focus styles
- polished loading, empty, and error states

### App structure
Create a professional app structure like this:
- app/page.tsx
- app/login/page.tsx
- app/signup/page.tsx
- app/todos/page.tsx
- app/profile/page.tsx
- app/components/
- firebase.ts
- next.config.ts
- README.md
- .github/workflows/deploy-pages.yml

## Recommended architecture
Use a clean and maintainable design:
- Firebase config in a dedicated file
- auth and database initialized once
- user-scoped database access using Firebase UID
- real-time database listeners where appropriate
- reusable UI components for forms, cards, task items, navigation, and profile controls
- centralized logic for user actions and error handling

## Firebase integration requirements
Configure Firebase securely and correctly:
- initialize Firebase app
- export auth and db instances
- use Firebase Auth for user authentication
- use Firebase Realtime Database for todos
- store each user’s tasks under their UID
- ensure data is isolated by user
- prevent unauthorized access by using user-specific paths

Example database structure:
{
  "todos": {
    "userUid": {
      "taskId": {
        "text": "Buy milk",
        "done": false,
        "createdAt": 1712345678901,
        "priority": "medium"
      }
    }
  }
}

## Environment variables
Use a clean .env.local setup with Firebase values such as:
- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_DB_URL
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE
- NEXT_PUBLIC_FIREBASE_SENDER
- NEXT_PUBLIC_FIREBASE_APP_ID
- NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID

Do not hardcode secrets. Use environment variables for all Firebase configuration.

## GitHub Pages deployment setup
The app must be deployable as a static site on GitHub Pages.

Requirements:
- configure Next.js for static export
- set correct output strategy for GitHub Pages
- support a repository base path when needed
- configure metadata, icon, and favicon support
- prepare GitHub Actions deployment workflow
- add static deployment compatibility without breaking local development
- ensure asset paths work correctly for GitHub Pages

## Design direction
The UI should feel modern and premium.
- dark theme preferred
- luxury-modern card layout
- gradient accents
- soft shadows and high-contrast typography
- clean spacing and polished forms
- responsive cards and dashboards
- app icon and favicon support
- nice empty states and subtle transitions

## Quality standards
The generated app should be:
- functional
- production-quality
- responsive
- visually polished
- beginner-friendly but strong technically
- secure enough for a real-world demo or portfolio project
- easy to run locally
- easy to deploy to GitHub Pages

## Must avoid
- broken imports
- hydration mismatch warnings
- stale state bugs
- unscoped user data access
- insecure auth assumptions
- poorly structured components
- default Next.js starter boilerplate left in the final project
- missing environment variable handling
- incomplete features or UI that looks unfinished

## Final output expectations
Produce a complete working project with:
1. full source code
2. clean component structure
3. Firebase integration
4. responsive polished UI
5. auth flows and protected pages
6. task management features
7. profile/account features
8. deployment config
9. updated project documentation
10. app branding and icon support

## Very important instructions for the AI
- Explain the reasoning briefly when needed, but prioritize implementation.
- Fix bugs systematically instead of patching blindly.
- Ensure the app works locally before finalizing.
- Validate build status with npm run build if possible.
- Keep code clean, readable, and maintainable.
- Preserve a strong modern design aesthetic.
- Make sure the app is fully functional end-to-end.

## Final task summary
Build the best version of this todo project possible with premium visuals, secure Firebase auth, robust task management, responsive design, and GitHub Pages compatibility. The final result should feel like a polished SaaS-style productivity app rather than a basic starter project.

---

Use this as the generation request:

"Create an advanced, modern Firebase-powered todo app using Next.js and TypeScript with responsive premium UI, secure user authentication, protected personal task data, beautiful dashboard design, profile/account management, and GitHub Pages deployment compatibility. Rebuild the app in a clean architecture, using Firebase Auth and Realtime Database, with user-scoped todo storage, real-time updates, task filters, counters, validation, polished forms, and production-level UX. Ensure the project includes app branding, static export configuration, GitHub Actions workflow, environment variables, and full documentation. Make it feel like a premium SaaS productivity app, not a starter template."

---

This prompt is designed to regenerate a stronger version of the app while preserving the app’s core purpose and deployment strategy.
