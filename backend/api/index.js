/**
 * Vercel Serverless entry point för NestJS-backenden.
 *
 * Filen körs av Vercels Node-runtime som en serverless-funktion. Vi importerar
 * den redan kompilerade NestJS-appen från `../dist/` (byggd via `npm run build`
 * i vercel.json:s buildCommand). Vi bootstrappar Nest EN gång per lambda-instans
 * (cachas i `cachedServer`) för att undvika cold-start på varje request.
 *
 * Ruttning: `backend/vercel.json` mappar alla requests till denna handler.
 * NestJS globala prefix `api/v1` bevaras via `configureApp()` i main.js.
 */
'use strict';

const { NestFactory } = require('@nestjs/core');
const { ExpressAdapter } = require('@nestjs/platform-express');
const express = require('express');
const { AppModule } = require('../dist/app.module');
const { configureApp } = require('../dist/main');

let cachedServer = null;
let bootstrapPromise = null;

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    logger: ['error', 'warn', 'log'],
  });
  configureApp(app);
  await app.init();
  return server;
}

module.exports = async (req, res) => {
  try {
    if (!cachedServer) {
      if (!bootstrapPromise) bootstrapPromise = bootstrap();
      cachedServer = await bootstrapPromise;
    }
    return cachedServer(req, res);
  } catch (err) {
    console.error('[serverless bootstrap] fatal:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Backend kunde inte startas', detail: err && err.message }));
  }
};
