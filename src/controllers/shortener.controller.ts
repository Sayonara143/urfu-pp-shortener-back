import { Request, Response } from 'express';
import * as ShortenerModelAPI from '../models/shortener.model';
import 'express-async-errors';
import { AppError, HttpCode } from '../exceptions/AppError';

class ShortenerController {
    private generateRandomUrl(length: number) {
        const possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        let urlChars = '';

        for (let i = 0; i < length; i++) {
            urlChars += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
        }

        return urlChars;
    }

    getLinkToRedirect = async (req: Request, res: Response) => {
        const { shortCode } = req.params;
        const shortener = await ShortenerModelAPI.findAndUpdateShortenerByShortCode(shortCode);

        if (!shortener || !shortener?.longUrl) {
            throw new AppError({
                httpCode: HttpCode.BAD_REQUEST,
                description: 'Not found long url by this short link',
            });
        }

        res.status(200).json({
            success: true,
            data: {
                longUrl: shortener.longUrl,
            },
            error: null,
        });
    };

    getStatForLink = async (req: Request, res: Response) => {
        const { shortUrl } = req.body;
        const shortener = await ShortenerModelAPI.findShortenerByShortUrl(shortUrl);

        if (!shortener) {
            throw new AppError({
                httpCode: HttpCode.BAD_REQUEST,
                description: 'Not found shortener by this short link',
            });
        }

        res.status(200).json({
            success: true,
            data: {
                shortUrl: shortener.shortUrl,
                longUrl: shortener.longUrl,
                populariity: shortener.popularity,
            },
            error: null,
        });
    };

    create = async (req: Request, res: Response) => {
        const { longUrl, expireAt } = req.body;

        const url = new URL(longUrl);
        if (url.host === process.env.HOST) {
            throw new AppError({
                httpCode: HttpCode.BAD_REQUEST,
                description: 'That is already a Bitly link',
            });
        }

        let shortCode = this.generateRandomUrl(8);
        let shortener = await ShortenerModelAPI.findShortenerByShortCode(shortCode);

        while (shortener) {
            shortCode = this.generateRandomUrl(8);
            shortener = await ShortenerModelAPI.findShortenerByShortCode(shortCode);
        }

        const newShortener = await ShortenerModelAPI.createShortener({
            longUrl,
            shortCode,
            shortUrl: process.env.LINK + '/' + shortCode,
            expireAt,
        });

        res.status(200).json({
            success: true,
            data: {
                shortUrl: newShortener.shortUrl,
            },
            error: null,
        });
    };
}

export default ShortenerController;
