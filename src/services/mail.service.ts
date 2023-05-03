import nodemailer from 'nodemailer';

export default class MailService {

    private readonly transporter;

    constructor(private readonly smtpMailUser: string, private readonly smtpMailPass: string) {
        
        this.transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: this.smtpMailUser,
                pass: this.smtpMailPass,
            },
        });
    }

    async sendEmail(to: string, subject: string, body: string) {

        const mailOptions = {
            from: this.smtpMailUser,
            to,
            subject,
            text: body,
        };

        return await this.transporter.sendMail(mailOptions);
    }
}