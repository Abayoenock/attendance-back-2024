require("dotenv").config()
const EmailTemplate = (Name, message, latitude, longitude) => {
  const mapUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&output=embed`
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html dir="ltr" lang="en">        
      <head>
      <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
      </head>
      
      <body style="background-color:#f6f9fc;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif">
      <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:100%;background-color:#ffffff;margin:0 auto;padding:20px 0 48px;margin-bottom:64px">
      <tbody>
      <tr style="width:100%">
      <td>
      <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="padding:0 48px">
      <tbody>
      <tr>
      <td><span style="font-weight:bold; margin-left:20px;margin-top:30px;">${process.env.APPNAME}</span>
      <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#e6ebf1;margin:20px 0" />
      <p style="font-size:16px;line-height:24px;margin:16px 0;color:#525f7f;text-align:left">Hello  ${Name},</p>
      
      <p style="font-size:16px;line-height:24px;margin:16px 0;color:#525f7f;text-align:left">
    ${message}
      </p>
      
      <iframe
        width="100%"
        height="350"
        style="border:0; padding:4px;"
        src="${mapUrl}"
        allowfullscreen>
      </iframe>
     
      <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#e6ebf1;margin:20px 0" />
      
      </td>
      </tr>
      </tbody>
      </table>
      </td>
      </tr>
      </tbody>
      </table>
      </body>
      </html>`
}

module.exports = EmailTemplate
