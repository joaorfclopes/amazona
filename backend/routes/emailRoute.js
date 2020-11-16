import express from "express";
import expressAsyncHandler from "express-async-handler";
import nodemailer from "nodemailer";
import { placedOrder } from "../mailing/placedOrder.js";
import { isAuth, formatDate } from "../utils.js";

const emailRouter = express.Router();

const sendEmail = (res, mailOptions) => {
  const transporter = nodemailer.createTransport({
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

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.send({ yo: "error" });
      console.log(error);
    } else {
      res.send({ yo: info.response });
    }
  });
};

emailRouter.post(
  "/placedOrder",
  isAuth,
  expressAsyncHandler((req, res) => {
    const mailOptions = {
      from: `${process.env.SENDER_USER_NAME} <${process.env.SENDER_EMAIL_ADDRESS}>`,
      to: req.body.userInfo.email,
      subject: "Your order's on its way!",
      html: placedOrder({
        userInfo: {
          userName: req.body.userInfo.name,
        },
        order: {
          orderId: req.body.order._id,
          orderDate: formatDate(req.body.order.createdAt),
          shippingAddress: {
            fullName: req.body.order.shippingAddress.fullName,
            address: req.body.order.shippingAddress.address,
            country: req.body.order.shippingAddress.country,
            postalCode: req.body.order.shippingAddress.postalCode,
            city: req.body.order.shippingAddress.city,
          },
          orderItems: req.body.order.orderItems,
          itemsPrice: req.body.order.itemsPrice,
          shippingPrice: req.body.order.shippingPrice,
          totalPrice: req.body.order.totalPrice,
        },
      }),
    };
    sendEmail(res, mailOptions);
  })
);

emailRouter.post(
  "/forgotPassword",
  expressAsyncHandler((req, res) => {
    const mailOptions = {
      from: `${process.env.SENDER_USER_NAME} <${process.env.SENDER_EMAIL_ADDRESS}>`,
      to: req.body.email,
      subject: `Your ${process.env.BRAND_NAME} password reset link is ready`,
      html: `<h1>Reset Password</h1>`,
    };
    sendEmail(res, mailOptions);
  })
);

export default emailRouter;
