import { Auth0Provider } from '@auth0/auth0-react';

function MyApp({ Component, pageProps }) {
  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}
      authorizationParams={{
        
        redirect_uri: typeof window !== 'undefined' ? window.location.origin : undefined
      }}
    >
        {/*ここにコンポーネントを加える */}
      
    </Auth0Provider>
  );
}

export default MyApp;