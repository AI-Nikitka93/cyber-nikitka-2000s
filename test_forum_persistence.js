const https = require('https');

function postJson(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = https.request({
      hostname: 'cyber-nikitka-2000s.vercel.app',
      port: 443,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, res => {
      let resData = '';
      res.on('data', chunk => resData += chunk);
      res.on('end', () => resolve(JSON.parse(resData)));
    });
    req.on('error', err => reject(err));
    req.write(data);
    req.end();
  });
}

function getJson(path) {
  return new Promise((resolve, reject) => {
    https.get('https://cyber-nikitka-2000s.vercel.app' + path, res => {
      let resData = '';
      res.on('data', chunk => resData += chunk);
      res.on('end', () => resolve(JSON.parse(resData)));
    }).on('error', err => reject(err));
  });
}

async function main() {
  console.log('--- ТЕСТИРОВАНИЕ СОЗДАНИЯ ТЕМЫ И СОХРАНЕНИЯ ---');
  const newTopic = {
    category_id: 'cat-01',
    title: 'Тестовая тема от пользователя ' + Date.now().toString().slice(-4),
    author: 'Пользователь_Тест',
    content: 'Текст проверочной темы на форуме'
  };

  const createRes = await postJson('/api/forum/topics', newTopic);
  console.log('Результат создания темы:', createRes);

  const forumRes = await getJson('/api/forum/categories');
  console.log('Список тем после запроса:', forumRes.data.topics.length, 'тем на форуме.');
  console.log('Самая свежая тема:', forumRes.data.topics[0]);
}

main();
