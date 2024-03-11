import { AUTH_SCOPES } from '~/configs/properties';

export interface UserIdentity {
  id: string;
  scope: AUTH_SCOPES;
}
