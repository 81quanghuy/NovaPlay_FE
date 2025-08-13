import ReactDOM from 'react-dom/client';
import './styles/tailwind.css';
import './styles/animations.css';

import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak from '@services/keycloak';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/index';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ReactKeycloakProvider
    authClient={keycloak}
    initOptions={{
      onLoad: 'check-sso',
      pkceMethod: 'S256'
    }}
  >
    <RouterProvider router={router} />
  </ReactKeycloakProvider>
);
