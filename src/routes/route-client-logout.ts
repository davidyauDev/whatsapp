import express from 'express';
import WhatsAppController from '../controllers/WhatsAppController';
const router = express.Router();
const routerClientLogout = ()=>{
       /**
      * @swagger
      * /api/client-logout:
      *   post:
      *     summary: Cierra session
      *     description: Esta api cierra la session de whatsapp
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
     router.post('/client-logout', (req, res) => WhatsAppController.clientLogout(req, res));
     return router;
}

export default routerClientLogout;