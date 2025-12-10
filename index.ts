import Server from "./classes/server";
import router from "./routes/router";
import { SERVER_PORT } from "./global/enviroment";

import bodyParser from "body-parser";
import cors from "cors";

const server = new Server();

// bodyparser - lo que sea lo que POSTen la info lo toma
server.app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
server.app.use(bodyParser.json());
// -----------------------------
// cualquier persona pueda llamar mis servicios REST
server.app.use(cors({ origin: true, credentials: true }));

server.app.use("/", router);

server.start(() => {
  console.log(`Servidor corriendo en el puerto${SERVER_PORT}`);
});
