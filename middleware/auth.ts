export default defineNuxtRouteMiddleware(() => {
  if (!useAuth().value.authorized) {
    return navigateTo('/login', { redirectCode: 302 });
  }
});
