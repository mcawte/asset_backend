// This function transforms the asset onbject into a csv string,
// writes the stream to a file and returns a promise of null once the promise has been resolved.

import fs from "fs";
import path from "path";
import { Assets } from "./interfaces/assetsInterface";

export default function writeAssets(
  assets: Array<Assets>,
  filename: string
): null {
  let assetPath = path.join(__dirname, "../assets/");

  let csv = "";
  let header = Object.keys(assets[0]).join(",");
  let values = assets.map((o) => Object.values(o).join(",")).join("\n");

  csv += header + "\n" + values;

  fs.writeFileSync(assetPath + filename, csv);

  return null;
}

// export default async function writeAssets(assets: Array<Assets>, filename: string) {
//   let assetPath = path.join(__dirname, "../assets/");

//   stringify(
//     assets,
//     {
//       header: true,
//     },
//     async function (error, output) {
//       if (error) {
//         console.log(error);
//       }
//       if (typeof output == "string") {
//         await fs.promises.writeFile(assetPath + filename, output);
//       }
//     }
//   );
// }
