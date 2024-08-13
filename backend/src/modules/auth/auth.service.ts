import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';


import { UserService } from '../user/user.service';
import { BcryptAdapter } from './config/bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private jwtService: JwtService,

  ) { }

  async register(registerDto: RegisterDto): Promise<{ [key: string]: any }> {
    const email = registerDto.email
    const existUser = await this.usersService.findByEmail(email)

    if (existUser) throw new BadRequestException();

    const hashedPassword = BcryptAdapter.hashPassword(registerDto.password)

    registerDto = { ...registerDto, password: hashedPassword }

    const { password, ...user } = await this.usersService.create(registerDto)

    const payload = { sub: user.id, username: user.name, rol: user.roles[0]?.rol ?? "" };
    const token = this.jwtService.sign(payload)

    return {
      token,
      user
    }
  }

  async login(
    { email, pass }: LoginDto,
    response: Response
  ): Promise<{ [key: string]: any }> {
    const { password, ...user } = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException();
    }
    const passwordCorrect = BcryptAdapter.comparePassword(pass, password)

    if (!passwordCorrect) throw new UnauthorizedException({ message: 'user / password incorrect' })

    const payload = { sub: user.id, username: user.name, rol: user.roles[0]?.rol ?? "" };
    const token = this.jwtService.sign(payload)

    response.cookie('token', token, { httpOnly: true });
    return {
      token,
      user
    }
  }
}
