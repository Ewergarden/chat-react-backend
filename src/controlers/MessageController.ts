import express from 'express'

import {MessageModel} from "../models";
import socket from "socket.io";
import DialogModel from "../models/Dialog";

class MessageController {
    io: socket.Server;
    constructor(io: socket.Server) {
        this.io = io;

    }



    index = (req: express.Request, res: express.Response) => {
        // @ts-ignore
        const dialogId: string = req.query.dialog;
        // @ts-ignore
        const userId = req.user._id;
        // @ts-ignore
        MessageModel.updateMany({"dialog":dialogId, user: {$ne: userId}},{
            readed: true
        }, (err:any) => {
            if(err) {
                return res.status(900).json({
                    status: "error",
                    message: err
                })
            }
        })

        // @ts-ignore
        MessageModel.find({dialog: dialogId})
            .populate(["dialog",'user','attachments'])
            .exec(function (err, messages) {
                if (err) return res.status(404).json({
                    message: "Сообщения не найдены"
                })
                return res.json(messages);
            })

    }

    delete = (req: express.Request, res: express.Response) => {
        // @ts-ignore
        const id: string = req.query.id;
        // @ts-ignore
        const userId: string = req.user._id;

        // @ts-ignore
        MessageModel.findById(id,(err, message) => {
            if (err || !message) {
                return res.status(407).json({
                    message: "Сообщение не было найдено"
                })
            }

            if (message.user.toString() === userId) {
                const dialogId = message.dialog;
                message.remove();
                MessageModel.findOne({dialog:dialogId},{},{sort:{'createdAt': -1}},  (err,lastMessage) => {
                    if(err) {
                        res.status(500).json({
                            status:"error"
                        })
                    }

                    // @ts-ignore
                    DialogModel.findById(dialogId,(err,dialog) => {
                        if(err) {
                            res.status(500).json({
                                status:"error"
                            })
                        }
                        dialog.lastMessage = lastMessage;
                        dialog.save()
                    })
                })
                return res.json({
                    status: "success"
                })
            }
        })


    }

    create = (req: express.Request, res: express.Response) => {

        // @ts-ignore
        const userId= req.user._id;
        const postData = {
            text: req.body.text,
            user: userId,
            dialog: req.body._id,
            attachments: req.body.attachments
        }
        const message = new MessageModel(postData);
        message
            .save()
            .then((obj: any) => {

            obj.populate(['dialog','user','attachments'], (err:any,message: any) => {
                if (err){ return res.status(500).json({
                    message: err
                }) }

                DialogModel.findOneAndUpdate(
                    {_id:postData.dialog},
                    {lastMessage:message._id},
                    {upsert:true},
                    function (err) {
                        if(err) {
                            return res.status(500).json({
                                message:err
                            })
                        }
                    }
                )
                res.json(message)
                this.io.emit("SERVER:NEW_MESSAGE", message)
            })
        }).catch(reason => {
            res.json(reason);
        })
    }

}

export  default MessageController;
