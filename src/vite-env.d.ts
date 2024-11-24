/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_CACHE_TIME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
