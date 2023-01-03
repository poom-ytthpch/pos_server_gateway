import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const port = Number(process.env.PORT)
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  await app.listen(port , '0.0.0.0').then(() => {
    console.log(`http://localhost:${port}`)
  });
}
bootstrap();
