export default () => ({
  lantmateriet: {
    consumerKey: process.env.LANTMATERIET_CONSUMER_KEY || '',
    consumerSecret: process.env.LANTMATERIET_CONSUMER_SECRET || '',
    useVerification: process.env.LANTMATERIET_USE_VERIFICATION !== 'false',
    addressApiUrl:
      process.env.LANTMATERIET_USE_VERIFICATION === 'false'
        ? 'https://api.lantmateriet.se/distribution/produkter/uppslag/adress/v3'
        : 'https://api-ver.lantmateriet.se/distribution/produkter/uppslag/adress/v3',
    tokenUrl:
      process.env.LANTMATERIET_USE_VERIFICATION === 'false'
        ? 'https://apimanager.lantmateriet.se/oauth2/token'
        : 'https://apimanager-ver.lantmateriet.se/oauth2/token',
  },
})
