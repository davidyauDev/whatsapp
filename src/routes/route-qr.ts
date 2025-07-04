import express from 'express';
import { Server } from 'socket.io';
import WhatsAppController from '../controllers/WhatsAppController';
const router = express.Router();
const routerQr = (io: Server) => {
     /**
      * @swagger
      * /api/qr:
      *   post:
      *     summary: Obtener QR
      *     description: Obtiene el QR de sessionId inicializada.
      *     requestBody:
      *       required: true
      *       content:
      *         application/json:
      *           schema:
      *             type: object
      *             properties:
      *               sessionId:
      *                 type: string
      *                 description: ID de sesión como una cadena
      *     responses:
      *       '200':
      *         description: Imagen SVG del código QR
      *         content:
      *           image/svg+xml:
      *             schema:
      *               type: string
      *               format: binary
      *       '500':
      *         description: Error de solicitud, por ejemplo, si falta el campo sessionId o por otro error
      */
     router.post("/qr", (req, res) => WhatsAppController.sendQr(req, res, io));
     return router;
}
export default routerQr;