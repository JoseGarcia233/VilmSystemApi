import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/config/prisma/prisma.service';
import { GeneralStatus, Prisma } from '@prisma/client';
import { FilterDto } from '@/common/dto/filter.dto';
import {
  createPaginationMeta,
  PaginatedResponseDto,
} from '@/common/dto/paginated.reponse.dto';
import { CreateUserDto } from '@/modules/user/dto/create-user.dto';
import { UpdateUserDto } from '@/modules/user/dto/update-user.dto';
import { UserDto } from '@/modules/user/dto/user.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    return this.prisma.users.create({ data });
  }

  async findById(id: string) {
    return this.prisma.users.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateUserDto) {
    return this.prisma.users.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.users.update({
      where: { id },
      data: { status: GeneralStatus.DELETED },
    });
  }

  async findAll(filter: FilterDto): Promise<PaginatedResponseDto<UserDto>> {
    const { query, limit, page } = filter;
    const skip = (page - 1) * limit;

    const where: Prisma.UsersWhereInput = query
      ? {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { lastName: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
          ],
        }
      : {};

    const [totalDocs, users] = await Promise.all([
      this.prisma.users.count({ where }),
      this.prisma.users.findMany({
        where,
        take: +limit,
        skip,
        select: {
          id: true,
          name: true,
          email: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    ]);

    const meta = createPaginationMeta(totalDocs, page, limit);

    return new PaginatedResponseDto<UserDto>(users, meta);
  }
}
