import { Request, Response, NextFunction } from 'express';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { AppError, HttpCode } from '../exceptions/AppError';

const AJV = addFormats(new Ajv(), [
    'date-time',
    'time',
    'date',
    'email',
    'hostname',
    'ipv4',
    'ipv6',
    'uri',
    'url',
    'uri-reference',
    'uuid',
    'uri-template',
    'json-pointer',
    'relative-json-pointer',
    'regex',
]);

export const validateMiddleware = (schema: any) => (req: Request, res: Response, next: NextFunction) => {
    try {
        const validate = AJV.compile(schema);
        const isValid = validate({
            params: req.params,
            query: req.query,
            body: req.body,
        });
        if (!isValid)
            throw new AppError({
                httpCode: HttpCode.BAD_REQUEST,
                description: 'invalid object in input',
                details: validate.errors,
            });
        next();
    } catch (error) {
        next(error);
    }
};
