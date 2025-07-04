import { Client } from "whatsapp-web.js";

export interface ISession {
     id: number;
     client_id: string;
     ip: string;
     client: string;
     created_at: Date
}
export interface IWhatsAppSessionManager {
     getClientSessionId(sessionId: string): Client,
}
export interface ISendMessageWhatsApp {
     sendMedia(client: Client, number: string, fileName: string,sessionId:string): void;
     sendMessage(client: Client, number: string, text: string): void;
}