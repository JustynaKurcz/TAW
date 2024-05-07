import {model, Schema} from 'mongoose';
import {IEmail} from "../models/email.model"

export const EmailSchema: Schema = new Schema({
    sender: {type: String, required: true, default: 'justyna.kurcz1@gmail.com'},
    recipient: {type: String, required: true},
    subject: {type: String, required: true},
    message: {type: String, required: true},
    createDate: {type: Number, default: Date.now}
})

export default model<IEmail>('Email', EmailSchema);
