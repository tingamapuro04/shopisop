const axios = require("axios");

const getAccessToken = async () => {
  const { MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET, NODE_ENV } = process.env;

  const baseURL =
    NODE_ENV === "production"
      ? "https://api.safaricom.co.ke"
      : "https://sandbox.safaricom.co.ke";

  const credentials = Buffer.from(
    `${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`,
  ).toString("base64");

  const response = await axios.get(
    `${baseURL}/oauth/v1/generate?grant_type=client_credentials`,
    {
      headers: { Authorization: `Basic ${credentials}` },
    },
  );

  return response.data.access_token;
};

module.exports = { getAccessToken };
