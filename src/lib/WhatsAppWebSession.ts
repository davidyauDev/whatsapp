import fs from 'fs';
import { Client, LocalAuth } from "whatsapp-web.js"
import qr from "qr-image";
import { Server } from "socket.io";
import FileManager from '../helpers/FileManager';
export default class WhatsAppWebSession {
     declare public client: Client;
     constructor(sessionId: string, socket: Server) {
          this.client = new Client({
               puppeteer: {
                    args: [
                         '--no-sandbox',
                         '--disable-setuid-sandbox'
                    ],
                    headless:'chrome'
               },
               authStrategy: new LocalAuth({
                    clientId: sessionId,
                    dataPath: `${process.cwd()}/.webjs_auth`
               })
          });

          this.client.initialize();

          this.client.on("qr", (qr) => {
               this.generateImage(qr, socket, sessionId);
          });
          this.client.on("ready", () => {
               console.log(`=========================== SESION : ${sessionId} esta lista ==================================`);
               console.log('Listo para escuchas mensajes');
               console.log('Client is ready!');
               console.log('🔴 escribe: hola');
               socket.emit("connected", {
                    sessionId,
                    status: "CONNECTED"
               });
               console.log(`=========================== FIN SESION : ${sessionId} esta lista ===============================`);
          });
          this.client.on("auth_failure", (message) => {
               console.log("Message", message);
          });
          this.client.on("disconnected", (session) => {
               console.log(`Session ${sessionId} desconectado`);
               socket.emit("DISCONNECTED", {
                    sessionId,
                    status: "DISCONNECTED"
               });
          });

          this.client.on("authenticated", (session) => {
               console.log("AUTHENTICATED", session);
               socket.emit("AUTHENTICATED", {
                    sessionId,
                    status: "AUTHENTICATED"
               });
          });

          this.client.on("message", async(message) => {
               const { from, body, hasMedia } = message;
               if (!this.isValidNumber(from)) return;
               console.log(`La session ${sessionId} envio un mensaje`);
          });
     }
     generateImage(base64: string, socket: Server, sessionId: string) {
          FileManager.createFolder('QR');
          let qr_svg = qr.image(base64, { type: "svg", margin: 4 });
          qr_svg.pipe(fs.createWriteStream(`${process.cwd()}/QR/${sessionId}-qrcode.svg`));
          let dataSocket = { sessionId, message: "QR HA CAMBIADO", status: "QR" };
          socket.emit("qr", dataSocket);
          console.log('Qr generado...', sessionId);
     }
     isValidNumber(rawNumber: string) {
          const regexGroup = /\@g.us\b/gm;
          const exist = rawNumber.match(regexGroup);
          return !exist;
     }
}