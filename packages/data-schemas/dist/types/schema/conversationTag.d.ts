import { Document } from 'mongoose';
export interface IConversationTag extends Document {
    tag?: string;
    user?: string;
    description?: string;
    count?: number;
    position?: number;
}
declare const conversationTag: any;
export default conversationTag;
