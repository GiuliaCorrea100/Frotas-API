import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
<<<<<<< HEAD
=======
  app.enableCors();
>>>>>>> e833801 (adc no gitlab)
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
