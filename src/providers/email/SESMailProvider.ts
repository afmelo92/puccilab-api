import nodemailer, { Transporter } from 'nodemailer';
import { SES, SendRawEmailCommand } from '@aws-sdk/client-ses';
import config from '@/etc/config';
import HandlebarsTemplateProvider, {
  ParseMailTemplateProps,
} from './templates/HandlebarsTemplateProvider';

type MailContactProps = {
  name: string;
  email: string;
};

type SendMailProps = {
  to: MailContactProps;
  from?: MailContactProps;
  subject: string;
  templateData: ParseMailTemplateProps;
};

class SESMailProvider {
  private client: Transporter;

  constructor() {
    this.client = nodemailer.createTransport({
      SES: {
        ses: new SES({
          apiVersion: '2010-12-01',
          credentials: {
            accessKeyId: config.email.accessKeyId,
            secretAccessKey: config.email.secretAccessKey,
          },
          region: config.email.region,
        }),
        aws: {
          SendRawEmailCommand,
        },
      },
    });
  }

  public async sendMail({ to, from, subject, templateData }: SendMailProps) {
    await this.client.sendMail({
      from: {
        name: from?.name || 'Pucci Dental Lab',
        address: from?.email || 'contato@puccidentallab.com.br',
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await HandlebarsTemplateProvider.parse(templateData),
    });
  }
}

export default new SESMailProvider();
