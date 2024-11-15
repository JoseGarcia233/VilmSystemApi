import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from '@/config/prisma/prisma.service';
import { UserRepository } from '@/repositories/user/user.repository';
import { PrismaModule } from '@/config/prisma/prisma.module';
import { UserController } from './user.controller';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, PrismaService],
  exports: [UserService],
})
export class UserModule {}
