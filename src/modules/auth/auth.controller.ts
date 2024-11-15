import { ResponseDto } from '@/common/dto/response.dto';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginResponseData } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import {
  ResetPasswordConfirmDto,
  ResetPasswordDto,
} from './dto/reset-password.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto): Promise<ResponseDto<LoginResponseData>> {
    return this.authService.login(body);
  }

  @Post('resetPassword')
  async resetPassorw(
    @Body() body: ResetPasswordDto,
  ): Promise<ResponseDto<any>> {
    return this.authService.resetPassword(body);
  }

  @Post('resetPasswordConfirm')
  async resetPasswordConfirm(
    @Body() body: ResetPasswordConfirmDto,
  ): Promise<ResponseDto<any>> {
    return this.authService.resetPasswordConfirm(body);
  }

  @Get('validateUrlToken/:token')
  async validateUrlToken(
    @Param('token') token: string,
  ): Promise<ResponseDto<any>> {
    return this.authService.validateUrlToken(token);
  }
}
