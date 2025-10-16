

const config = {
  development: {
    BASE_URL: "http://localhost:3000",
    ENV: "development",
    VERSION:"v1/"
  },
  testing: {
    BASE_URL: "https://372w16mm-3000.inc1.devtunnels.ms/api/",
    ENV: "testing",
    VERSION:"v1/"
  },
  production: {
    BASE_URL: "https://pay.bull8.ai/api/",
    ENV: "production",
    VERSION:"v1/"
  },
};

 export const apiConfig=config.testing;  


