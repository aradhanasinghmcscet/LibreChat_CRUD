import { Document } from 'mongoose';
export interface IBanner extends Document {
    bannerId: string;
    message: string;
    displayFrom: Date;
    displayTo?: Date;
    type: 'banner' | 'popup';
    isPublic: boolean;
}
declare const bannerSchema: any;
export default bannerSchema;
