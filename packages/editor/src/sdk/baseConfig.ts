const MAIL_BASE_URL = process.env.REACT_APP_EMAIL_TEMPLATE_SERVER || '';

const getToken = () => {
  return typeof window !== 'undefined' ? window['accessToken'] : undefined;
};

const getMailSDKConfig = () => {
  return {
    url: MAIL_BASE_URL,
    token: getToken(),
    enable_encoding: ['PROD'].includes(process.env.REACT_APP_NODE_ENV || ''),
  };
};

export default getMailSDKConfig;
