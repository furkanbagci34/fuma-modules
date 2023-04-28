import { CronJob } from 'cron';
import MailService from './mail.service';
import DbService from './db.service';
import { MailPriorityStatus } from '../enums';

export default class Cron {

    private readonly mailService: MailService;
    private readonly dbService: DbService;

    private readonly cronJobHigh;
    private readonly cronJobNormal;
    private readonly cronJobLow;

    constructor(smtpMailUser: string, smtpMailPass: string, connectionString: string) {

        this.mailService = new MailService(smtpMailUser, smtpMailPass);
        this.dbService = new DbService(connectionString);

        this.cronJobHigh = new CronJob('0 */2 * * * *', async () => { 

            const HighPriorityMailList = await this.getMailList(MailPriorityStatus.HighPriority)

            if (!HighPriorityMailList.rowCount) return

            await this.mailService.sendEmail('recipient@example.com', '2 Minute Report', 'This is the 5 minute report.');
        });

        this.cronJobNormal = new CronJob('0 */10 * * * *', async () => {

            const NormalPriorityMailList = await this.getMailList(MailPriorityStatus.Normal)

            if (!NormalPriorityMailList.rowCount) return

            await this.mailService.sendEmail('recipient@example.com', '10 Minute Report', 'This is the 10 minute report.');
        });

        this.cronJobLow = new CronJob('0 */30 * * * *', async () => {

            const LowPriorityMailList = await this.getMailList(MailPriorityStatus.Normal)

            if (!LowPriorityMailList.rowCount) return


            await this.mailService.sendEmail('recipient@example.com', '30 Minute Report', 'This is the 30 minute report.');
        });

        this.startJobs()
    }

    async startJobs()
    {
        this.cronJobHigh.start();
        this.cronJobNormal.start();
        this.cronJobLow.start();
    }

    async stopJobs()
    {
        this.cronJobHigh.stop();
        this.cronJobNormal.stop();
        this.cronJobLow.stop();
    }

    async getMailList(PriorityStatus: any)
    {
        return await this.dbService.query("select to, subject, content from mail where priority_status = $1", [PriorityStatus]);
    }

    async sendMail(to: string, subject: string, content: string)
    {
        return await this.mailService.sendEmail(to, subject, content)
    }
}