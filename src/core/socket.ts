import socket from "socket.io"
import http from "http"

export  default (http: http.Server) => {
    const io = socket(http)

    io.on('connection', function (socket:socket.Socket){
        socket.on("DIALOGS:JOIN", (id:string)=> {
            socket.id = id
            socket.join(id)
            console.log("Пользователь подключен")
            }
        );
        socket.on("DIALOGS:TYPING",(obj:any)=> {
            // @ts-ignore
            socket
                .to(obj.id)
                .emit("DIALOGS:TYPING",obj)
            console.log(obj)
        })
    })


    return io;
}