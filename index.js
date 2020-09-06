const express = require('express');
const gtfs = require('gtfs-realtime-bindings');
const request = require('request');

const fs = require('fs');

const app = express();

// Allowing cross domain, e.g for heroku usage
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
  });

// Getting api key from the apikey.txt file
const apikey = fs.readFileSync("apikey.txt").toString();
const databuses = fs.readFileSync("data.txt").toString();


// Request settings, url & headers if needed
const requestSettings = [{
    method: 'POST', // change this to get/post depending on the api youre using, mine is requesting me to use the post method
    url: 'https://api.stm.info/pub/od/gtfs-rt/ic/v1/vehiclePositions',
    headers: {'apikey': apikey},
    encoding: null,
}, {
  method: 'POST', // change this to get/post depending on the api youre using, mine is requesting me to use the post method
  url: 'https://api.stm.info/pub/od/gtfs-rt/ic/v1/tripUpdates',
  headers: {'apikey': apikey},
  encoding: null,
}]


// Vehicles endpoint
app.get("/api/vehicles", (req, res) => {
  // Requesting 
    request(requestSettings[0], function (error, response, body) {
        if (!error && response.statusCode == 200) {
          // Data variable
          let data;
          // Decoding data with GTFS
          var feed = gtfs.transit_realtime.FeedMessage.decode(body);

        
          if (feed.entity) {
            data = feed.entity;
          } else {
              throw "No vehicles"
          }

          // Pushing the vehicle count to the vehicles array
          data.push({"vehicleCount": data.length});

          // Sending response with data
          res.send(data);
        } else {
          // If status code isnt 200
            res.send("Cannot request to STM API")
        }
      });
});

// Trip updates endpoint
app.get("/api/tripupdates", (req, res) => {
  // Requesting 
    request(requestSettings[1], function (error, response, body) {
        if (!error && response.statusCode == 200) {
          //Data variable
          let data;
          // Decoding data with GTFS
          var feed = gtfs.transit_realtime.FeedMessage.decode(body);

        
          if (feed.entity) {
            data = feed.entity;
          } else {
              throw "No vehicles"
          }

          // Sending response with data
          res.send(data);
        } else {
          // If status code isnt 200
            res.send("Cannot request to STM API")
        }
      });
});

// Api port
app.listen(5000);

