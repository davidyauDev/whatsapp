import express from 'express';
import WhatsAppController from '../controllers/WhatsAppController';
const router = express.Router();
const routerClientDestroy = ()=>{
       /**
      * @swagger
      * /api/client-destroy:
      *   post:
      *     summary: Destruye un cliente
      *     description: Esta api destruye un  cliente cuando esta generando codigo QR
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
      *         description: DISPOSITIVO DESTRUIDO CON EXITO
      *         content:
      *           application/json:
      *             example:
      *               success: true
      *               sessionId: "tu_session_id"
      *               message: "DISPOSITIVO DESTRUIDO"
      *       '409':
      *         description: Error de solicitud, por ejemplo, si falta el campo sessionId o aun no ha inicializado
      *         content:
      *          application/json:
      *            example:
      *              success: false
      *              sessionId: "tu_session_id"
      *              message: "DISPOSITIVO NO INICIALIZADO"
      */
     router.post('/client-destroy', (req, res) => WhatsAppController.clientDestroy(req, res));
     return router;
}
export default routerClientDestroy;