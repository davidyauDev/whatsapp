import express from 'express';
import { Server } from 'socket.io';
import WhatsAppController from '../controllers/WhatsAppController';
const router = express.Router();

const routerClientInitialize = (io:Server) =>{
      /**
      * @swagger
      * /api/client-initialize:
      *   post:
      *     summary: Inicializa un cliente
      *     description: Esta api inicializa un cliente enviando su sessionId, la cual procedera a generar el codigo QR
      *     requestBody:
      *       required: true
      *       content:
      *         application/json:
      *           schema:
      *             type: object
      *             required:
      *               - sessionId
      *             properties:
      *               sessionId:
      *                 type: string
      *                 description: ID de sesión como una cadena
      *     responses:
      *       '200':
      *         description: Dispositivo inicializado con éxito
      *         content:
      *           application/json:
      *             example:
      *               success: true
      *               sessionId: "tu_session_id"
      *               message: "DISPOSITIVO INICIALIZADO"
      *       '409':
      *         description: Error de solicitud, por ejemplo, si falta el campo sessionId
      *         content:
      *          application/json:
      *            example:
      *              success: false
      *              sessionId: "tu_session_id"
      *              message: "YA HAY UN DISPOSITIVO INICIALIZADO"
      */
     router.post('/client-initialize', (req, res) => WhatsAppController.clientInitialize(req, res, io));
     return router;
}
export default routerClientInitialize;