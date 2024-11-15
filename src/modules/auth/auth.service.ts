import { ResponseDto } from '@/common/dto/response.dto';
import { handleHttpException } from '@/common/utils/http-exception.util';
import { PrismaService } from '@/config/prisma/prisma.service';
import { MailService } from '@/modules/mail/mail.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { LoginResponseData } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import {
  ResetPasswordConfirmDto,
  ResetPasswordDto,
} from './dto/reset-password.dto';
import { logoString } from './logoString';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async login(body: LoginDto): Promise<ResponseDto<LoginResponseData>> {
    let { email, password } = body;

    try {
      const user = await this.prisma.users.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (!user) {
        throw new BadRequestException('Correo incorrecto');
      }

      const passwordValid = await bcrypt.compare(password, user.password);
      if (!passwordValid) {
        throw new BadRequestException('Contraseña incorrecta');
      }

      const token = await this.generateToken(user.id, user.email);

      return new ResponseDto<LoginResponseData>(
        'Login Exitoso.',
        'Has iniciado sesión correctamente.',
        false,
        200,
        {
          token,
          user: {
            id: user.id,
            name: user.name,
            lastName: user.lastName,
            email: user.email,
          },
        },
      );
    } catch (error) {
      handleHttpException({
        title: 'Error al iniciar sesión',
        description: error.message || 'Error desconocido',
        statusCode: error.status,
      });
    }
  }

  async resetPassword(body: ResetPasswordDto): Promise<ResponseDto<any>> {
    const { email } = body;

    try {
      const user = await this.prisma.users.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (!user) {
        throw new BadRequestException('Este correo no se encuentra registrado');
      }

      const token = await this.generateResetToken(user.id);
      await this.sendResetEmail(user.email, token);

      return new ResponseDto<LoginResponseData>(
        'Correo de Restablecimiento Enviado',
        'Hemos enviado un enlace a su correo electrónico. Siga el enlace para restablecer su contraseña.',
        false,
        200,
        null,
      );
    } catch (error) {
      handleHttpException({
        title: 'Error al restablecer contraseña',
        description: error.message || 'Error desconocido',
        statusCode: error.status,
      });
    }
  }

  async resetPasswordConfirm(
    body: ResetPasswordConfirmDto,
  ): Promise<ResponseDto<any>> {
    let { token, newPassword } = body;
    try {
      const resetEntry = await this.prisma.passwordReset.findUnique({
        where: { token },
        include: { user: true },
      });

      if (!resetEntry || resetEntry.expiresAt < new Date()) {
        throw new BadRequestException('Token inválido o expirado');
      }

      await this.prisma.users.update({
        where: { id: resetEntry.userId },
        data: { password: await bcrypt.hash(newPassword, 10) },
      });

      await this.prisma.passwordReset.delete({
        where: { token },
      });

      return new ResponseDto<LoginResponseData>(
        'Contraseña Cambiada',
        'Su contraseña ha sido cambiado exitosamente.',
        false,
        200,
        null,
      );
    } catch (error) {
      handleHttpException({
        title: 'Error al restablecer contraseña',
        description: error.message || 'Error desconocido',
        statusCode: error.status,
      });
    }
  }

  async validateUrlToken(token: string): Promise<ResponseDto<any>> {
    const resetEntry = await this.prisma.passwordReset.findUnique({
      where: { token },
    });

    if (!resetEntry || resetEntry.expiresAt < new Date()) {
      handleHttpException({
        title: 'Token inválido o expirado',
        description: 'El Token proporcionado no es válido o ha expirado.',
        statusCode: 400,
      });
    }

    return new ResponseDto<LoginResponseData>(
      'Token validado',
      'El token ha sido validado con éxito y está listo para su uso.',
      false,
      200,
      null,
    );
  }

  private async generateResetToken(userId: string): Promise<string> {
    const token = randomBytes(32).toString('hex');

    await this.prisma.passwordReset.create({
      data: {
        userId,
        token,
        expiresAt: new Date(Date.now() + 3600000),
      },
    });

    return token;
  }

  private async sendResetEmail(email: string, token: string) {
    const resetLink = `${process.env.URL_BACKOFFICE_FRONT}/reset_password?token=${token}`;

    const svgBase64 = btoa(logoString);
    const dataUrl = `data:image/svg+xml;base64,${svgBase64}`;
    const html = `
      <div style="text-align: center;">
        <img src="${dataUrl}" alt="Logo de la App" style="width: 150px; height: auto;"/>
        <h2>Restablecer tu contraseña</h2>
        <p style="margin-bottom: 20px;">Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="${resetLink}" style="padding: 10px 15px; margin-top: 10px; background-color: #5441F9; color: white; text-decoration: none; border-radius: 5px;">Restablecer contraseña</a>
      </div>
    `;

    await this.mailService.sendEmail(email, 'Restablecer tu contraseña', html);
  }

  private async generateToken(userId: string, email: string) {
    const payload = { userId, email };
    return this.jwtService.sign(payload);
  }
}
