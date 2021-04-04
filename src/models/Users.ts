import {Schema,Document} from 'mongoose'
import * as mongoose from "mongoose";
import validator from "validator";
import isEmail = validator.isEmail;
import generatePasswordHash from "../utils/generatePasswordHash";
import {differenceInMinutes, parseISO} from 'date-fns'

export interface IUsers extends Document {
    email:string,
    fullname: string,
    password: string,
    avatar?: string,
    confirmed: boolean,
    confirm_hash?: string,
    last_seen?: Date,
}




const UserSchema = new Schema({
    email: {
        type: String,
        require: 'Эмеил обязателен',
        validate: [isEmail , 'Не корректный эмеил'],
        unique:true
    },
    avatar: String,
    fullname: {
        type: String,
        required: 'Полное имя обязательно'
    },
    password: {
        type: String,
        required: 'Пароль обязателен'
    },
    confirmed: {
        type:Boolean,
        default:false
    },
    confirm_hash: String,
    last_seen: {
        type: Date,
        default: new Date()
    }
},
{
    timestamps:true
}
);




UserSchema.virtual('isOnline').get(function (this:any) {
    // @ts-ignore
    return differenceInMinutes( parseISO(new Date().toISOString()) ,this.last_seen) < 5
})

UserSchema.set('toJSON', {
    virtuals: true
})


UserSchema.pre('save', function (next){
    // @ts-ignore
    const user: IUsers = this;
    if(!user.isModified('password')) return next()


    generatePasswordHash(user.password)
        .then(hash => {
            user.password = String(hash);
            generatePasswordHash(user.password).then(confirmHash => {
                user.confirm_hash = String(confirmHash);
                next()
            })
        })
        .catch(err => {
            next(err)
        })
})




const UserModel = mongoose.model<IUsers>('User', UserSchema);

export default UserModel