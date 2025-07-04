import fs from 'fs';
import { Request, Response } from "express";
import { Server } from "socket.io";
import FileManager from "../helpers/FileManager";
import WhatsAppSessionManager from '../lib/WhatsAppSessionManager';
import SendMessageWhatsApp from '../lib/SendMessageWhatsApp';

class WhatsAppController {
     declare private ws;
     declare private sms;
     declare private fm;
     constructor() {
          this.ws = WhatsAppSessionManager;
          this.sms = SendMessageWhatsApp;
          this.fm = FileManager;
     }
     sendQr(req: Request, res: Response, io: Server) {
          try {
               const { sessionId } = req.body;
               if (!sessionId) throw new Error('Envia tu sessionId');
               let client = this.ws.getClientSessionId(sessionId);
               if (client.info) throw new Error('Ya tienes una session iniciada');
               const files = this.fm.getFiles('QR');
               const find = files.find(x => x === `${sessionId}-qrcode.svg`);
               if (!find) throw new Error('No existe tu sessionId');
               res.writeHead(200, { 'content-type': 'image/svg+xml' });
               fs.createReadStream(`${process.cwd()}/QR/${sessionId}-qrcode.svg`).pipe(res);
          } catch (ex: any) {
               res.status(500).send({ status: 500, message: ex.message });
          }
     }
     async sendMessage(req: Request, res: Response) {
          try {

               const { message, to, sessionId } = req.body;
               
               const newNumber = `${to}@c.us`;

               if (!sessionId) throw new Error('Envia tu sessionId');

               let client = this.ws.getClientSessionId(sessionId);
               
               if (client != undefined) {
                    if (!client.info) throw new Error('No has iniciado session');
                    if (req.files) {
                         const files: Express.Multer.File[] = req.files as Express.Multer.File[];
                         if (files.length > 0) {
                              for (let file of files) {
                                   const filePath = file.path;
                                   await this.sms.sendMedia(client, to, filePath, sessionId);
                              }
                         }
                    }
                    await this.sms.sendMessage(client, newNumber, message);
                    res.json({ success: true, message: 'ENVIADO', status: true });
               } else {
                    res.json({ success: true, message: 'INICIALIZAR DISPOSITIVO', status: false })
               }
          } catch (error: any) {
               console.log({ error });
               res.json({ success: false, message: error.message,status:false })
          }
     }
     async clientInitialize(req: Request, res: Response, io: Server) {
          try {

               const { sessionId } = req.body;

               if (!sessionId) throw new Error('Su sessionId debe enviar');

               const currentClient = this.ws.getClientSessionId(sessionId);

               if (currentClient != undefined) {
                    if (currentClient.info) {
                         setTimeout(() => {
                              io.emit("connected", {
                                   sessionId,
                                   status: "CONNECTED",
                                   segundos: 1
                              });
                         }, 2000);
                    }
                    res.status(409).send({ success: false, sessionId, message: "YA HAY UN DISPOSITIVO INICIALIZADO" });
               } else {
                    await this.ws.createWAClient(sessionId, io);
                    res.json({ success: true, sessionId, message: "DISPOSITIVO INICIALIZADO" })
               }
          } catch (error: any) {
               res.status(500).send({ success: false, message: error.message });
          }
     }
     async clientDestroy(req: Request, res: Response) {
          try {
               const { sessionId } = req.body;
               let client = this.ws.getClientSessionId(sessionId);
               if (client != undefined) {
                    await client.destroy();
                    this.ws.removeClient(sessionId);
                    res.json({ success: true, message: "DISPOSITIVO DESTRUIDO" });
               } else {
                    res.status(409).send({ success: false, message: "DISPOSITIVO NO INICIALIZADO" })
               }
          } catch (error: any) {
               res.status(500).send({ success: false, message: error.message })
          }
     }
     async clientLogout(req: Request, res: Response) {
          try {
               const { sessionId } = req.body;
               let client = this.ws.getClientSessionId(sessionId);
               if (client != undefined) {
                    client.logout();
                    this.ws.removeClientObject(sessionId);
                    res.json({ success: true, message: "DISPOSITIVO DESTRUIDO" });
               } else {
                    res.status(409).send({ success: true, message: "DISPOSITIVO NO INICIALIZADO" });
               }
          } catch (error) {
               res.json({ success: false, message: 'Ocurrio un error al cerrar sesion' });
          }
     }
}
export default new WhatsAppController();