import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import User from "../models/userModel";

export const mailer = async ({ mail, mailtype, userID }: any) => {
  try {

    const hashedtoken = await bcrypt.hash(userID.toString(), 10);

    if(mailtype === "VERIFY"){
      await User.findByIdAndUpdate(userID,{
        verifyToken: hashedtoken, verifyTokenExpiry: Date.now() + 3600000
      })
    } else if(mailtype === "RESET"){
      await User.findByIdAndUpdate(userID,{
        forgotPasswordToken: hashedtoken, forgotPasswordTokenExpiry: Date.now() + 3600000
      })
    }

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: `${process.env.SMUSER}`,
        pass: `${process.env.SMPASS}`
      }
    });

    const emailOptions = {
      from: '"Test Sender" <test@example.com>',
      to: "recipient@example.com",
      subject: mailtype === "VERIFY" ? "Verify your email" : "Reset your password",
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedtoken}">here</a> to ${mailtype === "VERIFY" ? "verify your email" : "reset your password"}
            or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedtoken}
            </p>`
    };

    const info = await transport.sendMail(emailOptions);
    return info;

    
  } catch (error: any) {
    throw new Error(error.message);
  }
};
