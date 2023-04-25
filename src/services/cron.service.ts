import { CronJob } from 'cron';
import MailService from './mail.service';

export default class Cron {

    private readonly mailService: MailService;

    constructor(smtpMailUser: string, smtpMailPass: string) {

        this.mailService = new MailService(smtpMailUser, smtpMailPass);

        const cronJob5m = new CronJob('0 */5 * * * *', async () => {

            await this.mailService.sendEmail('recipient@example.com', '5 Minute Report', 'This is the 5 minute report.');
        });

        const cronJob10m = new CronJob('0 */10 * * * *', async () => {

            await this.mailService.sendEmail('recipient@example.com', '10 Minute Report', 'This is the 10 minute report.');
        });

        const cronJob30m = new CronJob('0 */30 * * * *', async () => {

            await this.mailService.sendEmail('recipient@example.com', '30 Minute Report', 'This is the 30 minute report.');
        });

        cronJob5m.start();
        cronJob10m.start();
        cronJob30m.start();
    }
}