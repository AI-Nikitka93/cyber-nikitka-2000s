const https = require('https');

const CITIES = {
  moscow: { name: '📍 Москва', lat: 55.7558, lon: 37.6173 },
  spb: { name: '📍 Санкт-Петербург', lat: 59.9343, lon: 30.3351 },
  minsk: { name: '📍 Минск', lat: 53.9006, lon: 27.5590 },
  omsk: { name: '📍 Омск', lat: 54.9885, lon: 73.3242 },
  novosibirsk: { name: '📍 Новосибирск', lat: 55.0084, lon: 82.9357 },
  ekaterinburg: { name: '📍 Екатеринбург', lat: 56.8389, lon: 60.6057 },
  samara: { name: '📍 Самара', lat: 53.2001, lon: 50.1500 },
  chelyabinsk: { name: '📍 Челябинск', lat: 55.1644, lon: 61.4368 },
  ufay: { name: '📍 Уфа', lat: 54.7388, lon: 55.9721 },
  rostov: { name: '📍 Ростов-на-Дону', lat: 47.2357, lon: 39.7015 },
  krasnoyarsk: { name: '📍 Красноярск', lat: 56.0184, lon: 92.8672 },
  voronezh: { name: '📍 Воронеж', lat: 51.6720, lon: 39.1843 },
  perm: { name: '📍 Пермь', lat: 58.0105, lon: 56.2502 },
  volgograd: { name: '📍 Волгоград', lat: 48.7071, lon: 44.5169 }
};

async function testFetch(cityKey) {
  const city = CITIES[cityKey];
  const urlForecast = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true`;
  const urlArchive = `https://archive-api.open-meteo.com/v1/archive?latitude=${city.lat}&longitude=${city.lon}&start_date=2007-08-04&end_date=2007-08-04&daily=temperature_2m_max`;

  return new Promise((resolve) => {
    https.get(urlForecast, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const dNow = JSON.parse(body);
        https.get(urlArchive, (res2) => {
          let body2 = '';
          res2.on('data', chunk => body2 += chunk);
          res2.on('end', () => {
            const dThen = JSON.parse(body2);
            console.log(`[${city.name}] NOW: ${dNow.current_weather?.temperature}°C | 2007: ${dThen.daily?.temperature_2m_max?.[0]}°C`);
            resolve();
          });
        });
      });
    });
  });
}

async function runAll() {
  for (let key in CITIES) {
    await testFetch(key);
  }
}

runAll();
