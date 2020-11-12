export const createOrder = ({ userName, orderId, orderDate }) => {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml" lang="en-GB">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>Email</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
      <style type="text/css">
        a[x-apple-data-detectors] {
          color: inherit !important;
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0">
      <table
        role="presentation"
        border="0"
        cellpadding="0"
        cellspacing="0"
        width="100%"
      >
        <tr>
          <td style="padding: 20px 0 30px 0">
            <table
              align="center"
              border="0"
              cellpadding="0"
              cellspacing="0"
              width="600"
              style="border-collapse: collapse; border: 1px solid #cccccc"
            >
              <tr>
                <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px">
                  <table
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    width="100%"
                    style="border-collapse: collapse"
                  >
                    <tr>
                      <td
                        style="
                          color: #153643;
                          font-family: Arial, sans-serif;
                          text-align: center;
                        "
                      >
                        <h1
                          style="
                            font-size: 24px;
                            margin: 0;
                            text-transform: uppercase;
                          "
                        >
                          We've sent it!
                        </h1>
                        <p>
                          Hi ${userName}, your order its on its way and it should
                          be with you soon
                        </p>
                        <p>
                          Order No.: ${orderId}<br />
                          Order date: ${orderDate}
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>  
  `;
};
