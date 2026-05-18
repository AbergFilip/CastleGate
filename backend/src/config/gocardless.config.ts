export default () => ({
  gocardless: {
    secretId: process.env.GOCARDLESS_SECRET_ID,
    secretKey: process.env.GOCARDLESS_SECRET_KEY,
  },
});
