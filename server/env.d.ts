declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PORT?: string;
      PWD: string;
      GITHUB_CLIENT_SECRET: string;
      NUXT_PUBLIC_GITHUB_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      NUXT_PUBLIC_GOOGLE_CLIENT_ID: string;
      JWT_ACCESS_SECRET: string;
      JWT_REFRESH_SECRET: string;
    }
  }
}

export {};
