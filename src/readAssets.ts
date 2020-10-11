// This function creates a stream, pipes the stream into a csv parser, appends the rows to an array, and then returns the array
// once the promise has resolved

import fs from "fs";
import path from "path";
import parse from "csv-parse/lib/sync";
import { Assets } from './interfaces/assetsInterface'
  

export default function readAssets(
    assetFileName: string
  ): Assets[] {
    var assetPath = path.join(__dirname, "../assets/");
  
    const assetsFile = fs.readFileSync(assetPath + assetFileName);
  
    const assets = parse(assetsFile, { columns: true });
  
    
  
    return assets;
  }

// export default async function readAssets(
//   assetFileName: string
// ): Promise<Assets[]> {
//   var assetPath = path.join(__dirname, "../assets/");

//   const assetsFile = await fs.promises.readFile(assetPath + assetFileName);

//   const assets = await parse(assetsFile, { columns: true });

  

//   return assets;
// }

// Streaming version

// export default function readAssets(assetFileName: string): Promise<any[]> {
//   return new Promise((resolve, reject) => {
//     var assetPath = path.join(__dirname, "../assets/");

//     const assets: any[] = [];

//     var parser = parse({ columns: true }, function (error, data) {
//       if (error) {
//         console.log(error);
//       }
//       return data;
//     });

//     let read_stream = fs
//       .createReadStream(path.join(assetPath + assetFileName))
//       .pipe(parser);

//     read_stream.on("data", function (row) {
//       assets.push(row);
//     });

//     read_stream.on("error", (e) => {
//       reject(e);
//     });

//     return read_stream.on("end", function () {
//       resolve(assets);
//     });
//   });
// }
