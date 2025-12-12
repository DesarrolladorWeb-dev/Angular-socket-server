import express from "express";
import { SERVER_PORT } from "../global/enviroment";
import { Server as SocketIOServer } from "socket.io";
import http from "http";

import * as socket from "../sockets/socket";

export default class Server {
  private static _instance: Server;

  public app: express.Application;
  public port: number;
  public io: SocketIOServer;
  private httpServer: http.Server;

  private constructor() {
    this.app = express();
    this.port = SERVER_PORT;
    // usamos http como intermediario para conectar el express con SocketIO
    this.httpServer = new http.Server(this.app);
    this.io = new SocketIOServer(this.httpServer);

    this.escucharSockets();
  }
  private escucharSockets() {
    console.log("Escuchando conexiones - sockets");
    // para detectar desde nuestro servidor si nuestro usuario se desconecta o se conecta
    this.io.on("connection", (cliente) => {
      console.log("Cliente conectado");

      // Mensajes
      socket.mensaje(cliente,this.io);

      // Deconectar
      socket.desconectar(cliente);
    });
  }
  // para que solo exista una instancia solo uno de la clase
  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  start(callback: Function) {
    this.httpServer.listen(this.port, () => {
      console.log(`Servidor corriendo en puerto ${this.port}`);
    });
  }
}
