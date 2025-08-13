import { useKeycloak } from '@react-keycloak/web';
import { formatDisplayName } from '../utils/formatName';

export const useAuth = () => {
  const { keycloak, initialized } = useKeycloak();

  const user = keycloak.authenticated
    ? {
        id: keycloak.tokenParsed?.sub || '',
        email: keycloak.tokenParsed?.email || '',
        name: formatDisplayName(
          keycloak.tokenParsed?.name ||
          keycloak.tokenParsed?.preferred_username ||
          ''
        ),
      }
    : null;

  const login = () => {
    keycloak.login({
      redirectUri: window.location.origin + '/auth',
    });
  };

  const logout = () => {
    keycloak.logout({
      redirectUri: window.location.origin,
    });
  };

  const getToken = async () => {
    await keycloak.updateToken(30);
    return keycloak.token;
  };

  const updateToken = async () => {
    await keycloak.updateToken(30);
  };

  return {
    user,
    isLoading: !initialized,
    isAuthenticated: keycloak.authenticated,
    login,
    logout,
    getToken,
    updateToken,
    keycloak, // Export keycloak instance for advanced usage
  };
};
