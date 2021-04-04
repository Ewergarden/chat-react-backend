import express from 'express'
import UserModel, {IUsers} from "../models/Users";
import CreateJWT from "../utils/CreateJWT";
import socket from "socket.io"
import {validationResult} from "express-validator";
import has = Reflect.has;
import bcrypt from 'bcrypt'
class UserController {

    io: socket.Server;
    constructor(io: socket.Server) {
        this.io = io;

    }


    show = (req: express.Request, res:express.Response) => {
        const id: string = req.params.id;
        UserModel.findById(id,(err: any, user: any) => {
            if(err) {
                return  res.status(404).json({
                    message: "Нет пользователя"
                })
            }
            res.json(user)
        })
    }
    getMe(req: express.Request, res:express.Response, io:any) {
        // @ts-ignore
        const id: string = req.user._id
        UserModel.findById(id,(err: any, user: any) => {
            if(err) {
                return  res.status(404).json({
                    message: "Нет пользователя"
                })
            }
            res.json(user)
        })
    }
    findUsers = (req: any, res:express.Response) => {
        const query: string = req.query.query
        UserModel.find()
            .or([
                {fullname: new RegExp(query,'i')}
                ,{email:new RegExp(query,'i')}
                ])
            .then((users:any) => res.json(users))
            .catch(err => {
            return  res.status(404).json({
                message: "Нет пользователя"
            })
        })
    }



    delete = (req: express.Request, res:express.Response)=> {
        const id: string = req.params.id;
        UserModel.findOneAndRemove({_id:id})
            .then(user => {
                if (user) {
                    res.json({
                        message: 'Пользователь удален'
                    });
                }
            })
            .catch(() => {
                res.json({
                    message: "Пользователь не был найден"
                })
            })
    }

    verify = (req: express.Request, res: express.Response) => {
        const hash = req.query.hash;

        if(!hash){
            return res.status(422).json({errors: "Ошибка подтверждения"})
        }
        // @ts-ignore
        UserModel.findOne({confirm_hash: hash},(err: any, user: any) => {
            if(err || !user) {
                return  res.status(404).json({
                    message: "Нет пользователя"
                })
            }
            user.confirmed = true;

            // @ts-ignore
            user.save( (err)=>{
                if(err) {
                    return  res.status(404).json({
                        message: "Нет пользователя"
                    })
                }
                res.json({
                    status: "success",
                    message:"Учетная запись была подтверждена"
                })
            })


        })
    }


    create = (req: express.Request, res: express.Response) => {
        const postData = {
            email: req.body.email,
            fullname: req.body.fullname,
            password: req.body.password,
        }
        // const  errors = validationResult(req)
        // if (!errors.isEmpty()) {
        //     return res.status(422).json({errors: errors.array()})
        // }
        const user = new UserModel(postData);
            user.save().then((obj: any) => {
                res.json({obj,status:"success"})
        }).catch(reason => {
            res.status(504).json({
                status: 'error',
                message: reason
            })
        })
       }


    login = (req: express.Request, res: express.Response)=> {
        const postData = {
            email: req.body.email,
            password: req.body.password
        }

        // const  errors = validationResult(req)
        //
        // if (!errors.isEmpty()) {
        //     return res.status(422).json({errors: errors.array()})
        // }

        // @ts-ignore
        UserModel.findOne({email:postData.email},(err,user: any) =>{
            if(err || !user) {
                return  res.status(404).json({
                    status:"error"
                });
            }
            if(bcrypt.compareSync(postData.password, user.password)){
                const token = CreateJWT(user);
                res.json({
                    status:"success",
                    token
                })
            } else {
                res.json({
                    status:"error",
                    message: "Неудача.. "
                })
            }
        })
    }
}

export  default UserController;