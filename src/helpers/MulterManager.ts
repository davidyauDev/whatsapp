import multer from "multer";
import FileManager from './FileManager';
import { ISendMessageWhatsApp, IWhatsAppSessionManager } from "../interfaces/ISession";
class MulterManager {
     storage() {
          return multer.diskStorage({
               destination: (req, file, cb) => {
                    const id = req.body.sessionId;
                    const uploadPath = FileManager.getPath(`mediaSend/${id}`);
                    cb(null, uploadPath);
               },
               filename: async (req, file, cb) => {
                    cb(null, file.originalname);
               }
          });
     }
}
export default new MulterManager();