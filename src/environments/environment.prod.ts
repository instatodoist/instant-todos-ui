export const environment = {
  production: true,
  API_URL: process.env.APP_GQL_URL || 'https://instatodo.herokuapp.com/graphql',
  versionUrl: process.env.APP_VERSION_URL || 'https://instatodos.netlify.app/version.json',
  GTAG_ID: process.env.APP_GTAG_ID
};
