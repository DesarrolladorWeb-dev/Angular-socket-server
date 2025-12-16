// Logica para desconectar un cliente

import { Socket } from "socket.io";
import socketIO from "socket.io";
import { UsuariosLista } from "../classes/usuario-lista";
import { Usuario } from "../classes/usuario";
export const usuariosConectados = new UsuariosLista();

export const conectarCliente = (cliente: Socket, io: socketIO.Server) => {
  // enviar la info a la lista usuario
  const usuario = new Usuario(cliente.id);
  usuariosConectados.agregar(usuario);
};

export const desconectar = (cliente: Socket, io: socketIO.Server) => {
  // detecta cuando se desconecta y lo muestra en el servidor
  cliente.on("disconnect", () => {
    console.log("Cliente desconectado");

    usuariosConectados.borrarUsuario(cliente.id);

    io.emit("usuarios-activos", usuariosConectados.getLista());
  });
};
// Escuchar mensajes
export const mensaje = (cliente: Socket, io: socketIO.Server) => {
  //detecta que se ejecuto en el frontend "mensaje"  y lo ejecuta
  cliente.on("mensaje", (payload: { de: string; cuerto: string }) => {
    console.log("mensaje recibido", payload);

    // emit : emitir a todos los usuarios lo que vino en 'mensaje'
    // "io" tiene el control de saber que personas estan conectadas
    io.emit("mensaje-nuevo", payload);
  });
};

// Configurar usuario
export const configurarUsuario = (cliente: Socket, io: socketIO.Server) => {
  cliente.on("configurar-usuario", (payload, callback: Function) => {
    // se actualiza el nombre cuando se ingresa en el Login.ts
    // y puedes recargar y volver a escribir el nombre
    usuariosConectados.actualizarNombre(cliente.id, payload.nombre);
    io.emit("usuarios-activos", usuariosConectados.getLista());

    // das la respuesta en forma de objeto
    callback({
      ok: true,
      mensaje: `Usuario ${payload.nombre},configurado`,
    });
  });
};

// Obtener Usuarios
export const obtenerUsuarios = (cliente: Socket, io: socketIO.Server) => {
  cliente.on("obtener-usuario", () => {
    //estara escuchando
    // Y "emit" emitira todos los usuarios conectados
    // todo pero yo solo quiero emitir a la persona que acaba de entrar al chat y usamos "to" y luego aqui se lo voy a mandar
    // lo que hacemos es mandarle la informacion a la persona que se esta conectando
    // este "usuarios-activos" es lo que esta escuchando en el servicio del frontend en lista-usuarios.component que renderiza el html
    io.to(cliente.id).emit("usuarios-activos", usuariosConectados.getLista());
  });
};
