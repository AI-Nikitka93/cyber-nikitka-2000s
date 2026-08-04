const https = require('https');

async function geocodeCity(name) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=ru`;
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const d = JSON.parse(body);
        if (d && d.results && d.results.length > 0) {
          const res = d.results[0];
          console.log(`FOUND [${name}] -> ${res.name}, ${res.country} (${res.latitude}, ${res.longitude})`);
        } else {
          console.log(`NOT FOUND [${name}]`);
        }
        resolve();
      });
    });
  });
}

async function testAll() {
  await geocodeCity("Магнитогорск");
  await geocodeCity("Бобруйск");
  await geocodeCity("Пенза");
  await geocodeCity("Сочи");
  await geocodeCity("Tokyo");
}

testAll();
