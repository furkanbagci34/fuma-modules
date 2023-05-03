import { CronJob } from 'cron';
import MailService from './mail.service';
import DbService from './db.service';
import { MailPriorityStatus } from '../enums';
import { Enums } from '../..';

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

            await this.sendMail(HighPriorityMailList)
        });

        this.cronJobNormal = new CronJob('0 */10 * * * *', async () => {

            const NormalPriorityMailList = await this.getMailList(MailPriorityStatus.Normal)

            if (!NormalPriorityMailList.rowCount) return

            await this.sendMail(NormalPriorityMailList)
        });

        this.cronJobLow = new CronJob('0 */30 * * * *', async () => {

            const LowPriorityMailList = await this.getMailList(MailPriorityStatus.Normal)

            if (!LowPriorityMailList.rowCount) return

            await this.sendMail(LowPriorityMailList)
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

    async getMailList(priorityStatus: any)
    {
        return await this.dbService.query("select to, subject, content from mail where priority_status = $1 and send_status = $2", [priorityStatus,Enums.MailSendStatus.Waiting]);
    }

    async sendMail(mailList: any)
    {
        for(let i = 0; i < mailList.length; i++) {

            
        }

        return await this.mailService.sendEmail(to, subject, content)
    }


}