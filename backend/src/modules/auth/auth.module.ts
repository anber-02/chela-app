import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';


import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { AuthGuard } from './guard/auth.guard';

@Module({
  imports: [
    // Configuración del jwt async para que reconozca las variables de entorno
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        // obtiene el valor de la secret key definida en el .env
        secret: configService.get<string>('SECRET_KEY'),
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [JwtModule, AuthGuard]
})
export class AuthModule {}
