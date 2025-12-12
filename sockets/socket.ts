// Logica para desconectar un cliente

import { Socket } from "socket.io";
import socketIO from "socket.io";
export const desconectar = (cliente: Socket) => {
  cliente.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
};
// Escuchar mensajes
export const mensaje = (cliente: Socket, io: socketIO.Server) => {
  cliente.on("mensaje", (payload: { de: string; cuerto: string }) => {
    console.log("mensaje recibido", payload);

    // emitir a todos los usuarios lo que vino en 'mensaje'
    // "io" tiene el control de saber que persinas estan conectadas
    io.emit("mensaje-nuevo", payload);
  });
};
