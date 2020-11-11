import express from "express";
import expressAsyncHandler from "express-async-handler";
import nodemailer from "nodemailer";

const orderRouter = express.Router();

orderRouter.post(
  "/",
  expressAsyncHandler((req, res) => {
    //Turn On less secure app access
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.SENDER_EMAIL_ADDRESS,
        clientId: process.env.MAILING_SERVICE_CLIENT_ID,
        clientSecret: process.env.MAILING_SERVICE_CLIENT_SECRET,
        refreshToken: process.env.MAILING_SERVICE_REFRESH_TOKEN,
      },
    });

    var text = `Hello world ${req.body.userInfo.name}!`;

    var mailOptions = {
      from: '"Joao Lopes" <joaorfclopes@gmail.com>',
      to: req.body.userInfo.email,
      subject: "Email Example",
      text: text,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.send({ yo: "error" });
        console.log(error);
      } else {
        res.send({ yo: info.response });
      }
    });
  })
);

export default orderRouter;
