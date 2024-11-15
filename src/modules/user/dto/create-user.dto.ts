import { ApiProperty } from '@nestjs/swagger';
import { GeneralStatus } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El campo name es obligatorio.' })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo lastName es obligatorio.' })
  lastName: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo email es obligatorio.' })
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo password es obligatorio.' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  password: string;

  @IsOptional()
  status: GeneralStatus = GeneralStatus.ACTIVE;
}
