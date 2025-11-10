import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { UsersService } from './users/user.service'; // 👈 importa el servicio

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // 👇 si no existe, crea el admin (semilla)
  const users = app.get(UsersService);
  await users.createAdminIfMissing();

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`Nest backend running on http://localhost:${port}`);
}
bootstrap();
