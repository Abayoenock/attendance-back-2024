require("dotenv").config()
const passwordResetEmail = (Name, link) => {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html dir="ltr" lang="en">
    <head>
      <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
      <style>
        body {
          background-color: #f6f9fc;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif;
        }
        .container {
          max-width: 100%;
          background-color: #ffffff;
          margin: 0 auto;
          padding: 20px 0 48px;
          margin-bottom: 64px;
        }
        .content {
          padding: 0 48px;
        }
        .header {
          font-weight: bold;
          margin-left: 20px;
          margin-top: 30px;
        }
        .divider {
          width: 100%;
          border: none;
          border-top: 1px solid #eaeaea;
          border-color: #e6ebf1;
          margin: 20px 0;
        }
        .text {
          font-size: 16px;
          line-height: 24px;
          margin: 16px 0;
          color: #525f7f;
          text-align: left;
        }
        .button {
          background-color: #221b16;
          border-radius: 5px;
          color: white;
          font-size: 16px;
          font-weight: bold;
          text-decoration: none;
          text-align: center;
          display: inline-block;
          width: fit;
          padding: 10px;
          line-height: 100%;
          max-width: 100%;
        }
        .button span {
          max-width: 100%;
          display: inline-block;
          line-height: 120%;
          mso-padding-alt: 0px;
          mso-text-raise: 7.5px;
          color: white;
        }
      </style>
    </head>
    <body>
      <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" class="container">
        <tbody>
          <tr style="width:100%">
            <td>
              <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" class="content">
                <tbody>
                  <tr>
                    <td>
                      <span class="header">${process.env.APPNAME}</span>
                      <hr class="divider" />
                      <p class="text">Hello ${Name},</p>
                      <p class="text">
                        You have requested for a password reset. To reset the password, click on the link below.<br>
                        If you did not request for a password reset, ignore this message.
                      </p>
                      <a href=${link} class="button" target="_blank">
                        <span>Reset password</span>
                      </a>
                      <hr class="divider" />
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

module.exports = passwordResetEmail
