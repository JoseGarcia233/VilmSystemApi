import { ResponseDto } from '@/common/dto/response.dto';
import { RegisterResponseData } from '@/modules/auth/dto/login-response.dto';
import { JwtAuthGuard } from '@/modules/auth/jwt-auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { FilterDto } from '@/common/dto/filter.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiBearerAuth()
@ApiTags('User')
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('')
  async register(
    @Body() body: CreateUserDto,
  ): Promise<ResponseDto<RegisterResponseData>> {
    return this.userService.createUser(body);
  }

  @Get('')
  getAllUsers(@Query() filter: FilterDto) {
    return this.userService.getAllUsers(filter);
  }
  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.updateUser(id, body);
  }
}
