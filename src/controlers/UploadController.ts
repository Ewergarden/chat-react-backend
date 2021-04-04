import {UploadModel} from "../models";
import express from "express";
import socket from "socket.io";
import cloudinary from "../core/cloudinary";



class UploadController  {
    io: socket.Server;
    constructor(io: socket.Server) {
        this.io = io;

    }

    create = (req: express.Request, res:express.Response) => {
        // @ts-ignore
        const userId = req.user._id
        // @ts-ignore
        const file = req.file

        // @ts-ignore
        cloudinary.uploader.upload_stream(
            { resource_type: "auto" },
            function(error:any, result:any) { const fileData = {
                filename:result.original_filename,
                // @ts-ignore
                size: result.bytes,
                // @ts-ignore
                ext: result.format,
                // @ts-ignore
                url: result.url,
                user: userId


            }

                const uploadFile = new UploadModel(fileData)
                uploadFile
                    .save()
                    .then((fileObj:any) => {
                        res.json({
                            status:"success",
                            file: fileObj
                        })
                    }).catch(reason => {
                    res.json(reason);
                }) }
        ).end(file.buffer);



    }



    delete = () => {

    }

}

export  default UploadController;
