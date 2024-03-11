import type { Profile } from './user';

export interface AuthState {
  token: string;
  authorized: boolean;
}

export interface UserState extends Profile {}
