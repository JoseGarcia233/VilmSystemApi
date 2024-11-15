import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.SMTP_EMAIL,
//     pass: process.env.SMTP_PASSWORD,
//   },
// });

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email', // Usa un servidor SMTP sin autenticación en desarrollo
  port: 587, // Puerto común para servicios SMTP sin autenticación
  secure: false, // Establece en `true` si usas el puerto 465 para SSL
  auth: {
    user: "kurtis.champlin@ethereal.email",
    pass: "XBhUrd192yMQpfASB4",
  },
  tls: {
    rejectUnauthorized: false, // Para evitar problemas de certificados en desarrollo
  },
});

export class MailService {
  async sendEmail(
    to: string,
    subject: string,
    html: string,
    from: string = process.env.SMTP_EMAIL,
  ): Promise<void> {
    const msg = {
      from,
      to,
      subject,
      html,
    };

    try {
      await transporter.sendMail(msg);
      console.log('Correo enviado con éxito');
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      throw new Error('Error al enviar el correo');
    }
  }
}
