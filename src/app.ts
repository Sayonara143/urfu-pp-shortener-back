import express, { Router, Application } from 'express';
import mongoose from 'mongoose';
import 'express-async-errors';
import 'dotenv/config';

class App {
    public app: Application;
    public port: number;

    constructor(appInit: {
        port: number;
        middleWares: any;
        router: any;
        schemasRoutes: any;
        middleWaresAfterRoutes: any;
    }) {
        this.app = express();
        this.port = appInit.port;

        this.initDatabase();
        this.middlewares(appInit.middleWares);
        this.routes(appInit.router);
        this.middlewares(appInit.middleWaresAfterRoutes);
    }

    private middlewares(middleWares: { forEach: (arg0: (middleWare: any) => void) => void }) {
        middleWares.forEach((middleWare) => {
            this.app.use(middleWare);
        });
    }

    private routes(router: Router) {
        this.app.use('/', router);
    }

    private initDatabase() {
        const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;

        mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`).then(() => {
            console.log('[MONGO_DB START]');
        });
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the http://localhost:${this.port}`);
        });
    }
}

export default App;
