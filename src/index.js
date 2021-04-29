import express from 'express';
import mongoConnection from './modules/core/db.js';
import logger from './modules/core/logger.js';
import parseResponse from './modules/core/parseResponse.js';
import cors from './modules/core/cors.js';
import chai from 'chai';
import serverStart from './modules/core/serverStart.js';
import routes from './modules/core/routes.js';
import errorHandling from './modules/core/errorHandling.js';
import chai_datetime from 'chai-datetime';

import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

chai.use(chai_datetime);

const app = express();

app.disable('x-powered-by'); // Disable Express signature
mongoConnection();
logger(app);
parseResponse(app);
cors(app);
routes(app);

errorHandling(app);

const server = serverStart(app);

export default app;
