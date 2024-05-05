import { octokitOAuthApp } from '~/server/services';

export default defineEventHandler((event) => {
  return sendRedirect(event, octokitOAuthApp.getWebFlowAuthorizationUrl({ allowSignup: true }).url, 301);
});
