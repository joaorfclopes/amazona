import express from "express";
import expressAsyncHandler from "express-async-handler";
import nodemailer from "nodemailer";

const orderRouter = express.Router();

orderRouter.post(
  "/",
  expressAsyncHandler(async (req, res) => {
    let testAccount = await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
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
