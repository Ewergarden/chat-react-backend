import jwt from 'jsonwebtoken'
import {IUsers} from "../models/Users";
import {reduce} from "lodash";

interface  IloginData {
    email: string,
    password: string
}

export default  (user: IloginData) => {

    let token = jwt.sign (
        {
            data:  reduce(user,(result:any,value,key) => {
                if(key !== 'password') {
                    result[key] = value;
                }

                return result;
            }, { })
        },
        process.env.JWT_SECRET || "",
        {
            expiresIn: process.env.JWT_MAX_EGE,
            algorithm: "HS256"
        }
    )

    return token;

}