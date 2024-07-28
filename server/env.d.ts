declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PORT?: string;
      PWD: string;
      NUXT_GITHUB_CLIENT_SECRET: string;
      NUXT_GITHUB_CLIENT_ID: string;
      NUXT_GOOGLE_CLIENT_SECRET: string;
      NUXT_GOOGLE_CLIENT_ID: string;
      NUXT_JWT_ACCESS_SECRET: string;
      NUXT_JWT_REFRESH_SECRET: string;
    }
  }
}

export {};
