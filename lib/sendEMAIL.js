const nodemailer = require("nodemailer")
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
})

const sendEmail = async (from, to, subject, html) => {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: from,
    to: to,
    subject: subject,
    // text: "Hello world?", // plain text body
    html: html,
  })

  console.log("Message sent: %s", info.messageId)
}

module.exports = sendEmail
