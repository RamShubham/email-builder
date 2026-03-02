import React, { createContext, useContext } from 'react';

const defaultUser = {
  sub: '',
  email: '',
  name: '',
  given_name: '',
  family_name: '',
};

const AuthContext = createContext({ user: defaultUser, token: '' });

function TinyCommandAuthController({ children, loginUrl, clientId, realm, serverUrl, assetServerUrl }: {
  children: React.ReactNode;
  loginUrl?: string;
  clientId?: string;
  realm?: string;
  serverUrl?: string;
  assetServerUrl?: string;
}) {
  return React.createElement(AuthContext.Provider, { value: { user: defaultUser, token: '' } }, children);
}

export function useAuth() {
  return useContext(AuthContext);
}

export default TinyCommandAuthController;
