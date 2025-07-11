import { Document, Types } from 'mongoose';
export interface IBalance extends Document {
    user: Types.ObjectId;
    tokenCredits: number;
    autoRefillEnabled: boolean;
    refillIntervalValue: number;
    refillIntervalUnit: 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months';
    lastRefill: Date;
    refillAmount: number;
}
