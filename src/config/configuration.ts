export default () => ({
  database: {
    URI_MONGO: process.env.URI_MONGO || '',
  },
  jwt: {
    SECRET: process.env.JWT_SECRET || '',
    EXPIRES_IN: process.env.EXPIRES_IN || '',
  },
});
