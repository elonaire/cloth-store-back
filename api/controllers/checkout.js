const makePayment = async (req, res, next) => {
  let data = req.body;
  var Axios = require("axios"),
    // var request = require("request"),
    consumer_key = process.env.MPESA_API_CONSUMER_KEY,
    consumer_secret = process.env.MPESA_API_CONSUMER_SECRET,
    url =
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    auth =
      "Basic " +
      Buffer.from(consumer_key + ":" + consumer_secret).toString("base64");
  console.log("auth", auth);

  const headers1 = {
    headers: { Authorization: auth },
  };

  try {
    let tokenResponse = await Axios({
      url,
      method: "get",
      headers: headers1.headers,
    });

    if (tokenResponse) {
      console.log(tokenResponse);
      let accessToken = tokenResponse.data;

      const headers2 = {
        headers: { Authorization: `Bearer ${accessToken.access_token}` },
      };
      const paymentUrl =
        "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

      let formatDate = (n) => {
        return n < 10 ? "0" + n : n;
      };

      let date = new Date();

      const currentTimeStamp =
        date.getFullYear().toString() +
        formatDate(date.getMonth() + 1) +
        formatDate(date.getDate()) +
        formatDate(date.getHours()) +
        formatDate(date.getMinutes()) +
        formatDate(date.getSeconds());

      const paymentRequestBody = {
        BusinessShortCode: process.env.BUSINESS_SHORTCODE,
        Password: `${process.env.MPESA_INITIATOR_PASS}`,
        Timestamp: `${currentTimeStamp}`,
        TransactionType: "CustomerPayBillOnline",
        Amount: "4000",
        PartyA: "254704730039",
        PartyB: "174379",
        PhoneNumber: "254704730039",
        CallBackURL: "http://127.0.0.1:4000/callback",
        AccountReference: " ",
        TransactionDesc: "Payment for goods",
      };

      let paymentResponse = await Axios({
        url: paymentUrl,
        method: "post",
        data: paymentRequestBody,
        headers: headers2.headers,
      });

      res.status(200).json(paymentResponse);
    }
  } catch (error) {
    console.log("err", error);
  }
};

module.exports = {
  makePayment,
};
