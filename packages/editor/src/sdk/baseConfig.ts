const MAIL_BASE_URL = process.env.REACT_APP_EMAIL_TEMPLATE_SERVER || '';

const getToken = () => {
  return typeof window !== 'undefined' ? window['accessToken'] : undefined;
};

const getMailSDKConfig = () => {
  return {
    url: MAIL_BASE_URL,
    token: getToken(),
    enable_encoding: ['production'].includes(process.env.NODE_ENV || ''),
  };
};

export default getMailSDKConfig;
