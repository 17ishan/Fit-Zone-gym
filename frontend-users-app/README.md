# FitZone App (mobile)

Capacitor shell that packages the **`frontend-users`** React site as a native
Android/iOS app. There is **one UI codebase** — this folder only holds the native
projects and the Capacitor config; it pulls in the user site's production build.

- `appId`: `com.fitzone.app`
- `appName`: `FitZone`
- Web layer: `../frontend-users` (built to `dist`, copied here into `www`)
- Backend: same Spring Boot API as the web apps

## How the web build gets in

`npm run copy:web` copies `../frontend-users/dist` → `./www` (Capacitor's `webDir`),
then `cap sync` pushes `www` into `android/` and `ios/`.

## Commands (run from this `frontend-users-app/` folder)

| Command | What it does |
| --- | --- |
| `npm install` | Install Capacitor CLI + native platform packages |
| `npm run build` | Build `frontend-users`, copy into `www`, then `cap sync` |
| `npm run sync` | Copy the existing `frontend-users/dist` into `www`, then `cap sync` |
| `npm run open:android` | Open the project in Android Studio |
| `npm run open:ios` | Open the project in Xcode (macOS only) |
| `npm run run:android` | Build + run on a connected device/emulator |

## First-time setup

```bash
cd frontend-users-app
npm install
npm run build          # builds the web app and syncs into the native projects
npm run open:android   # then Run ▶ from Android Studio
```

Requirements: **Android** — Android Studio + JDK 17 (works on Windows).
**iOS** — a Mac with Xcode + CocoaPods (`pod install` is skipped on Windows).

## API base URL note

The app loads the bundled web build, so requests to `http://localhost:8080` won't
work from a phone/emulator — `localhost` there is the device, not your PC. Point
the user frontend at your machine's LAN IP (e.g. `http://192.168.x.x:8080`) or a
deployed backend URL when building for a real device, and make sure that origin is
in the backend's `CORS_ALLOWED_ORIGINS`.
