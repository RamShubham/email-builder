import axios from 'axios';

  const baseConfig = axios.create({
    baseURL: typeof window !== 'undefined' ? window.location.origin : '',
    timeout: 30000,
    headers: { 'Content-Type': 'application/json' },
  });

  export default baseConfig;
  