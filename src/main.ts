/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
    // Habilitar o CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL, // Endereço do frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',  // Métodos HTTP permitidos
    credentials: true,  // Permitir envio de cookies, se necessário
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
