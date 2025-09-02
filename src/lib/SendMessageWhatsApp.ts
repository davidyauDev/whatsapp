import fs from "fs";
import { MessageMedia, Client } from "whatsapp-web.js";
import HandleWhatsApp from "./HandleWhatsApp";
import FileManager from "../helpers/FileManager";
import { ISendMessageWhatsApp } from "../interfaces/ISession";
const { cleanNumber } = new HandleWhatsApp();

class SendMessageWhatsApp implements ISendMessageWhatsApp {
  declare DELAY_TIME: number;
  declare DIR_MEDIA: string;
  constructor() {
    this.DELAY_TIME = 70;
    this.DIR_MEDIA = FileManager.getPath("mediaSend");
  }

  async sendMedia(
    client: Client,
    number: string,
    fileName: string,
    sessionId: string,
    caption?: string
  ) {
    try {
      number = cleanNumber(number);
      console.log("[sendMedia] to:", number, "file:", fileName, "caption?", !!caption);

      if (fs.existsSync(fileName)) {
        const media = MessageMedia.fromFilePath(fileName);
        await client.sendMessage(number, media, { caption });
        console.log("[sendMedia] enviado media + caption");
        fs.unlinkSync(fileName);
      } else {
        console.log("[sendMedia] NO existe el archivo:", fileName);
      }
    } catch (ex) {
      console.log(`[sendMedia] error al enviar archivos (session ${sessionId}):`, ex);
    }
  }

  async sendMessage(client: Client, number: string, text: string) {
    try {
      number = cleanNumber(number);
      console.log("[sendMessage] to:", number, "text:", text?.slice(0, 40));
      await client.sendMessage(number, text);
      console.log("[sendMessage] enviado SOLO TEXTO");
    } catch (e) {
      console.log("[sendMessage] error:", e);
    }
  }
}

export default new SendMessageWhatsApp();
