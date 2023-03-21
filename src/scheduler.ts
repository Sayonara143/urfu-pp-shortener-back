import cron from 'node-cron';
import * as ShortenerModelAPI from './models/shortener.model';

let isStart = false;
export const taskDeleteShortener = cron.schedule(
    '*/30 * * * * *',
    async () => {
        console.log('[START - TASK] delete shortener');
        console.time('[TASK_DELETE_SHORTENER]');
        if (isStart) return;

        isStart = true;

        await ShortenerModelAPI.offShortenersByExpireAt(Date.now())
            .then((res) => {
                console.log('Off shortener: ', res.modifiedCount);
            })
            .catch((err: any) => {
                console.error(err);
            });
        console.timeEnd('[TASK_DELETE_SHORTENER]');
        console.log('[END - TASK] delete shortener');
        isStart = false;
    },
    {
        scheduled: false,
    },
);
