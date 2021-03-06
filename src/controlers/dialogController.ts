import express from 'express'
import DialogModel from "../models/Dialog";
import MessageModel from "../models/Message";
import socket from "socket.io";

class dialogController {
    io: socket.Server;
    constructor(io: socket.Server) {
        this.io = io;

    }


    index = (req: express.Request, res:express.Response) => {
        // @ts-ignore
        const userId = req.user._id;
        // @ts-ignore
        DialogModel.find().or([{author: userId}, {partner: userId}])
            .populate(['author','partner'])
            .populate({
                path: "lastMessage",
                populate: {
                    path: "user"
                }
            })
            .exec(function (err,dialogs){
                if (err) return  res.status(404).json({
                    message: "Диалоги не найдены"
                })

            return res.json(dialogs);
        })

    }
    delete = (req: express.Request, res:express.Response) =>{
        const id: string = req.params.id;
        DialogModel.findOneAndRemove({_id:id})
            .then(dialog => {
                if (dialog) {
                    res.json({
                        message: 'Диалог удален'
                    });
                }
            })
            .catch(() => {
                res.json({
                    message: "Диалог  не был найден"
                })
            })
    }
    create = (req: express.Request, res: express.Response) =>  {
        const postData = {
            // @ts-ignore
        author: req.user._id,
        partner: req.body.partner,
    }
    const dialog = new DialogModel(postData);
    dialog.save().then((dialogObj: any) => {
        // @ts-ignore
        const message = new MessageModel({
            text: req.body.text,
            dialog: dialogObj._id,
            // @ts-ignore
            user: req.user._id,
        })

        message
            .save()
            .then(() =>{

                dialogObj.lastMessage = message._id
                dialogObj.save().then(() =>{
                    res.json(dialogObj)
                    this.io.emit("SERVER:DIALOG_CREATED",{...postData,dialog:dialogObj})
                })
            })
            .catch(reason => {
            res.json(reason);
        })

    }).catch(reason => {
        res.json(reason);
    })
    }
}

export  default dialogController;