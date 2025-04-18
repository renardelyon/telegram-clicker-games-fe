/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_CACHE_TIME: string;
  readonly VITE_SEND_DELAY: number;
  readonly VITE_BOT_APP: string;
  readonly VITE_SHARE_URL: string;
  readonly VITE_TWITTER_USERNAME: string;
  readonly VITE_TELEGRAM_GROUP_LINK: string;
  readonly VITE_TIKTOK_USERNAME: string;
  readonly VITE_CHAIN_CLUSTER: string;
  readonly VITE_APP_URL: string;
  readonly VITE_WALLET_WEBHOOK: string;
  readonly VITE_TARGET_MINT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
