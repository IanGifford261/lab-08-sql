'use strict';

// Application Dependencies
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const cors = require('cors');

// Load environment variables from .env file
require('dotenv').config();

// Application Setup
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Database Setup
// Enter the three lines of code from Image 1

// API Routes
app.get('/location', (request, response) => {
  getLocation(request.query.data)
    .then(location => {
      console.log('27', location);
      response.send(location)
    })
    .catch(error => handleError(error, response));
})

// Do not comment in until you have locations in the DB
// app.get('/weather', getWeather);

// Do not comment in until weather is working
// app.get('/meetups', getMeetups);

// Make sure the server is listening for requests
app.listen(PORT, () => console.log(`Listening on ${PORT}`));

// *********************
// MODELS
// *********************

function Location(query, res) {
  this.search_query = query;
  this.formatted_query = res.formatted_address;
  this.latitude = res.geometry.location.lat;
  this.longitude = res.geometry.location.lng;
}

// function Weather(day) {
//   this.forecast = day.summary;
//   this.time = new Date(day.time * 1000).toString().slice(0, 15);
// }

// function Meetup(meetup) {
//   this.tableName = 'meetups';
//   this.link = meetup.link;
//   this.name = meetup.group.name;
//   this.creation_date = new Date(meetup.group.created).toString().slice(0, 15);
//   this.host = meetup.group.who;
//   this.created_at = Date.now();
// }

// *********************
// HELPER FUNCTIONS
// *********************

function handleError(err, res) {
  console.error(err);
  if (res) res.status(500).send('Sorry, something went wrong');
}

function getLocation(query) {
  // CREATE the query string to check for the existence of the location
  const SQL = `SELECT * FROM locations WHERE search_query=$1;`;
  const values = [query];

  // Make the query of the database
  return client.query(SQL, values)
    .then(result => {
      // Check to see if the location was found and return the results
      if (result.rowCount > 0) {
        console.log('From SQL');
        return result.rows[0];

        // Otherwise get the location information from the Google API
      } else {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${process.env.GEOCODE_API_KEY}`;

        return superagent.get(url)
          .then(data => {
            console.log('FROM API line 90');
            // Throw an error if there is a problem with the API request
            if (!data.body.results.length) { throw 'no Data' }

            // Otherwise create an instance of Location
            else {
              let location = new Location(query, data.body.results[0]);
              console.log('98', location);

              // Create a query string to INSERT a new record with the location data
              let newSQL = `INSERT INTO locations (search_query, formatted_query, latitude, longitude) VALUES ($1, $2, $3, $4) RETURNING id;`;
              console.log('102', newSQL)
              let newValues = Object.values(location);
              console.log('104', newValues)

              // Add the record to the database
              return client.query(newSQL, newValues)
                .then(result => {
                  console.log('108', result.rows);
                  // Attach the id of the newly created record to the instance of location.
                  // This will be used to connect the location to the other databases.
                  console.log('114', result.rows[0].id)
                  location.id = result.rows[0].id;
                  return location;
                })
                .catch(console.error);
            }
          })
          .catch(error => console.log('Error in SQL Call'));
      }
    });
}

// function getWeather(request, response) {
//   Enter the code from the second printout
// }


// function getMeetups(request, response) {
//       const url = `https://api.meetup.com/find/upcoming_events?&sign=true&photo-host=public&lon=${request.query.data.longitude}&page=20&lat=${request.query.data.latitude}&key=${process.env.MEETUP_API_KEY}`

//       superagent.get(url)
//         .then(result => {
//           const meetups = result.body.events.map(meetup => {
//             const event = new Meetup(meetup);
//             return event;
//           });

//           response.send(meetups);
//         })
//         .catch(error => handleError(error, response));
//     }
//   })





//---------------------------------------------------------------------
// OLD CODE
//---------------------------------------------------------------------







// 'use strict';

// //Application Dependencies
// const express = require('express');
// const cors = require('cors');
// const superagent = require('superagent');
// const pg = require('pg');

// //Load enviroment variables from .env file
// require('dotenv').config();

// // Application setup
// const app = express();
// const PORT = process.env.PORT || 3000;
// app.use(cors());

// // Database setup
// const client = new pg.Client(process.env.Databse_URL)
// client.connect();
// client.on('error', err => console.error(err));

// //route to location
// app.get('/location', (request, response) => {
//   searchToLatLong(request.query.data)
//     .then(location => response.send(location))
//     .catch(error => handleError(error, response));
// });

// //route to weather
// app.get('/weather', getWeather);

// // Route to meetup
// app.get('/meetups', getMeetUp);


// //***************** */
// // Helper Functions
// //***************** */

// //Errror handler
// function handleError(err, res){
//   if (res) res.status(500).send('Sorry, there was an error');
// }

// // Location route handler
// function searchToLatLong(query){
//   const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${process.env.GOOGLE_API}`;
//   return superagent.get(url)
//     .then(res => {
//       return new Location(query, res);
//     })
//     .catch(error => handleError(error));
// }

// // Weather route handler
// function getWeather(request, response){
//   const url = `https://api.darksky.net/forecast/${process.env.DARKSKY_API}/${request.query.data.latitude},${request.query.data.longitude}`;

//   superagent.get(url)
//     .then(result => {
//       const weatherSummaries = result.body.daily.data.map(day => {
//         return new Weather(day);
//       });
//       response.send(weatherSummaries);
//     })
//     .catch(error => handleError(error, response));
// }

// //MeetUp route handler
// function getMeetUp(request, response){
//   const url = `https://api.meetup.com/find/upcoming_events?&sign=true&photo-host=public&lon=${request.query.data.longitude}&page=20&lat=${request.query.data.latitude}&key=${process.env.MEETUP_API}`
//   return superagent.get(url)
//     .then(result => {
//       const meetUpSummaries = result.body.events.map(meetup => {
//         const event = new MeetUp(meetup)
//         console.log(event);
//         return event;
//       });
//       response.send(meetUpSummaries);
//     })
//     .catch(error => handleError(error));
// }

// //**************** */
// // Constructors
// //**************** */

// //location constructor
// function Location(query, res) {
//   this.search_query = query;
//   this.formatted_query = res.body.results[0].formatted_address;
//   this.latitude = res.body.results[0].geometry.location.lat;
//   this.longitude = res.body.results[0].geometry.location.lng;
// }

// //forecast constructor
// function Weather(day){
//   this.forecast = day.summary;
//   this.time = new Date(day.time*1000).toString().slice(0,15);
// }

// //meetup constructor
// function MeetUp(meetup) {
//   this.link = meetup.link;
//   this.name = meetup.name;
//   this.creation_date = new Date(meetup.group.created).toString().slice(0, 15);
//   this.host = meetup.group.name;
//   this.created_at = Date.now();
// }

// app.use('*', (err, res) => handleError(err, res));

// app.listen(PORT, () => console.log(`App is up on ${PORT}`));
