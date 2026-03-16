const SOCKET_LOGGING_ENABLED = process.env.NODE_ENV === 'development';

const safeStringify = (data) => {
  try {
    return JSON.stringify(data, null, 2);
  } catch (e) {
    return '[Unable to stringify - circular reference or complex object]';
  }
};

const formatSocketLog = (direction, event, data) => {
  const timestamp = new Date().toISOString();
  const arrow = direction === 'out' ? '→ OUTGOING' : '← INCOMING';
  const color = direction === 'out' ? 'color: #2563eb' : 'color: #16a34a';

  console.groupCollapsed(
    `%c[SOCKET ${arrow}] ${timestamp} | ${event}`,
    `${color}; font-weight: bold;`,
  );
  console.log('Event:', event);
  console.log('Payload:', safeStringify(data));
  console.log('Raw:', data);
  console.groupEnd();
};


export const createLoggedSocket = (rawSocket) => {

  if (!SOCKET_LOGGING_ENABLED) return rawSocket;

  const listenerMap = [];

  const originalEmit = rawSocket.emit.bind(rawSocket);
  rawSocket.emit = (event, ...args) => {
    formatSocketLog('out', event, args.length === 1 ? args[0] : args);
    return originalEmit(event, ...args);
  };

  const originalOn = rawSocket.on.bind(rawSocket);
  const originalOff = rawSocket.off.bind(rawSocket);

  rawSocket.on = (event, callback) => {
    const wrapper = (...args) => {
      formatSocketLog('in', event, args.length === 1 ? args[0] : args);
      callback(...args);
    };
    listenerMap.push({ event, callback, wrapper });
    return originalOn(event, wrapper);
  };

  rawSocket.off = (event, callback) => {
    if (callback === undefined) {
      const toRemove = listenerMap.filter((e) => e.event === event);
      toRemove.forEach((e) => originalOff(event, e.wrapper));
      for (let i = listenerMap.length - 1; i >= 0; i--) {
        if (listenerMap[i].event === event) listenerMap.splice(i, 1);
      }
      if (toRemove.length === 0) originalOff(event);
      return rawSocket;
    }
    const entry = listenerMap.find(
      (e) => e.event === event && e.callback === callback,
    );
    if (entry) {
      originalOff(event, entry.wrapper);
      const idx = listenerMap.indexOf(entry);
      if (idx !== -1) listenerMap.splice(idx, 1);
    } else {
      originalOff(event, callback);
    }
    return rawSocket;
  };

  return rawSocket;
};