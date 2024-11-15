import { FilterDto } from '@/common/dto/filter.dto';
import { PaginatedResponseDto } from '@/common/dto/paginated.reponse.dto';
import { ResponseDto } from '@/common/dto/response.dto';
import { ValidateId } from '@/common/utils/isValidId';
import { PrismaService } from '@/config/prisma/prisma.service';
import { UserRepository } from '@/repositories/user/user.repository';
import { handleHttpException } from '@/common/utils/http-exception.util';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GeneralStatus, Users } from '@prisma/client';
import { RegisterResponseData } from '../auth/dto/login-response.dto';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private readonly userRepository: UserRepository,
  ) {}

  async createUser(
    data: CreateUserDto,
  ): Promise<ResponseDto<RegisterResponseData>> {
    if (!data.status) data.status = GeneralStatus.ACTIVE;

    try {
      const emailExist = await this.prisma.users.findUnique({
        where: {
          email: data.email.toLowerCase(),
        },
      });

      if (emailExist) {
        throw new BadRequestException('Este correo ya esta en uso');
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const user = await this.userRepository.create({
        ...data,
        password: hashedPassword,
      });

      return new ResponseDto<RegisterResponseData>(
        'Usuario creado correctamente',
        'Se ha creado el usuario correctamente',
        false,
        201,
        {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            lastName: user.lastName,
          },
        },
      );
    } catch (error) {
      handleHttpException({
        title: 'Error al crear el usuario',
        description: error.message || 'Error desconocido',
        statusCode: error.status || 500,
      });
    }
  }

  async getUserById(id: string): Promise<ResponseDto<Users>> {
    ValidateId(id);

    try {
      const user = await this.userRepository.findById(id);
      if (!user) {
        throw new NotFoundException(`Usuario con id ${id} no encontrado`);
      }

      return new ResponseDto<Users>('OK', 'OK', false, 200, {
        ...user,
        password: null,
      });
    } catch (error) {
      handleHttpException({
        title: 'Error al obtener el usuario',
        description: error.message || 'Error desconocido',
        statusCode: error.status || 500,
      });
    }
  }

  async updateUser(
    id: string,
    data: UpdateUserDto,
  ): Promise<ResponseDto<Users>> {
    ValidateId(id);
    try {
      const user = await this.userRepository.update(id, data);

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return new ResponseDto<Users>(
        'Usuario actualizado correctamente',
        'Se ha actualizado el usuario correctamente',
        false,
        200,
        user,
      );
    } catch (error) {
      handleHttpException({
        title: 'Error al actualizar el usuario',
        description: error.message || 'Error desconocido',
        statusCode: error.status || 500,
      });
    }
  }

  async deleteUser(id: string): Promise<ResponseDto<Users>> {
    ValidateId(id);
    try {
      const userExists = await this.userRepository.findById(id);

      if (!userExists) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }

      const user = await this.userRepository.delete(id);

      return new ResponseDto<Users>(
        'Usuario eliminado correctamente',
        'Se ha eliminado el usuario correctamente',
        false,
        200,
        user,
      );
    } catch (error) {
      handleHttpException({
        title: 'Error al eliminar el usuario',
        description: error.message || 'Error desconocido',
        statusCode: error.status || 500,
      });
    }
  }

  async getAllUsers(
    filter: FilterDto,
  ): Promise<ResponseDto<PaginatedResponseDto<UserDto>>> {
    try {
      let users = await this.userRepository.findAll(filter);

      return new ResponseDto<PaginatedResponseDto<UserDto>>(
        'OK',
        'OK',
        false,
        200,
        users,
      );
    } catch (error) {
      handleHttpException({
        title: 'Error al obtener todos los usuarios',
        description: error.message || 'Error desconocido',
        statusCode: error.status || 500,
      });
    }
  }
}
