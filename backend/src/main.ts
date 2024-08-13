import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api')
  app.enableCors({
    origin: '*', // Puedes cambiar '*' por el dominio específico que necesites
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',

    credentials: true
  })
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true })); //validación con class-validator
  await app.listen(3000);
}
bootstrap();
