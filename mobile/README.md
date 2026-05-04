# SwiftDrop Mobile (Expo)

This folder contains the React Native app target for the existing SwiftDrop project.

## Quick Start

1. Copy `.env.example` to `.env` and set `EXPO_PUBLIC_API_BASE_URL`.
2. Install dependencies:
   - `npm install`
3. Start Expo:
   - `npm run start`
4. Run on device or simulator using the Expo menu.

## Backend URL Notes

Use the backend URL that your emulator/device can reach:

- Android emulator: `http://10.0.2.2:4000`
- iOS simulator: `http://localhost:4000`
- Physical device: `http://<your-machine-lan-ip>:4000`

## What Is Ported

- Shared domain types
- API contract/mapping helpers
- App state context with persisted auth user (AsyncStorage)
- Starter navigation shell (Splash, Login, Home, Orders, Profile)

## Migration Plan

Move each web screen from `src/pages` into `mobile/src/screens` and replace web-only APIs:

- `react-router-dom` -> React Navigation
- `localStorage` -> AsyncStorage
- HTML/CSS/Tailwind -> React Native Views and StyleSheet
- `import.meta.env` -> `process.env.EXPO_PUBLIC_*`

## Important

The web app remains intact. Mobile is additive and can be migrated screen-by-screen.
