import http from "http";
import https from "https";
import fs from "fs";
import FileManager from "../helpers/FileManager";
// import moment from "moment";
export default class HandleController {

     cleanNumber(number?: string) {
          number = number?.replace("@c.us", "");
          number = `${number}@c.us`;
          return number;
     }

     saveExternalFile(url: string) {
          return new Promise((resolve, reject) => {
               const ext = url.split(".").pop();
               const checkProtocol = url.split("/").includes("https:");
               const handleHttp = checkProtocol ? https : http;
               const name = `${Date.now()}.${ext}`;
               const file = fs.createWriteStream(
                    `${FileManager.getPath('mediaSend')}/${name}`
               );
               console.log(url);
               handleHttp.get(url, function (response) {
                    response.pipe(file);
                    file.on("finish", function () {
                         file.close(); // close() is async, call cb after close completes.
                         resolve(name);
                    });
                    file.on("error", function () {
                         console.log("errro");
                         file.close(); // close() is async, call cb after close completes.
                         resolve(null);
                    });
               });
          });
     }

     checkIsUrl(path: string) {
          try {
               const regex =
                    /^(http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/i;
               const match = path.match(regex) as any;
               return match[0];
          } catch (e) {
               return null;
          }
     }

     isValidNumber(rawNumber: string) {
          const regexGroup = /\@g.us\b/gm;
          const exist = rawNumber.match(regexGroup);
          return !exist;
     }
}
