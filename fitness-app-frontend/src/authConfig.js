export const authConfig = {
  clientId: 'oauth2-pkce-client',
  authorizationEndpoint: '${VITE_KEYCLOAK_URL}/realms/fitness-oauth2/protocol/openid-connect/auth',
  tokenEndpoint: '${VITE_KEYCLOAK_URL}/realms/fitness-oauth2/protocol/openid-connect/token',
  redirectUri: window.location.origin,
  scope: 'openid profile email offline_access',
  onRefreshTokenExpire: (event) => event.logIn(),
}
