import type { AuthState } from './states';
import type { Profile } from './user';

export interface SignupResponse {
  token: AuthState['token'];
  profile: Profile;
}

export type LoginResponse = SignupResponse;

export type TokenRefreshResponse = Pick<AuthState, 'token'>;

export type WhoamiResponse = Profile;
