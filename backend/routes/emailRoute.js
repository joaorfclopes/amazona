import express from "express";
import expressAsyncHandler from "express-async-handler";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import { isAuth, formatDate, isAdmin } from "../utils.js";
import { newUser } from "../mailing/newUser.js";
import { placedOrder } from "../mailing/placedOrder.js";
import { placedOrderAdmin } from "../mailing/placedOrderAdmin.js";
import { deliveredOrder } from "../mailing/deliveredOrder.js";
import { resetPassword } from "../mailing/resetPassword.js";
import { cancelOrder } from "../mailing/cancelOrder.js";
import { cancelOrderAdmin } from "../mailing/cancelOrderAdmin.js";

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
  "/userCreated",
  expressAsyncHandler(async (req, res) => {
    const mailOptions = {
      from: `${process.env.SENDER_USER_NAME} <${process.env.SENDER_EMAIL_ADDRESS}>`,
      to: req.body.userInfo.email,
      subject: "Thanks for joining us!",
      html: newUser({
        userInfo: {
          userName: req.body.userInfo.name,
        },
      }),
    };
    sendEmail(res, mailOptions);
  })
);

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
  "/placedOrderAdmin",
  isAuth,
  expressAsyncHandler((req, res) => {
    const mailOptions = {
      from: `${process.env.SENDER_USER_NAME} <${process.env.SENDER_EMAIL_ADDRESS}>`,
      to: process.env.SENDER_EMAIL_ADDRESS,
      subject: "A new order was placed!",
      html: placedOrderAdmin({
        userInfo: {
          email: req.body.userInfo.email,
          phoneNumber: req.body.userInfo.phoneNumber,
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
  "/deliveredOrder",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    if (req.body.order.user) {
      const user = await User.findById(req.body.order.user);
      try {
        const mailOptions = {
          from: `${process.env.SENDER_USER_NAME} <${process.env.SENDER_EMAIL_ADDRESS}>`,
          to: user.email,
          subject: "Thanks for your order!",
          html: deliveredOrder({
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
      } catch (error) {
        res.status(404).send({ message: "Order doesn't exist" });
      }
    } else {
      res.status(404).send({ message: "Error delivering order" });
    }
  })
);

emailRouter.post(
  "/cancelOrder",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    if (req.body.order.user) {
      const user = await User.findById(req.body.order.user);
      try {
        const mailOptions = {
          from: `${process.env.SENDER_USER_NAME} <${process.env.SENDER_EMAIL_ADDRESS}>`,
          to: user.email,
          subject: "Order Canceled!",
          html: cancelOrder({
            userInfo: {
              userName: req.body.userInfo.name,
            },
            order: {
              orderId: req.body.order._id,
              orderDate: formatDate(req.body.order.createdAt),
              orderItems: req.body.order.orderItems,
              itemsPrice: req.body.order.itemsPrice,
              shippingPrice: req.body.order.shippingPrice,
              totalPrice: req.body.order.totalPrice,
            },
          }),
        };
        sendEmail(res, mailOptions);
      } catch (error) {
        res.status(404).send({ message: "Order doesn't exist" });
      }
    } else {
      res.status(404).send({ message: "Error cancelling order" });
    }
  })
);

emailRouter.post(
  "/cancelOrderAdmin",
  isAuth,
  expressAsyncHandler((req, res) => {
    const mailOptions = {
      from: `${process.env.SENDER_USER_NAME} <${process.env.SENDER_EMAIL_ADDRESS}>`,
      to: process.env.SENDER_EMAIL_ADDRESS,
      subject: "Refund Request",
      html: cancelOrderAdmin({
        userInfo: {
          userName: req.body.userInfo.name,
          email: req.body.userInfo.email,
          phoneNumber: req.body.userInfo.phoneNumber,
        },
        order: {
          orderId: req.body.order._id,
          orderDate: formatDate(req.body.order.createdAt),
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
  expressAsyncHandler(async (req, res) => {
    if (req.body.email) {
      const user = await User.findOne({ email: req.body.email });
      try {
        const mailOptions = {
          from: `${process.env.SENDER_USER_NAME} <${process.env.SENDER_EMAIL_ADDRESS}>`,
          to: user.email,
          subject: `Your ${process.env.BRAND_NAME} password reset link is ready`,
          html: resetPassword({
            userInfo: {
              userId: user._id,
              email: bcrypt.hashSync(user.email, 8),
            },
          }),
        };
        sendEmail(res, mailOptions);
      } catch (error) {
        res.status(404).send({ message: "User doesn't exist" });
      }
    } else {
      res.status(404).send({ message: "Error sending reset password link" });
    }
  })
);

export default emailRouter;
