/// <reference types="vite/client" />

declare module '*.css?inline' {
  const css: string;
  export default css;
}

interface ImportMetaEnv {
  readonly VITE_GEO_IP_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
