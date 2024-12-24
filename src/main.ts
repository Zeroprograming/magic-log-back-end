// src/main.ts
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { EnvConfig } from './config/env.config'; // Importar las variables de entorno

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors({
    origin: 'http://localhost:3000', // Permitir solicitudes desde el cliente
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Permitir cookies si es necesario
  });

  // Configurar prefijo global para las rutas
  app.setGlobalPrefix('api/v1');

  // Validaciones y transformación de datos
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Transforma los datos al DTO
      whitelist: true, // Elimina propiedades no definidas en el DTO
      forbidNonWhitelisted: true, // Lanza un error si hay propiedades no permitidas
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Magic log API')
    .setDescription('The magic log API is a simple API to manage logs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, documentFactory);

  // Usar el puerto desde las variables de entorno
  await app.listen(EnvConfig.port);
}

bootstrap();
