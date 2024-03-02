import type { AuthState, UserState } from '~/types/states';

export const useAuth = () => useState<AuthState>('auth', () => ({ token: '', authorized: false }));

export const useUser = () => useState<UserState>('user', () => ({ id: null, name: '', email: '' }));
