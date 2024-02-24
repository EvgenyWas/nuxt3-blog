export const useAuth = () => useState('auth', () => ({ token: '', authorized: false }));
