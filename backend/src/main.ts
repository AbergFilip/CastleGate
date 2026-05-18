import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import { readFileSync } from 'fs';
import { config as dotenvConfig } from 'dotenv';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ApiVersionInterceptor } from './common/interceptors/api-version.interceptor';
import { correlationIdMiddleware } from './common/middleware/correlation-id.middleware';
import { rateLimitMiddleware } from './common/middleware/rate-limit.middleware';

// Ladda .env från arbetsmappen (backend/ när du kör "npm start" i backend) eller från dist/../ 
const envPath = join(process.cwd(), '.env');
const envPathFromDist = join(__dirname, '..', '.env');
dotenvConfig({ path: envPath });
dotenvConfig({ path: envPathFromDist });

// Säkerställ Tink-credentials i process.env (läs från fil om dotenv inte satte dem)
function ensureTinkEnvFromFile(): void {
  if (process.env.TINK_CLIENT_ID && process.env.TINK_CLIENT_SECRET) return;
  const paths = [envPath, envPathFromDist, join(process.cwd(), 'tink.env'), join(__dirname, '..', 'tink.env')];
  for (const p of paths) {
    try {
      const content = readFileSync(p, 'utf-8');
      for (const line of content.split(/\r?\n/)) {
        const m = line.match(/^\s*TINK_CLIENT_ID\s*=\s*(.+?)\s*$/);
        if (m) process.env.TINK_CLIENT_ID = m[1].replace(/^["']|["']$/g, '').trim();
        const m2 = line.match(/^\s*TINK_CLIENT_SECRET\s*=\s*(.+?)\s*$/);
        if (m2) process.env.TINK_CLIENT_SECRET = m2[1].replace(/^["']|["']$/g, '').trim();
      }
      if (process.env.TINK_CLIENT_ID && process.env.TINK_CLIENT_SECRET) return;
    } catch {
      continue;
    }
  }
}
ensureTinkEnvFromFile();

async function bootstrap() {
  const mtlsEnabled = process.env.MTLS_ENABLED === 'true';
  let httpsOptions: any | undefined;
  if (mtlsEnabled) {
    const keyPath = process.env.MTLS_KEY_PATH;
    const certPath = process.env.MTLS_CERT_PATH;
    const caPath = process.env.MTLS_CA_PATH;

    if (!keyPath || !certPath || !caPath) {
      throw new Error(
        'MTLS_ENABLED=true kräver MTLS_KEY_PATH, MTLS_CERT_PATH och MTLS_CA_PATH'
      );
    }

    httpsOptions = {
      key: readFileSync(keyPath),
      cert: readFileSync(certPath),
      ca: readFileSync(caPath),
      requestCert: true,
      rejectUnauthorized: true,
    };
  }

  const app = await NestFactory.create(AppModule, httpsOptions ? { httpsOptions } : {});

  // Express v5 (NestJS 11): restore extended query parser for nested objects/arrays
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('query parser', 'extended');

  // Enable CORS first (must be before other middleware so preflight OPTIONS works)
  app.enableCors({
    credentials: true,
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'X-Correlation-ID'],
    optionsSuccessStatus: 204,
  });

  // Security headers (after CORS to avoid conflicts)
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
  }));

  // Correlation/trace ID middleware
  app.use(correlationIdMiddleware);

  // Basic rate limiting (per-IP, in-memory)
  app.use(rateLimitMiddleware);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global interceptors
  app.useGlobalInterceptors(new ApiVersionInterceptor());

  // API prefix with version
  app.setGlobalPrefix('api/v1');

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('CastleGate API')
    .setDescription('CastleGate Backend API - Digital Life Management Platform')
    .setVersion(process.env.API_VERSION || '1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Auth0 access token (roles: admin, user)',
      },
      'Auth0'
    )
    .addSecurityRequirements('Auth0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  const protocol = mtlsEnabled ? 'https' : 'http';
  console.log(`✅ CastleGate API is running on: ${protocol}://localhost:${port}`);
  console.log(
    `📚 Swagger docs available at: ${protocol}://localhost:${port}/api/docs`
  );
}

bootstrap();

