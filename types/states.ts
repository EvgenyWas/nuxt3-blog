export interface AuthState {
  token: string;
  authorized: boolean;
}

export interface UserState {
  id: null | string;
  name: string;
  email: string;
  avatar?: string;
}
