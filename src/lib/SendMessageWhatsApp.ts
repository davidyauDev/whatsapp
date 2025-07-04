import fs from "fs";
import { MessageMedia, Client } from "whatsapp-web.js";
import HandleWhatsApp from "./HandleWhatsApp";
import FileManager from "../helpers/FileManager";
import { ISendMessageWhatsApp } from "../interfaces/ISession";
const { cleanNumber } = new HandleWhatsApp();
class SendMessageWhatsApp implements ISendMessageWhatsApp{
     declare DELAY_TIME: number;
     declare DIR_MEDIA: string;
     constructor() {
          this.DELAY_TIME = 70;
          this.DIR_MEDIA = FileManager.getPath('mediaSend');
     }
     async sendMedia(client: Client, number: string, fileName: string,sessionId:string) {
          try {
               number = cleanNumber(number);
               if (fs.existsSync(fileName)) {
                    const media = MessageMedia.fromFilePath(fileName);
                    await client.sendMessage(number, media, { sendAudioAsVoice: true });
                    fs.unlinkSync(fileName);
               }
          } catch (ex) {
               console.log(`error al enviar archivos del cliente : `,sessionId);
          }
     }
     async sendMessage(client: Client, number: string, text: string) {
          try {
               console.log(`⚡⚡⚡ se procede a enviar mensajes....`);
               number = cleanNumber(number)
               const message = text
               await client.sendMessage(number, message);
               console.log(`⚡⚡⚡ Enviando mensajes....`);
          }
          catch (e) {
               console.log(`⚡⚡⚡ Error....`);
          }
     }
}

export default new SendMessageWhatsApp();