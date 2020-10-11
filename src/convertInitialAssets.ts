// This is to specify the types for typescript. This package does not come with types.
///<reference path="../types/geo-tz.d.ts"/>

import geoTz from "geo-tz";
import moment from "moment-timezone";
import { Assets } from "./interfaces/assetsInterface";
import readAssets from "./readAssets";
import writeAssets from "./writeAssets";

// This function takes in a filename for the initial assets,
// adds the timezone and time and then saves as timezoned_assets.csv in the assets directory.

export default function convertInitialAssets(assetFileName: string, convertedAssetFileName: string): Assets[] {
  var assets = readAssets(assetFileName);

  assets.map((asset) => {
    console.log("The asset is: ", asset);

    asset.timezone = geoTz(parseFloat(asset.lat), parseFloat(asset.lng)); // Get timezone from lattitude and longitude

    var assetDateTime = moment.tz(
      new Date(parseInt(asset.timestamp_utc) * 1000),
      asset.timezone[0]
    ); // Convert from unix datetime to js format and set timezone. Choose first timezone in array.

    console.log(
      "The asset datetime is: ",
      assetDateTime.format("DD/MM/YYYY HH:mm z ZZ")
    );

    asset.datetime = assetDateTime.format("DD/MM/YYYY HH:mm z ZZ");
    asset.distance = '0'

    console.log("The asset is now: ", asset);
  });

  // Write the timezoned assets to the new csv file
  writeAssets(assets, convertedAssetFileName);

  return readAssets(convertedAssetFileName)
}
