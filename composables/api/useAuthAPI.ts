import type { FetchOptions } from 'ofetch';
import type { LoginResponse, SignupResponse } from '~/types/responses';

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
  const loginWithEmailAndPassword = (options: LoginOptions) =>
    $fetch<LoginResponse>('/api/auth/login', { ...options, method: 'POST' });

  const signupWithEmailAndPassword = (options: SignupOptions) =>
    $fetch<SignupResponse>('/api/auth/signup', { ...options, method: 'POST' });

  return { loginWithEmailAndPassword, signupWithEmailAndPassword };
}
