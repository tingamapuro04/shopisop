// implement daraja api for mpesa payments
import axios from "axios";

const daraja = axios.create({
  baseURL: "https://sandbox.safaricom.co.ke",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.DARAJA_ACCESS_TOKEN}`,
  },
});

export default daraja;  