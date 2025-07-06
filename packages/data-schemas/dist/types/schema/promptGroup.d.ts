import { Document, Types } from 'mongoose';
export interface IPromptGroup {
    name: string;
    numberOfGenerations: number;
    oneliner: string;
    category: string;
    projectIds: Types.ObjectId[];
    productionId: Types.ObjectId;
    author: Types.ObjectId;
    authorName: string;
    command?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface IPromptGroupDocument extends IPromptGroup, Document {
}
declare const promptGroupSchema: any;
export default promptGroupSchema;
