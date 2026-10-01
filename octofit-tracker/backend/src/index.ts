import express from 'express';
import type { ErrorRequestHandler } from 'express';
import { apiBaseUrl } from './config/api.js';
import { connectDatabase } from './config/database.js';
import apiRouter from './routes/index.js';

const app = express();
const port = Number(process.env.PORT) || 8000;

app.use(express.json());
app.use('/api', apiRouter);

app.get('/api/health', (_request, response) => {
  response.status(200).json({ status: 'ok', database: 'connected', apiBaseUrl });
});

const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  const duplicateKey = typeof error === 'object' && error !== null && 'code' in error && error.code === 11000;
  const invalidDocument = error instanceof Error && ['CastError', 'ValidationError'].includes(error.name);
  const status = duplicateKey ? 409 : invalidDocument ? 400 : 500;
  const message = status === 500 ? 'Internal server error' : error.message;
  response.status(status).json({ error: message });
};

app.use(errorHandler);

async function startServer() {
  await connectDatabase();
  app.listen(port, () => {
    console.log(`OctoFit API listening at ${apiBaseUrl}`);
  });
}

startServer().catch((error: unknown) => {
  console.error('Unable to start OctoFit API:', error);
  process.exitCode = 1;
});