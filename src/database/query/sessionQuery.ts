import { Connection } from "mysql2/typings/mysql/lib/Connection";
import { ISession } from "../../interfaces/ISession";
import { conexion } from "../conexion";

class SessionQuery {
     async first(clientId: string) {
          let query = "SELECT * FROM sessions where client_id =?";
          const db = await conexion();
          const [result] = await db.execute(query, [clientId]);
          db.end();
          return result;
     }
     async insert(session: ISession) {
          let query = `INSERT INTO sessions(client_id,ip,client,created_at)VALUES(?,?,?,?)`;
          const db = await conexion();
          const [result] = await db.execute(query, [
               session.client_id,
               session.ip,
               session.client,
               session.created_at
          ]);
          await db.end();
          return result;
     }
}
export default new SessionQuery();
