/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string
  readonly VITE_FIREBASE_AUTH_DOMAIN: string
  readonly VITE_FIREBASE_PROJECT_ID: string
  readonly VITE_FIREBASE_STORAGE_BUCKET: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string
  readonly VITE_FIREBASE_APP_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare const __FIREBASE_API_KEY__: string;
declare const __FIREBASE_AUTH_DOMAIN__: string;
declare const __FIREBASE_PROJECT_ID__: string;
declare const __FIREBASE_STORAGE_BUCKET__: string;
declare const __FIREBASE_MESSAGING_SENDER_ID__: string;
declare const __FIREBASE_APP_ID__: string;
