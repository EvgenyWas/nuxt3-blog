export default defineNuxtRouteMiddleware(() => {
  if (!useAuth().value.authorized) {
    return navigateTo('/', { redirectCode: 302 });
  }
});
