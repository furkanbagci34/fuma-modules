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
    
        try {
            const info = await this.transporter.sendMail(mailOptions);
            const responseCode = parseInt(info.response.substring(0, 3));

            if (responseCode >= 200 && responseCode < 300) {
                console.log('E-posta başarıyla gönderildi.');
                return true;
            } 
            else {
                console.log('E-posta gönderilirken bir hata oluştu.');
                return false;
            }

        } catch (err) {
            console.log('E-posta gönderilirken bir hata oluştu: ' + err);
            return false;
        }
    }
}