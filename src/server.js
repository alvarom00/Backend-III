import app from "./app.js";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
dotenv.config();

const httpServer = createServer(app);
const io = new Server(httpServer);

const PORT = process.env.PORT || 8080;

httpServer.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
