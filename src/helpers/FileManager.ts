import path from 'path';
import fs from 'fs';
import { readdir } from "fs/promises";
import { rimrafSync } from "rimraf";
class FileManager {
     declare directoryMain: string;
     constructor() {
          this.directoryMain = process.cwd();
     }
     getDirectories = async (source: string) => {
          return (await readdir(`${this.directoryMain}/${source}`, { withFileTypes: true })).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);
     };
     createFolder(dirs: string) {
          try {
               const segments = dirs.split(path.sep);
               let currentPath = path.join(this.directoryMain);
               segments.forEach(segment => {
                    currentPath = path.join(currentPath, segment);
                    console.log(currentPath);
                    if (!fs.existsSync(currentPath)) {
                         fs.mkdirSync(currentPath);
                    }
               });
          } catch (ex) {
               console.log(`ERROR AL CREAR CARPETA: ${dirs}`, ex);
          }
     }
     getFiles(dir: string) {
          let directory = `${this.directoryMain}/${dir}`;
          const files = fs.readdirSync(directory);
          return files;
     }
     existsFolder(dir: string) {
          return fs.existsSync(`${this.directoryMain}/${dir}`);
     }
     getPath(dir: string) {
          if (this.existsFolder(dir)) {
               return `${this.directoryMain}/${dir}`;
          } else {
               this.createFolder(dir);
               return `${this.directoryMain}/${dir}`;
          }
     }
     deleteFolder(dir: string) {
          const path = this.getPath(dir);
          return rimrafSync(path);
     }
}
export default new FileManager();