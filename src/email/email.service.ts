import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendMultaEmail(to: string, data: { nomeMotorista: string; placa: string; dataMulta: string }) {
    const templatePath = path.join(__dirname, 'templates', 'notificarMulta.hbs');
    let html = fs.readFileSync(templatePath, 'utf8');

    html = html
      .replace(/{{nomeMotorista}}/g, data.nomeMotorista)
      .replace(/{{placa}}/g, data.placa)
      .replace(/{{dataMulta}}/g, data.dataMulta);

    await this.transporter.sendMail({
      from: `"Gestão de Frotas" <${process.env.EMAIL_USERNAME}>`,
      to,
      subject: 'Notificação de Multa',
      html,
    });
  }
}
