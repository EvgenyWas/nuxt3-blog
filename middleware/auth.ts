export default defineNuxtRouteMiddleware(() => {
  if (!useUser().value.authorized) {
    return navigateTo('/login', { redirectCode: 403 });
  }
});
