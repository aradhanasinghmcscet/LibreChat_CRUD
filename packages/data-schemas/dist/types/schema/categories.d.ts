import { Document } from 'mongoose';
export interface ICategory extends Document {
    label: string;
    value: string;
}
declare const categoriesSchema: any;
export default categoriesSchema;
