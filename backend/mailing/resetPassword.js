export const resetPassword = (userId) => {
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Reset Password Email</title>
      </head>
      <body>
        <a
        href="${
          process.env.HOME_PAGE || "http://localhost:3000"
        }/resetPassword/${userId}"
        style="color: #0770cf; text-decoration: underline; word-break: break-all"
        target="_blank"
      >
        <font
          face="'FuturaPTBook-Reg', Futura, Arial, sans-serif"
          style="word-break: break-all"
        >
        Reset Password
        </font>
      </a>
      </body>
    </html>`;
};
