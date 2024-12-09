/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_CACHE_TIME: string;
  readonly VITE_SEND_DELAY: number;
  readonly VITE_BOT_APP: string;
  readonly VITE_SHARE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
