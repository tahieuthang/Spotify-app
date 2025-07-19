export const replaceUrlImage = (url) => {
  const isAbsoluteUrl = /^https?:\/\/(www\.)?([\w-]+\.)+\w+/.test(url);
  const baseUrl = 'https://686e1a0ec9090c4953884654.mockapi.io';

  if (isAbsoluteUrl) {
    return url;
  }

  if (url.startsWith('/')) {
    return baseUrl.endsWith('/')
      ? baseUrl + url.slice(1)
      : baseUrl + url;
  }

  return baseUrl.endsWith('/')
    ? baseUrl + url
    : baseUrl + '/' + url;
};
