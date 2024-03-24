import { AUTH_PROVIDERS } from '~/configs/properties';

export interface UserIdentity {
  id: string;
  provider: AUTH_PROVIDERS;
}
