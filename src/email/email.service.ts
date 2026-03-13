/* src/email/email.service.ts */
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as hbs from 'handlebars';
import { readFileSync } from 'fs';
import * as path from 'path';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: false,
      auth: process.env.MAIL_USER
        ? {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD,
          }
        : undefined,
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  private renderTemplate(templateName: string, context: any): string {
    const templateFileName = templateName.endsWith('.hbs')
      ? templateName
      : `${templateName}.hbs`;

    const templatesPath = path.join(__dirname, 'template');
    const templatePath = path.join(templatesPath, templateFileName);

    const templateSource = readFileSync(templatePath, 'utf8');
    const template = hbs.compile(templateSource);
    return template(context);
  }

  async sendMail(to: string, subject: string, template: string, context: any) {
    const html = await this.renderTemplate(template, context);

    await this.transporter.sendMail({
      from: process.env.MAIL_ADDRESS,
      to,
      subject,
      html,
    });
  }
}
