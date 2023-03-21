import { Request, Response } from 'express';

interface ISchemaRoutes {
    path: string;
    method: string;
    schemaInput: any;
    schemaOutput: any;
    name: string;
    group: string;
    handler: (req: Request, res: Response) => Promise<any | void>;
}

export default ISchemaRoutes;
