import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El campo email es obligatorio.' })
  @IsEmail()
  email: string;
}

export class ResetPasswordConfirmDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El campo token es obligatorio.' })
  token: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo newPassword es obligatorio.' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  newPassword: string;
}
