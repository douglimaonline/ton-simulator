// Define the type of the environment variables.
declare interface Env {
  readonly NG_APP_PUBLIC_FIREBASE_API_KEY: string;
  readonly NG_APP_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
  readonly NG_APP_PUBLIC_FIREBASE_PROJECT_ID: string;
  readonly NG_APP_PUBLIC_FIREBASE_STORAGE_BUCKET: string;
  readonly NG_APP_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly NG_APP_PUBLIC_FIREBASE_APP_ID: string;
}

// 1. Use import.meta.env.YOUR_ENV_VAR in your code. (conventional)
declare interface ImportMeta {
  readonly env: Env;
}
