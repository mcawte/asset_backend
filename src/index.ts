// ***************************************************************************************************************
// Enter in the name of the asset csv file. Asset files must be inside the assets folder in the root of the project
var assetFileName = "timezone.csv";
// Name for working asset file (Initial asset file is only read from)
var convertedAssetFileName = "converted_timezone_assets.csv";

// Set ports for services
const expressPort = 3000;
const webSocketServerPort = 8000;
// ***************************************************************************************************************




// This is to specify the types for typescript. This package does not come with types.
///<reference path="../types/geo-tz.d.ts"/>

// import packages
import webSockets from "websocket";
//import WebSocket from 'ws';
const WebSocketServer = require("ws").Server;
//import http from 'http';
import geoTz from "geo-tz";
import express from "express";
import moment from "moment-timezone";
// Set locale for moment. This is required to show timezones in abbreviated form.
moment.locale("en-IN");
import convertInitialAssets from "./convertInitialAssets";
import appendAsset from "./appendAsset";



//Top level async function
(async function () {


// ***************************************************************************************************************
// Part 1, load and create a new csv file with the timezones added

  // This loads the initial assets, adds the timezone and datetime and saves as a new csv.
  var assets = convertInitialAssets(assetFileName, convertedAssetFileName); 

// ***************************************************************************************************************
//Extension 1, create a REST API using express

  const app = express();
  

  app.get("/", (_req, res) => {
    res.send(`This site can give timezones for each asset. <br/>
    The routes are as follows: </br> 
    1. /assets lists all current assets.</br> 
    2. /assetId/:id gives the assets for the given id </br>
    3. /lat/:lat/lng/:lng returns the timezone for a given lattitude and longitude </br>
    4. /addAsset/assetId/:assetId/lat/:lat/lng/:lng allows one to add a new asset with
    a given id, lattitude, and longitude.

    `);
  });

  app.get("/assets", (_req, res) => {
    res.json(assets);
  });

  app.get("/lat/:lat/lng/:lng", (req, res) => {
    res.json({
      timezone: geoTz(parseFloat(req.params.lat), parseFloat(req.params.lng)),
    });
  });

  app.get("/assetId/:assetId", (req, res) => {
    const assetById = assets.find((asset) => asset.id === req.params.assetId);
    if (assetById) {
      res.json(assetById);
    } else {
      res.send("There is no asset with this Id");
    }
  });

  // The route for addAsset has been moved below the code for initializing the websockets

  // Set express to listen
  app.listen(expressPort, () => {
    console.log(`Rest API listening at http://localhost:${expressPort}`)});



// ***************************************************************************************************************
// Extension 2 - Distance forumla implemented  

// The haversine formula is called for all assets that appear with the same id.


// ***************************************************************************************************************
// Extension 3 - Websockets


    // create websocket server
    const wss = new WebSocketServer({ port: webSocketServerPort });

    wss.on("connection", function connection(ws: {
      on: (arg0: string, arg1: (message: any) => void) => void;
      send: (arg0: string) => void;
    }) {
      ws.on("message", function incoming(message) {
        console.log("received: %s", message);

        var message_object = JSON.parse(message);

        // If the client has sent a new asset, append it to the asset array, save as csv, and broadcast out to the clients
        if (
          message_object.hasOwnProperty("id") &&
          message_object.hasOwnProperty("lat") &&
          message_object.hasOwnProperty("lng")
        ) {
          console.log("The message has an id, lat and lng");
          var workingAssetFile = convertedAssetFileName;

          assets = appendAsset(
            message_object.id,
            message_object.lat,
            message_object.lng,
            workingAssetFile
          );

          wss.broadcast(JSON.stringify(assets));
        }
      });

      // send out initial asset data
      ws.send(JSON.stringify(assets));
    });

    // create websocket client
    var client = new webSockets.client();

    client.on("connectFailed", function (error) {
      console.log("Connect Error: " + error.toString());
    });

    client.on("connect", function (connection) {
      console.log("WebSocket Client Connected");
      connection.on("error", function (error) {
        console.log("Connection Error: " + error.toString());
      });
      connection.on("close", function () {
        console.log("echo-protocol Connection Closed");
      });
      connection.on("message", function (message) {
        if (message.type === "utf8") {
          console.log("Client Received utf8: '" + message.utf8Data + "'");
        }
      });
    });

    // connect websocket client to server
    client.connect(`ws://127.0.0.1:${webSocketServerPort}`);

    // define broadcast function
    wss.broadcast = function (data: any) {
      wss.clients.forEach((client: { send: (arg0: any) => any }) =>
        client.send(data)
      );
    };

    // Express route for add asset. Broadcasts all assets via websockets when added
    app.post("/addAsset/assetId/:assetId/lat/:lat/lng/:lng", (req, res) => {
      var workingAssetFile = convertedAssetFileName;

      assets = appendAsset(
        req.params.assetId,
        req.params.lat,
        req.params.lng,
        workingAssetFile
      );

      wss.broadcast(JSON.stringify(assets));

      res.json(assets);
    });

    // Unique client id websocket code

    //     const websocketsServerPort = webSocketServerPort;

    //     const httpServer = http.createServer();
    //     httpServer.listen(websocketsServerPort);

    //     const wsServer = new webSockets.server({
    //         httpServer: httpServer
    //     })

    //     const clients: webSockets.connection[] = [];

    // // This code generates unique userid for everyuser.
    // const getUniqueID = (): number => {
    //   const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    //   return parseInt(s4() + s4() + '-' + s4());1
    // };

    // wsServer.on('request', function(request) {
    //     var userID = getUniqueID();
    //     console.log((new Date()) + ' Recieved a new connection from origin ' + request.origin + '.');
    //     // You can rewrite this part of the code to accept only the requests from allowed origin
    //     const connection = request.accept(undefined, request.origin);
    //     clients[userID] = connection;
    //     console.log('connected: ' + userID + ' in ' + Object.getOwnPropertyNames(clients))

    //     connection.send(JSON.stringify(assets))

    //     connection.on('message', function(message) {
    //       if (message.type === 'utf8' && message.utf8Data !== undefined) {
    //           console.log('Received Message: ' + message.utf8Data);
    //           //connection.sendUTF(message.utf8Data);

    //           clients.forEach(function(client) {
    //             //console.log("the client to send to is: ", client)
    //             if (message.utf8Data !== undefined) {
    //             client.send(message.utf8Data)}
    //           })

    //       }
    //       else if (message.type === 'binary' && message.binaryData !== undefined) {
    //           console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
    //           connection.sendBytes(message.binaryData);
    //       }

    //       connection.on('close', function(_reasonCode, _description) {
    //         console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    //     });
    //   });
    //   });
  
})();
