import bodyParser from "body-parser";
import {checkAuth, updateLastSeen} from "../middleware";
import dotenv from "dotenv";
import mongoose from "mongoose";
import {dialogController, UserController} from "../controlers";
import MessageController from "../controlers/MessageController";
import express from "express";
import socket from "socket.io"
import UploadController from "../controlers/UploadController";
import parser from "./multer";
import upload from "./multer";
import multer from "multer";





const createRouts = (app: express.Express, io: socket.Server) => {
    // @ts-ignore
    const User = new UserController(io);
    const Dialog = new dialogController(io);
    const Messages = new MessageController(io);
    const Upload = new UploadController(io);


    app.use(bodyParser.json());
    app.use(checkAuth)
    // @ts-ignore
    app.post('/user/login', User.login)
    app.get('/user/me',User.getMe)
    app.get('/user/verify', User.verify)
    app.get('/user/find',User.findUsers)
    app.get('/user/:id',User.show)
    app.post('/user/registration', User.create)
    app.delete('/user/:id', User.delete)

    app.use(updateLastSeen);




    app.get('/dialogs',Dialog.index);
    app.post('/dialogs',Dialog.create);
    app.delete('/dialogs/:id',Dialog.delete);

    app.get('/messages',Messages.index);
    app.post('/messages',Messages.create);
    app.delete('/messages',Messages.delete);


    // @ts-ignore
    app.post('/files',upload.single('file'),Upload.create);
    app.delete('/files',Upload.delete);

}

export default  createRouts;