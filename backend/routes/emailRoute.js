import express from "express";
import expressAsyncHandler from "express-async-handler";
import nodemailer from "nodemailer";
import { placedOrder } from "../mailing/placedOrder.js";
import { formatDate } from "../utils.js";

const orderRouter = express.Router();

orderRouter.post(
  "/placedOrder",
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
