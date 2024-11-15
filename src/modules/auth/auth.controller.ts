import { ResponseDto } from '@/common/dto/response.dto';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginResponseData, RegisterResponseData } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordConfirmDto, ResetPasswordDto } from './dto/reset-password.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';

// @ApiBearerAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('')
  async register(
    @Body() body: CreateUserDto,
  ): Promise<ResponseDto<RegisterResponseData>> {
    return this.authService.createUser(body);
  }
  
  @Post('login')
  async login(@Body() body: LoginDto): Promise<ResponseDto<LoginResponseData>> {
    return this.authService.login(body);
  }

  @Post('resetPassword')
  async resetPassorw(@Body() body: ResetPasswordDto): Promise<ResponseDto<any>> {
    return this.authService.resetPassword(body);
  }

  @Post('resetPasswordConfirm')
  async resetPasswordConfirm(@Body() body: ResetPasswordConfirmDto): Promise<ResponseDto<any>> {
    return this.authService.resetPasswordConfirm(body);
  }

  @Get('validateUrlToken/:token')
  async validateUrlToken(@Param('token') token: string): Promise<ResponseDto<any>> {
    return this.authService.validateUrlToken(token);
  }
}
