// This is to specify the types for typescript. This package does not come with types.
///<reference path="../types/geo-tz.d.ts"/>

import geoTz from "geo-tz";
//import moment from "moment";
import readAssets from "./readAssets";
import writeAssets from "./writeAssets";
import { Assets } from "./interfaces/assetsInterface";
import moment from "moment-timezone";
import haversineDistance from "./haversineDistance";

// This function appends to assets assets,

export default function appendAsset(
  id: string,
  lat: string,
  lng: string,
  workingAssetFile: string
): Assets[] {
  var assets = readAssets(workingAssetFile);

  if (Math.abs(parseFloat(lat)) > 90) {
    console.log("The lattitude must be between +- 90 degrees ")
    return assets
  }

  if (Math.abs(parseFloat(lng)) > 180) {
    console.log("The longitude must be between +- 180 degrees ")
    return assets
  }

  var timezone = geoTz(parseFloat(lat), parseFloat(lng));
  var currentTime = new Date().getTime();

  var assetsWithSameId = assets.filter((asset) => asset.id == id);


  var distance_traveled;

  if (assetsWithSameId.length > 0 ) {
    console.log("there is another asset with this id");
    var sortedAssestsWithSameId = assetsWithSameId.sort(function (a, b) {
      return parseInt(a.timestamp_utc) - parseInt(b.timestamp_utc);
    });
    var mostRecentLocation =
      sortedAssestsWithSameId[sortedAssestsWithSameId.length - 1];
    distance_traveled = haversineDistance(
      parseFloat(mostRecentLocation.lat),
      parseFloat(mostRecentLocation.lng),
      parseFloat(lat),
      parseFloat(lng)
    );
    console.log(
      "The distance in km traveled from the previous check-in is: ",
      distance_traveled
    );
  } else {
    distance_traveled = 0
  }

  const newAsset = {
    id: id,
    timestamp_utc: String(Math.round(currentTime / 1000)),
    lng: lng,
    lat: lat,
    timezone: timezone,
    datetime: moment
      .tz(currentTime, timezone[0])
      .format("DD/MM/YYYY HH:mm z ZZ"),
    distance: String(distance_traveled),
  };

  console.log("the new asset is: ", newAsset);

  assets.push(newAsset);
  writeAssets(assets, workingAssetFile);

  return assets;
}
