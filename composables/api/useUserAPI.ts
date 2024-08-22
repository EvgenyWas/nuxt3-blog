import type { FetchOptions } from 'ofetch';
import type { WhoamiResponse } from '~/types/responses';
import type { FavouriteArticle, Profile } from '~/types/user';

interface UpdateProfileOptions extends FetchOptions {
  body: Omit<Profile, 'id' | 'email'>;
}

interface UpdateProfileAvatarOptions extends FetchOptions {
  body: FormData;
}

interface RemoveFavouriteArticleOptions extends FetchOptions {
  body: Pick<FavouriteArticle, 'path'>;
}

interface AddFavouriteArticleOptions extends FetchOptions {
  body: FavouriteArticle;
}

const SOURCE_FETCH_OPTIONS: FetchOptions = {
  retry: 1,
  retryStatusCodes: [401, 408, 409, 425, 429, 500, 502, 503, 504],
};

export default function useUserAPI() {
  const token = useToken();
  const user = useUser();
  const { refreshAccessToken } = useAuthAPI();
  const headers = useRequestHeaders();
  const event = useRequestEvent();

  const defaultOptions: FetchOptions = {
    ...SOURCE_FETCH_OPTIONS,
    headers,
    onRequest({ options }) {
      options.headers = new Headers(options.headers || {});
      if (token.value) {
        options.headers.set('Authorization', `Bearer ${token.value}`);
      } else {
        options.headers.delete('Authorization');
      }
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
        try {
          const { accessToken } = await refreshAccessToken();
          token.value = accessToken;
          user.value.authorized = true;
        } catch (error) {
          token.value = '';
          user.value.authorized = false;
        }
      }
    },
  };

  const fetchWhoami = (options: FetchOptions = {}) =>
    fetchWithCookie<WhoamiResponse>(event, '/api/user/whoami', { ...defaultOptions, ...options, method: 'GET' });

  const updateProfile = (id: string, options: UpdateProfileOptions) =>
    $fetch<Profile>(`/api/user/${id}/profile`, { ...defaultOptions, ...options, method: 'PUT' });

  const updateProfileAvatar = (id: string, options: UpdateProfileAvatarOptions) =>
    $fetch<string>(`/api/user/${id}/profile/avatar`, { ...defaultOptions, ...options, method: 'PUT' });

  const removeFavouriteArticle = (id: string, options: RemoveFavouriteArticleOptions) =>
    $fetch<boolean>(`/api/user/${id}/favourites`, { ...defaultOptions, ...options, method: 'DELETE' });

  const addFavouriteArticle = (id: string, options: AddFavouriteArticleOptions) =>
    $fetch<FavouriteArticle>(`/api/user/${id}/favourites`, { ...defaultOptions, ...options, method: 'PUT' });

  const fetchFavouriteArticles = (id: string, options: FetchOptions = {}) =>
    $fetch<{ favourites: Array<FavouriteArticle> }>(`/api/user/${id}/favourites`, {
      ...defaultOptions,
      ...options,
      method: 'GET',
    });

  return {
    fetchWhoami,
    updateProfile,
    updateProfileAvatar,
    removeFavouriteArticle,
    addFavouriteArticle,
    fetchFavouriteArticles,
  };
}
