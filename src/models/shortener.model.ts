import mongoose from 'mongoose';
import IShortener from '../interfaces/shortener.interface';

const shortenerSchema = new mongoose.Schema(
    {
        longUrl: {
            type: String,
            required: true,
        },
        shortUrl: {
            type: String,
            required: true,
        },
        shortCode: {
            type: String,
            required: true,
        },
        popularity: {
            type: Number,
            default: 0,
        },
        isLimitedInTime: {
            type: Boolean,
            default: false,
        },
        isOff: {
            type: Boolean,
            default: false,
        },
        expireAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true },
);

const shortenerModel = mongoose.model<IShortener & mongoose.Document>('Shortener', shortenerSchema);

export function createShortener({ longUrl, shortUrl, shortCode, expireAt }: IShortener) {
    let _isLimitedInTime;
    let _expireAt;
    if (expireAt) {
        _isLimitedInTime = true;
        _expireAt = Date.now() + expireAt;
    }
    const shortener = new shortenerModel({
        longUrl,
        shortUrl,
        shortCode,
        isLimitedInTime: _isLimitedInTime,
        expireAt: _expireAt,
    });
    return shortener.save();
}

export function findOnShortenerByShortCode(shortCode: string) {
    return shortenerModel.findOne({ shortCode, isOff: false }, {});
}

export function findShortenerByShortCode(shortCode: string) {
    return shortenerModel.findOne({ shortCode }, {});
}

export function findAndUpdateShortenerByShortCode(shortCode: string) {
    return shortenerModel.findOneAndUpdate({ shortCode, isOff: false }, { $inc: { popularity: 1 } });
}

export function findShortenerByShortUrl(shortUrl: string) {
    return shortenerModel.findOne({ shortUrl }, {});
}

export function offShortenersByExpireAt(date: number) {
    return shortenerModel.updateMany(
        { isLimitedInTime: true, expireAt: { $lte: date }, isOff: false },
        { isOff: true },
    );
}

export default shortenerModel;
