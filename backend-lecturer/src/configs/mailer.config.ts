import nodemailer from 'nodemailer'
import { Options } from 'nodemailer/lib/mailer'

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASSWORD
  }
})

export const mailOptions = (options: Options) => {
  const optionsMail: Options = {
    from: process.env.APP_USER,
    subject: 'CIT Machine Learning Tools',
    text: 'Verify  account'
  }

  return Object.assign({}, optionsMail, options)
}

export const sendEmail = async (options: Options) => {
  return await transporter.sendMail(options)
}
