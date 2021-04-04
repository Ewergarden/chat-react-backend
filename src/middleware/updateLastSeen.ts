import {UserModel} from "../models";
import express from "express";


export default (req: express.Request, __:express.Response, next: express.NextFunction) => {
    // @ts-ignore
    if (req.user) {
        // @ts-ignore
        UserModel.findOneAndUpdate({_id:req.user._id},{last_seen:new Date()},{new:true},() => {});
        next()
    }
}