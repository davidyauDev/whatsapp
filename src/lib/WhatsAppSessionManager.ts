import WhatsAppWebSession from "./WhatsAppWebSession";
import { Server, Socket } from "socket.io";
import { Client } from "whatsapp-web.js";
import FileManager from "../helpers/FileManager";
import { IWhatsAppSessionManager } from "../interfaces/ISession";
interface SessionIDVsClientInstance {
     [key: string]: Client
}
class WhatsAppSessionManager implements IWhatsAppSessionManager{
     declare private sessionIdVsClientInstance: any;
     declare client: SessionIDVsClientInstance;
     constructor() {
          this.sessionIdVsClientInstance = {};
          this.client = {};
     }
     async createWAClient(sessionId: string, socket: Server) {
          let obj = new WhatsAppWebSession(sessionId, socket);
          this.client[sessionId] = obj.client;
          this.sessionIdVsClientInstance[sessionId] = JSON.parse(JSON.stringify(obj.client, this.replacerFunc()));
     }
     async restorePreviousSessions(socket: Server) {
          if (FileManager.existsFolder('.webjs_auth')) {
               const directoryNames = await FileManager.getDirectories(`.webjs_auth`);
               const sessionsIds = directoryNames.map(name => name.split("-")[1]);
               sessionsIds.forEach(sessionId => {
                    this.createWAClient(sessionId, socket)
               });
          }
     }
     getClientFromSessionId(sessionId: string) {
          return JSON.parse(JSON.stringify(this.client[sessionId], this.replacerFunc()));
     }
     getClientSessionId(sessionId: string) {
          return this.client[sessionId];
     }
     getClientsSession() {
          return this.sessionIdVsClientInstance;
     }
     replacerFunc() {
          const visited = new WeakSet();
          return (key: any, value: any) => {
               if (typeof value === "object" && value !== null) {
                    if (visited.has(value)) {
                         return;
                    }
                    visited.add(value);
               }
               return value;
          };
     }
     removeClient(sessionId: string) {
          try {
               const path = `.webjs_auth/session-${sessionId}`;
               FileManager.deleteFolder(path);
               delete this.client[sessionId];
               if (FileManager.existsFolder(path)) {
                    console.log('No se elimino la directorio ', path);
               } else {
                    console.log(`Carpeta ${path} eliminado correctamente`);
               }
          } catch (ex) {
               console.log('error al eliminar la session de ' + sessionId, { ex });
          }
     }
     removeClientObject(sessionId: string) {
          delete this.client[sessionId];
     }
}

export default new WhatsAppSessionManager();