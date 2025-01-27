/// <reference types="vite/client" />
interface ImportMetaEnv {
  VITE_BACKEND_URL: string;
  VITE_SF_TARGET_URL: string;
  VITE_SF_ACCESS_TOKEN: string;
  VITE_AWS_DIR_NAME: string;
  VITE_AWS_REGION: string;
  VITE_AWS_ACCESS_KEY_ID: string;
  VITE_AWS_SECRET_ACCESS_KEY: string;
  VITE_AWS_BUCKET_NAME: string;
  VITE_STRIPE_PUBLISHABLE_KEY:string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
