import { Document, Types } from 'mongoose';
export interface IMongoProject extends Document {
    name: string;
    promptGroupIds: Types.ObjectId[];
    agentIds: string[];
    createdAt?: Date;
    updatedAt?: Date;
}
declare const projectSchema: any;
export default projectSchema;
