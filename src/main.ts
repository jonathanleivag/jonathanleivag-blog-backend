import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as process from 'node:process';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Blog Api Jonathanleivag')
    .setDescription('The Blog API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth', 'Autenticación de usuarios')
    .addTag('User', 'Gestión de usuarios')
    .addTag('Blog', 'Gestión de blogs')
    .addTag('Category', 'Gestión de categorías')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalPipes(new ValidationPipe());
  app.use(helmet());
  const allowedOrigins = [
    'http://localhost:3000',
    'https://blog-jonathanleivag.vercel.app',
    'https://blog.jonathanleivag.cl',
    'https://jonathanleivag.cl',
    'http://localhost:3001',
    'http://localhost:4321',
    'https://qa-blog.jonathanleivag.cl',
  ];
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
    }),
  );
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
