import type { FetchOptions } from 'ofetch';
import type { LoginResponse, SignupResponse, TokenRefreshResponse } from '~/types/responses';

interface LoginOptions extends FetchOptions {
  body: {
    email: string;
    password: string;
  };
}

interface SignupOptions extends FetchOptions {
  body: {
    email: string;
    name: string;
    password: string;
  };
}

export default function useAuthAPI() {
  const headers = useRequestHeaders();
  const event = useRequestEvent();

  const loginWithEmailAndPassword = (options: LoginOptions) =>
    $fetch<LoginResponse>('/api/auth/login', { ...options, method: 'POST' });

  const signupWithEmailAndPassword = (options: SignupOptions) =>
    $fetch<SignupResponse>('/api/auth/signup', { ...options, method: 'POST' });

  const refreshAccessToken = (options = {} as FetchOptions) =>
    fetchWithCookie<TokenRefreshResponse>(event, '/api/auth/token/refresh', {
      headers,
      ...options,
      method: 'POST',
    });

  return { loginWithEmailAndPassword, signupWithEmailAndPassword, refreshAccessToken };
}
