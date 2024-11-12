/// <reference types="vite/client" />
interface ImportMetaEnv {
  VITE_BACKEND_URL: string;
  VITE_SF_TARGET_URL: string;
  VITE_SF_ACCESS_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
