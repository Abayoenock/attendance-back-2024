const axios = require("axios")

const sendSMS = async (sms, phone, senderID) => {
  const data = {
    to: phone,
    from: senderID,
    unicode: "0",
    sms: sms,
    action: "send-sms",
  }

  const settings = {
    method: "POST",
    url: "https://api.mista.io/sms",
    headers: {
      "x-api-key": process.env.SMS_API_KEY,
      "Content-Type": "application/json",
    },
    data: data,
  }

  try {
    const response = await axios(settings)
    console.log(response.data)
  } catch (error) {
    console.error("Error sending SMS:", error)
  }
}

module.exports = sendSMS
