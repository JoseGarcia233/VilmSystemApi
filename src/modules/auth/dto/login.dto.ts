import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsPhoneNumber, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ default: 'admin@vilmsystem.com' })
  @IsNotEmpty({ message: 'El campo email es obligatorio.' })
  @IsEmail()
  email: string;

  @ApiProperty({ default: 'admin123' })
  @IsNotEmpty({ message: 'El campo password es obligatorio.' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  password: string;
}
