import { config } from "dotenv";
config();
import fs from "fs";
import express from "express";
import bodyParser from "body-parser";
import http from "http";
import https from "https";
import { networkInterfaces } from "os";
import cors from "cors";
import WhatsAppSessionManager from "./src/lib/WhatsAppSessionManager";
import { Server } from "socket.io";
import swaggerOptions from './swaggerOptions';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import routerQr from "./src/routes/route-qr";
import routerSend from "./src/routes/route-send";
import routerClientInitialize from "./src/routes/route-client-initialize";
import routerClientDestroy from "./src/routes/route-client-destroy";
import routerClientLogout from "./src/routes/route-client-logout";
import { resources } from "./resources";

const ip = networkInterfaces();
let ipAddres = Object.values(ip)
    .flat()
    .filter((data) => data?.family === "IPv4" && !data.internal)
    .map(data => data?.address)[0];
// Configuración de Swagger
const swaggerSpec = swaggerJSDoc(swaggerOptions);

let httpServer;
const app = express();
if (process.env.SUPERVISOR_GROUP_NAME === "wspapi-app") {
    let options = {
        key: fs.readFileSync(resources.host.key),
        ca: fs.readFileSync(resources.host.ca),
        cert: fs.readFileSync(resources.host.cert),
        requestCert: false,
        rejectUnauthorized: false,
    }
    console.log('ssl');
    httpServer = https.createServer(options, app);
} else {
    console.log('sin ssl');
    httpServer = http.createServer({}, app);
    ipAddres = "127.0.0.1";
}
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("port", 4000);
app.set("host", ipAddres);
// Middleware para servir la documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const io = new Server(httpServer, {
    allowEIO3: true
});
app.use('/api', routerQr(io));
app.use('/api', routerSend(io));
app.use('/api', routerClientInitialize(io));
app.use('/api', routerClientDestroy());
app.use('/api', routerClientLogout());
const ws = WhatsAppSessionManager;
httpServer.listen(app.get("port"), () => {
    ws.restorePreviousSessions(io);
    console.log(`Server iniciado en http://${app.get("host")}:${app.get("port")}`);
});
