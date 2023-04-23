// import nodemailer from 'nodemailer';

// export default class MailService{

//     private readonly transporter = nodemailer.createTransport({
//         service: 'Gmail',
//         auth: {
//             user: process.env.SMTP_MAIL_USER,
//             pass: process.env.SMTP_MAIL_PASS,
//         },
//     });

//     async sendEmail(to: string, subject: string, body: string): Promise<void> {
//         const mailOptions = {
//             from: process.env.SMTP_MAIL_USER,
//             to,
//             subject,
//             text: body,
//         };
//         await this.transporter.sendMail(mailOptions);
//     }
// }