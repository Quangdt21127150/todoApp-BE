import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './auth.dto';
import { BearerToken } from './auth.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(
      registerDto.fullname,
      registerDto.email,
      registerDto.phone,
      registerDto.username,
      registerDto.password,
    );

    return {
      statusCode: HttpStatus.CREATED,
      message: 'User registered successfully',
      data: result,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(
      loginDto.username,
      loginDto.password,
    );

    await this.authService.updateUser(result.user.id, result.refresh_token);

    return {
      statusCode: HttpStatus.OK,
      message: 'Login successful',
      data: result,
    };
  }

  @Post('refresh-token')
  @UseGuards(AuthGuard('jwt'))
  async refreshToken(@BearerToken() refreshToken: string) {
    const result = await this.authService.refreshToken(refreshToken);
    return {
      statusCode: HttpStatus.OK,
      message: 'Token refreshed successfully',
      data: result,
    };
  }
}
