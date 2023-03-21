import express, { Request, Response, Router } from 'express';
import ISchemaRoutes from './interfaces/ISchemaRoutes.interfaces';
import { validateMiddleware } from './middleware/validate.middleware';

interface IIKeyRouter {
    [key: string]: (path: string, handlers: any) => Router;
}

export class SchemaApp {
    public router = express.Router();
    public keyRouter: IIKeyRouter = {
        GET: (path: string, handlers: any) => this.router.get(path, ...handlers),
        POST: (path: string, handlers: any) => this.router.post(path, ...handlers),
    };
    constructor(schemas: Array<ISchemaRoutes>) {
        this.router.get('/docs', (req: Request, res: Response) => {
            res.json({
                success: true,
                data: {
                    docs: this.generateDocs(schemas),
                    date: Date.now(),
                },
            });
        });
        this.initRoutes(schemas);
    }

    public initRoutes(schemas: { forEach: (arg0: (schema: ISchemaRoutes) => void) => void }) {
        schemas.forEach((schema) => {
            this.keyRouter[schema.method](schema.path, [validateMiddleware(schema.schemaInput), schema.handler]);
        });
    }
    private generateDocs(schemas: { forEach: (arg0: (schema: ISchemaRoutes) => void) => void }) {
        const group: { [key: string]: Array<any> } = {};
        schemas.forEach((schema) => {
            if (!group[schema.group]) {
                group[schema.group] = [];
            }
            group[schema.group].push(schema);
        });
        const docs = Object.entries(group).map((value) => {
            return { groupName: value[0], routes: value[1] };
        });
        return docs;
    }
}
