const geo = require('geolocation-utils');
const fetch = require('node-fetch');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});
const { GEOKEY } = process.env;
const data = require('./data');

const q = () => readline.question('Address?\n', async (address) => {
  if (!['sf', 'san francisco'].some((e) => address.toLowerCase().trimEnd().endsWith(e))) {
    address = `${address}, San Francisco`;
  }
  try {
    const r = await fetch(`https://us1.locationiq.com/v1/search.php?key=${GEOKEY}&q=${encodeURI(address)}&format=json`)
    if (r.status === 200) {
      const body = await r.json();
      if (body.length === 0) {
        throw new Error('could not find location');
      }
      let {lat, lon} = body[0]
      lat = parseFloat(lat);
      lon = parseFloat(lon);
      const neighb = data.find((d) => geo.insidePolygon([lat, lon], d['the_geom']))
      console.log('Neighbourhood: ', neighb.name);
      console.log('=================')
    }

  } catch (ex) {
    console.log('I don\'t know.  Try again?');
  } finally {
    return q();
  }
});

q();
