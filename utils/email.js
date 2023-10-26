import nodemailer from "nodemailer";
import pug from "pug";
//import htmlToText from "html-to-text";
//import Transport from "nodemailer-brevo-transport";
// TODO - do I need above import statement?

export default class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = `Marina Russ <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === "production") {
      // Brevo - create reusable transporter object (SMTP)
      return nodemailer.createTransport({
        host: process.env.BREVO_HOST,
        port: process.env.BREVO_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.BREVO_LOGIN,
          pass: process.env.BREVO_API_KEY,
        },
      });
    }
    return nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    // 1 - Render HTML based on pug template + user data
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    // 2 - Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html),
    };

    // 3 - Create transport and send new email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send("welcome", "Welcome to Natours!");
  }

  async sendPasswordReset() {
    await this.send(
      "passwordReset",
      "Your Natours Password Reset Link (Valid for 10 minutes)"
    );
  }
}
