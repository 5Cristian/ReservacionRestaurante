import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT ?? 587),
      secure: false, // true solo si usas 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendVerificationCode(to: string, code: string, verifyUrl?: string) {
    const from = process.env.EMAIL_FROM || 'no-reply@reservasrestaurante.com';

    // 🔹 Plantilla HTML moderna y profesional
    const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Verificación de correo</title>
      <style>
        body {
          background-color: #f4f6f8;
          font-family: "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          margin: 0;
          padding: 0;
          color: #333;
        }
        .container {
          max-width: 500px;
          margin: 40px auto;
          background-color: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: white;
          padding: 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 1.5em;
        }
        .content {
          padding: 30px 25px;
          text-align: center;
        }
        .code {
          display: inline-block;
          background-color: #f1f5f9;
          color: #111827;
          font-size: 28px;
          letter-spacing: 5px;
          padding: 12px 24px;
          border-radius: 10px;
          margin: 15px 0;
          font-weight: bold;
        }
        .footer {
          background-color: #f9fafb;
          text-align: center;
          padding: 15px;
          font-size: 12px;
          color: #6b7280;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🍽️ Reservas Restaurante</h1>
        </div>
        <div class="content">
          <h2>Verificación de correo electrónico</h2>
          <p>Gracias por registrarte en <strong>Reservas Restaurante</strong>.</p>
          <p>Tu código de verificación es:</p>
          <div class="code">${code}</div>
          <p>Este código caduca en <strong>10 minutos</strong>.</p>
          
          <p>Si no solicitaste este código, simplemente ignora este mensaje.</p>
        </div>
        <div class="footer">
          © ${new Date().getFullYear()} Reservas Restaurante · Todos los derechos reservados<br />
          <a href="https://tu-dominio.com" style="color:#6366f1; text-decoration:none;">Visita nuestro sitio web</a>
        </div>
      </div>
    </body>
    </html>
    `;

    await this.transporter.sendMail({
      from,
      to,
      subject: 'Código de verificación - Reservas Restaurante',
      html,
    });
  }
}


