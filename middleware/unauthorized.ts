export default defineNuxtRouteMiddleware(() => {
  if (useAuth().value.authorized) {
    return navigateTo('/profile');
  }
});
