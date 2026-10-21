# IELTS VOCAB MASTER — Road to 7.5

A mobile-first IELTS vocabulary study app built with React + Vite. Designed for iPhone Safari/Chrome.

## What works
- Home dashboard, topic library, 80 curated sample vocabulary entries (including the 60-item Daily Life & Routines deck).
- Flip flashcards, IPA, examples, collocations, synonyms and browser speech synthesis pronunciation.
- Active recall (Vietnamese → English, English → Vietnamese with self-rating, collocation completion), 20/40-question multiple choice, explanations and review of mistakes.
- Spaced repetition intervals of 1/3/7/14/30/60 days, based on self-rating and quiz mistakes. Review page shows due items.
- Local persistence using localStorage, backup export/import JSON, daily new-word target up to 60.
- Optional Firebase Google sign-in + Firestore cloud sync.
- Optional server-side AI analysis (Vercel function) of pasted IELTS text or text-based PDFs, selecting up to 60 items. Source-grounding is prompted, but AI output still requires review.

## Run locally
Install Node.js 20+ and run:

```bash
npm install
npm run dev
```

Open the address printed by Vite (normally http://localhost:5173). On an iPhone on the same Wi-Fi network, use the computer's LAN IP and port 5173.

## Deploy to Vercel
1. Create a GitHub repository and upload these project files (the contents of this folder, not the zip).
2. At https://vercel.com/new, import the repository.
3. Framework: Vite; build command: `npm run build`; output directory: `dist`.
4. Deploy. The static vocabulary app works without environment variables.
5. To enable AI analysis, add server environment variables `OPENAI_API_KEY` and optionally `OPENAI_MODEL` in Vercel project Settings → Environment Variables, then redeploy. API keys must NEVER be prefixed `VITE_` or committed to GitHub. AI analysis requires API credits and may incur costs.

**Important:** Vite's local dev server does not execute Vercel API functions. To test the `/api/analyze` route locally, use `npx vercel dev` after installing/logging in to Vercel, or test it after deployment.

## Optional Google login + cloud sync
1. Create a Firebase project: https://console.firebase.google.com/
2. Register a Web App, enable Authentication → Google provider, and create a Firestore database.
3. Add the deployed domain to Firebase Authentication → Settings → Authorized domains.
4. Copy `.env.example` to `.env.local` and set the four `VITE_FIREBASE_*` variables from your Firebase web app configuration. Also add these same public Firebase variables to Vercel environment variables, then redeploy.
5. Firestore security rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Cloud sync is a single-user-document MVP: when signing in, existing cloud data takes precedence over local data. Export a backup before connecting devices or changing accounts. Concurrent editing across devices is not conflict-safe.

## Limitations
- AI analysis needs a deployed server endpoint and a secret OpenAI API key; it cannot run from the static website alone.
- Text PDFs supported; image-only PDFs and photos need OCR, not yet included. No automated audio transcription.
- Built-in content contains 80 curated entries and a list of other topic names; other topics require source text for AI analysis or further curated decks.
- Pronunciation uses the device's speech synthesis voices, not prerecorded IPA-aligned audio.
- The review page computes due items when opened; push notifications/background reminders are not yet implemented.
- localStorage can be cleared by browser settings. Export backups regularly or enable Firebase.
- AI CEFR levels, IPA, and example quotes can be imperfect and should be verified.
- Review scheduling is a simple spaced-repetition algorithm, not a validated memory model.

## Build check
`npm run build`
