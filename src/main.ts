import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  dotenv.config()
  app.enableCors(
    {
      origin:'*',
      methods:'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue:false,
      optionsSuccessStatus:204,
      credentials:true,
    },
  );

  const config = new DocumentBuilder()
    .setTitle(process.env.API_NAME)
    .setDescription('Backend - Vilm System')
    .setVersion(process.env.API_VERSION)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  
  await app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
  });
}
bootstrap();
