import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fitzone.app',
  appName: 'FitZone',
  // The web layer is the frontend-users React build. `npm run copy:web` copies
  // frontend-users/dist into ./www, which Capacitor then syncs into the native
  // projects. Keeping a single `www` (inside this project) avoids cross-folder
  // webDir issues and keeps one UI codebase in frontend-users.
  webDir: 'www',
};

export default config;
