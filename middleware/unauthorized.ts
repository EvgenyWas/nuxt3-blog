export default defineNuxtRouteMiddleware(() => {
  if (useUser().value.authorized) {
    return navigateTo('/profile');
  }
});
