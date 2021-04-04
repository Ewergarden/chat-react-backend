// @ts-ignore
import {Schema,Document} from 'mongoose'
// @ts-ignore
import * as mongoose from "mongoose";


export interface IUploadFile extends Document {
    filename: string;
    size: number;
    url: string;
    ext: string;
    message: string;
    user: string;
}




const UploadFileSchema = new Schema(
    {
        filename: String,
        size: Number,
        url: String,
        ext: String,
        message: {type: Schema.Types.ObjectId,ref: 'Message', require:true},
        user: {type: Schema.Types.ObjectId,ref: 'User', require:true}
    },
    {
        timestamps:true
    }
);



const UploadModel = mongoose.model<IUploadFile>('Upload', UploadFileSchema)


// @ts-ignore
export default UploadModel;