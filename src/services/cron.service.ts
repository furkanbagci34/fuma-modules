import { CronJob } from 'cron';
import MailService from './mail.service';
import DbService from './db.service';
import Sleep from '../utils/sleep';
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

        this.cronJobHigh = new CronJob('0 */1 * * * *', async () => { 

            const HighPriorityMailList = await this.getMailList(MailPriorityStatus.HighPriority)

            console.log(HighPriorityMailList)

            if (HighPriorityMailList.rowCount === 0) return

            await this.sendMail(HighPriorityMailList)
        });

        this.cronJobNormal = new CronJob('0 */10 * * * *', async () => {

            const NormalPriorityMailList = await this.getMailList(MailPriorityStatus.Normal)

            if (NormalPriorityMailList.rowCount === 0) return

            await this.sendMail(NormalPriorityMailList)
        });

        this.cronJobLow = new CronJob('0 */30 * * * *', async () => {

            const LowPriorityMailList = await this.getMailList(MailPriorityStatus.Normal)

            if (LowPriorityMailList.rowCount === 0) return

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
        return await this.dbService.query("select 'to', subject, content from mail where priority_status = $1 and send_status = $2", [priorityStatus,Enums.MailSendStatus.Waiting]);
    }

    async sendMail(mailList: any)
    {

        let count = 0

        for(let i = 0; i < mailList.rows.length; i++) {

            count++

            if(count == 20) {
                count = 0
                Sleep.sleep(150000)
            }

            const sendMailCallback = await this.mailService.sendEmail(mailList.rows[i].to, mailList.rows[i].subject, mailList.rows[i].content);

            console.log(sendMailCallback)
        }

    }
}