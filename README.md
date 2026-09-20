# WordBank App

This is a Progressive Web App (PWA) built with **Next.js**, **React**, and **Tailwind CSS**. It uses **Firebase Firestore** as the backend database to store words, their phonetic transcriptions, meanings, and timestamps.

## Architecture

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **PWA Capabilities**: Powered by `@ducanh2912/next-pwa` for offline caching and installability.
- **Backend / Database**: Firebase Cloud Firestore
- **Language**: TypeScript

## Directory Structure

- `/src/app`: Contains Next.js application routes.
- `/src/lib/firebase.ts`: Firebase initialization and configuration logic.
- `/src/models/WordBank.ts`: TypeScript interface defining the data model for the WordBank collection.
- `/public/manifest.json`: Web app manifest file defining PWA metadata.

## Data Model

The `WordBank` collection in Firestore uses the following schema:

```typescript
import { Timestamp } from "firebase/firestore";

export interface WordBank {
  id?: string;
  word: string;
  phoneticTranscription: string;
  meaning: string;
  createdAt: Timestamp;
}
```

## Environment Setup

To run this project locally, you need a Firebase project. Create a `.env.local` file in the root of your project and populate it with your Firebase project credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## PWA Features

To fully test PWA features (offline support, service worker), it is recommended to create a production build and run it:

```bash
npm run build
npm run start
```
