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

  private async renderTemplate(templateName: string, context: any) {
    const templatePath = path.join(process.cwd(), 'src', 'email', 'template', templateName);


    const templateFile = readFileSync(templatePath, 'utf-8');

    const compiledTemplate = hbs.compile(templateFile);

    return compiledTemplate(context);
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
