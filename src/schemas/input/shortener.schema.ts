import { Type } from '@sinclair/typebox';

export const createShortener = Type.Object({
    body: Type.Object({
        longUrl: Type.String({ format: 'url' }),
        expireAt: Type.Optional(Type.Number()),
    }),
});

export const getLinkToRedirect = Type.Object({
    params: Type.Object({
        shortCode: Type.String(),
    }),
});

export const getStatForLink = Type.Object({
    body: Type.Object({
        shortUrl: Type.String(),
    }),
});

// type Schema = Static<typeof createShortener>
