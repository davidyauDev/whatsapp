import mysql2 from "mysql2/promise";
import database from "../config/database";
export const conexion =async()=>{
     return await mysql2.createConnection(database);
};