import express from "express";
// @ts-ignore
import {AuthJWT} from "../utils"
import {IUsers} from "../models/Users";




// @ts-ignore
export default (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): void => {
    if (
        req.path === "/user/login" ||
        req.path === "/user/registration" ||
        req.path === "/user/verify"
    ) {
        return next();
    }


    const token = req.headers.token;
    // @ts-ignore
    AuthJWT(token).then((user:any) => {
        // @ts-ignore
        req.user = user.data._doc
        next()
    }).catch(() => {
        res.status(403)
            .json({message:"Ошибка токена"})
    })

}