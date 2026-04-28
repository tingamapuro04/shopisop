const axios = require("axios");
const { getAccessToken } = require("./auth");

const initiateSTKPush = async ({orderId}) => {
  const { MPESA_SHORTCODE, MPESA_PASSKEY, MPESA_CALLBACK_URL, NODE_ENV } =
    process.env;

  const baseURL =
    NODE_ENV === "production"
      ? "https://api.safaricom.co.ke"
      : "https://sandbox.safaricom.co.ke";

  // Generate timestamp: YYYYMMDDHHmmss
  const timestamp = new Date()
    .toISOString()
    .replace(/[-T:.Z]/g, "")
    .slice(0, 14);

  // Password = Base64(Shortcode + Passkey + Timestamp)
  const password = Buffer.from(
    `${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`,
  ).toString("base64");

  // Phone must be in 2547XXXXXXXX format
  //const formattedPhone = phone.startsWith("0") ? `254${phone.slice(1)}` : phone;

  const accessToken = await getAccessToken();

  const response = await axios.post(
    `${baseURL}/mpesa/stkpush/v1/processrequest`,
    {
      BusinessShortCode: MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: 1, // M-Pesa requires whole numbers
      PartyA: "254746651907", // Customer phone
      PartyB: MPESA_SHORTCODE,
      PhoneNumber: "254746651907",
      CallBackURL: MPESA_CALLBACK_URL,
      AccountReference: `Order-${orderId}`,
      TransactionDesc: `Payment for Order ${orderId}`,
    },
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  return response.data;
  // Returns: { MerchantRequestID, CheckoutRequestID, ResponseCode, ResponseDescription }
};

module.exports = { initiateSTKPush };
