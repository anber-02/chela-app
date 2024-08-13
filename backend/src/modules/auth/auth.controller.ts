import { Response } from 'express';

import { Body, Controller, Get, Post, Res } from '@nestjs/common';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from './enums/rol.enum';
import { Auth } from './decorator/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) { }

  @Post('/register')
  create(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('/login')
  login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(loginDto, res);
  }

  // EJEMPLO DE COMO VALIDAR RUTAS
  @Get('/profile')
  @Auth(Role.ADMIN)
  profile() {
    return {message: 'profile'};
  }
}
