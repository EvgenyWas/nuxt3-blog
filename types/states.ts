import type { Profile } from './user';

export interface UserState {
  profile: Profile;
  authorized: boolean;
}
