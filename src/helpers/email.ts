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
        user: "a9c1262429d095",
        pass: "****a9cb"
      }
    });

    const emailOptions = {
      from: '"Test Sender" <test@example.com>',
      to: "recipient@example.com",
      subject: "Test Email",
      text: "This is a test email sent via Ethereal!",
      html: "<p>This is a <b>test email</b> sent via Ethereal!</p>",
    };

    const info = await transport.sendMail(emailOptions);
    return info;

    
  } catch (error: any) {
    throw new Error(error.message);
  }
};
