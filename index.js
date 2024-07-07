const { default: axios } = require( 'axios' );
const express = require( 'express' );
const http = require( 'http' );
const app = express();
const server = http.createServer( app );
const cheerio = require( "cheerio" );
const bodyParser = require( 'body-parser' );
const cors = require( 'cors' );
const weather = require( "weather-js" );

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( cors() );

//https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&appid=c1009510ccc2d5bab11392a730408202


function fetchWeatherData ( lat, lon ) {
  return new Promise( ( resolve, reject ) => {
    weather.find( { search: `${ lat },${ lon }`, degreeType: "C" }, function ( err, result ) {
      if ( err ) {
        return reject( err );
      }
      resolve( result );
    } );
  } );
}


app.get( "/", ( req, res ) => {
  res.send( "Hello, world!" );
} );

app.post( "/weather", async ( req, res ) => {

  const { lat, lon } = req?.body;

  try {

    const data = await fetchWeatherData( req.body.lat, req.body.lon );

    if ( data ) res.json( data );
    else res.status( 404 ).send( "location not found" );

  } catch ( err ) {
    console.log( err );
    res.status( 500 ).send( "server error: " + err.message );
  }
} );


server.listen( 3030, () => console.log( 'Server running on port 3030' ) );