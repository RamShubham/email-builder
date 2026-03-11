import { useEffect } from 'react';
import { io } from 'socket.io-client';

import { createLoggedSocket } from '../../ICStudioContext/createLoggedSocket';

const useSocket = ({ authenticated, assetServerUrl, logout, sessionId }) => {
  useEffect(() => {
    if (!authenticated || !assetServerUrl) return;
    const rawSocket = io(assetServerUrl, {
      transports: ['websocket', 'webtransport', 'polling'],
      query: {
        token: window.accessToken,
      },
    });
    const socket = createLoggedSocket(rawSocket);

    socket.on('user_logged_out', (msg = {}) => {
      const eventSessionId = msg.session_id;
      if (!eventSessionId) {
        return;
      }
      if (sessionId && eventSessionId !== sessionId) {
        return;
      }
      logout(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [authenticated, assetServerUrl, logout, sessionId]);
};

export default useSocket;
