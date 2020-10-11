# asset_backend
Backend for Section6 asset tracking project

This project was developed with Node v14.8.0 and the yarn package manager.

To run, download this project to a local directory and run `yarn install`
to initialize the node modules. Once complete use `yarn start` to start the project.


This project first opens the `timezone.csv` file, calculates the timezone from location
and parses the time stamps. It then saves the assets to a new csv file named 
`converted_timezone_assets.csv` in the assets directory of the root of the project folder.


The project then sets up an Express server to provide routes to view assets, either in total or
by id, and to add new assets. The Express server runs on port 3000 of localhost, and the root route
details the other routes to use the API.

The project then finally sets up a websockets server and client to be able to interface with the asset
front-end project, which gives a graphical representation of the location and check-in times of the
assets and a webform to add new assets. All of the data passed between the back and front-end is
passed by web-socket.

All of the assets that have been checked in more than once have their distance traveled since their last
check-in time calculated and recorded.
