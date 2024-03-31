import type { AuthState } from './states';
import type { Profile } from './user';

export interface SignupResponse {
  token: AuthState['token'];
  profile: Profile;
}

export type LoginResponse = SignupResponse;

export interface TokenRefreshResponse {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresIn: number;
  type: string;
}

export type WhoamiResponse = Profile;
