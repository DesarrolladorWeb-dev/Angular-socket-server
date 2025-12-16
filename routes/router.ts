import { Router, Request, Response } from "express";
import Server from "../classes/server";
import { Socket } from "socket.io";
import { usuariosConectados } from "../sockets/socket";

const router = Router();

// luego el handler
router.get("/mensajes", (req: Request, res: Response) => {
  res.json({
    ok: true,
    mensaje: "Todo esta bien!!",
  });
});

router.post("/mensajes", (req: Request, res: Response) => {
  const cuerpo = req.body.cuerpo;
  const de = req.body.de;
  const payload = { cuerpo, de };

  // desde el resp envio informacion a todos los conectados
  const server = Server.instance;
  server.io.emit("mensaje-nuevo", payload);

  res.json({
    ok: true,
    cuerpo,
    de,
  });
});

router.post("/mensajes/:id", (req: Request, res: Response) => {
  const cuerpo = req.body.cuerpo;
  const de = req.body.de;
  const id = req.params.id;

  const payload = {
    de,
    cuerpo,
  };
  // instancia de nuestro server
  const server = Server.instance;

  // mensajeprivado: in mandar el mensaje a una persona en un canal en particular o sala
  server.io.in(id).emit("mensaje-privado", payload);

  // emit : para enviarselo a todo el mundo

  res.json({
    ok: true,
    cuerpo,
    de,
    id,
  });
});

// Servicio para obtener todos los IDs de los usuarios

router.get("/usuarios", async (req: Request, res: Response) => {
  const server = Server.instance;

  try {
    const sockets = await server.io.fetchSockets();
    // nos dara todos los id de los cliente conectados
    const clientes = sockets.map((s) => s.id);

    res.json({
      ok: true,
      clientes,
    });
  } catch (err) {
    res.json({
      ok: false,
      err,
    });
  }
});

// Obtener usuarios y sus nombres
router.get("/usuarios/detalle", (req: Request, res: Response) => {
  res.json({
    ok: true,
    clientes: usuariosConectados.getLista(),
  });
});

export default router;
