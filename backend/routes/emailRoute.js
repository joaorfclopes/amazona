import express from "express";
import expressAsyncHandler from "express-async-handler";
import nodemailer from "nodemailer";
import { createOrder } from "../templates/createOrder.js";

const orderRouter = express.Router();

orderRouter.post(
  "/:id/createOrder",
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
        accessToken: process.env.MAILING_SERVICE_ACCESS_TOKEN,
      },
    });

    var mailOptions = {
      from: `${process.env.SENDER_USER_NAME} <${process.env.SENDER_EMAIL_ADDRESS}>`,
      to: req.body.userInfo.email,
      subject: `Order ${req.params.id} placed!`,
      html: createOrder,
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
