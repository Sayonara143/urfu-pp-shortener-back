import App from './app';
import * as bodyParser from 'body-parser';
import 'express-async-errors';
import { taskDeleteShortener } from './scheduler';
import { errorMiddleware } from './middleware/error.middleware';
import { errorHandler } from './exceptions/ErrorHandler';
import { SchemaApp } from './schemasApp';
import { schemasRoutes } from './routes/schemaRoutes';
import cors from 'cors';

const schemaApp = new SchemaApp(schemasRoutes);

const app = new App({
    port: 5000,
    schemasRoutes: {},
    router: schemaApp.router,
    middleWares: [
        bodyParser.json(),
        bodyParser.urlencoded({ extended: true }),
        cors({
            origin: ['http://localhost:3000', 'http://localhost:5173'],
            credentials: true,
        }),
    ],
    middleWaresAfterRoutes: [errorMiddleware],
});

app.listen();
taskDeleteShortener.start();

process.on('uncaughtException', (error: Error) => {
    console.log(`Uncaught Exception: ${error.message}`);

    errorHandler.handleError(error);
});

process.on('unhandledRejection', (reason: Error | any) => {
    console.log(`Unhandled Rejection: ${reason.message || reason}`);

    throw new Error(reason.message || reason);
});
