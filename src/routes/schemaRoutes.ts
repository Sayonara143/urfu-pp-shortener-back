import ShortenerController from '../controllers/shortener.controller';
import ISchemaRoutes from '../interfaces/ISchemaRoutes.interfaces';
import * as SchemasShortenerInput from '../schemas/input/shortener.schema';
import * as SchemasShortenerOutput from '../schemas/output/shortener.schema';

const shortenerController = new ShortenerController();

export const schemasRoutes: Array<ISchemaRoutes> = [
    {
        path: '/:shortCode',
        method: 'GET',
        name: 'Get shortcode and redirect',
        group: 'shortener',
        schemaInput: SchemasShortenerInput.getLinkToRedirect,
        schemaOutput: SchemasShortenerOutput.getLinkToRedirect,
        handler: shortenerController.getLinkToRedirect,
    },
    {
        path: '/stat',
        method: 'POST',
        name: 'Get statistics by shortlink',
        group: 'shortener',
        schemaInput: SchemasShortenerInput.getStatForLink,
        schemaOutput: SchemasShortenerOutput.getStatForLink,
        handler: shortenerController.getStatForLink,
    },
    {
        path: '/create',
        method: 'POST',
        schemaInput: SchemasShortenerInput.createShortener,
        schemaOutput: SchemasShortenerOutput.createShortener,
        name: 'Create shortlink',
        group: 'shortener',
        handler: shortenerController.create,
    },
];
