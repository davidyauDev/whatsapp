import { config } from "dotenv";
config();
import fs from "fs";
import { conexion } from "../conexion";
const arraFiles = ['index.ts'];
const files = fs.readdirSync(__dirname);
let total = [];
files.forEach(async(item) => {
     if (!arraFiles.includes(item)) {
          let path = `${__dirname}/${item}`;
          const content = fs.readFileSync(path, 'utf-8');
          const db = await conexion();
          const [result] = await db.query(content);
          await db.end();
          process.exit(1);
     }
});