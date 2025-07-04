import express from 'express';
import { Server } from 'socket.io';
import WhatsAppController from '../controllers/WhatsAppController';
import multer from 'multer';
import MulterManager from '../helpers/MulterManager';
const router = express.Router();
const upload = multer({ storage: MulterManager.storage() });
const routerSend = (io: Server) => {
     /**
      * @swagger
      * /api/send:
      *   post:
      *     summary: Descripción resumida de otro-endpoint
      *     description: Descripción más detallada de otro-endpoint
      *     requestBody:
      *       required: true
      *       content:
      *         multipart/form-data:
      *           schema:
      *             type: object
      *             required:
      *               - sessionId
      *               - to
      *               - message
      *             properties:
      *               sessionId:
      *                 type: string
      *                 description: ID de sesión como una cadena
      *               to:
      *                 type: string
      *                 description: Destinatario del mensaje
      *               message:
      *                 type: string
      *                 description: Mensaje a enviar
      *               files:
      *                 type: array
      *                 items:
      *                   type: string
      *                   format: binary
      *     responses:
      *       '200':
      *         description: Respuesta exitosa
      *       '400':
      *         description: Error de solicitud, por ejemplo, si faltan campos requeridos
      *       '500':
      *         description: Error interno del servidor
      */
     router.post('/send', upload.array('files'), (req, res) => WhatsAppController.sendMessage(req, res));
     return router;
}
export default routerSend;