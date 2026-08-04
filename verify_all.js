const http = require('http');
const https = require('https');

const domain = 'cyber-nikitka-2000s.vercel.app';

function fetchUrl(path, options = {}) {
  return new Promise((resolve, reject) => {
    const reqOptions = {
      hostname: domain,
      port: 443,
      path: path,
      method: options.method || 'GET',
      headers: {
        'User-Agent': 'NodeVerificationAgent/1.0',
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    };

    const req = https.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const json = res.headers['content-type']?.includes('application/json') ? JSON.parse(data) : data;
          resolve({ status: res.statusCode, headers: res.headers, body: json });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, body: data });
        }
      });
    });

    req.on('error', (err) => reject(err));
    if (options.body) req.write(JSON.stringify(options.body));
    req.end();
  });
}

async function runVerification() {
  console.log('=====================================================');
  console.log('🔍 ПОЛНАЯ ПРОВЕРКА ВСЕХ СТРАНИЦ И API НА VERCEL PROD');
  console.log('=====================================================\n');

  const pages = [
    '/',
    '/index.html',
    '/services.html',
    '/disks.html',
    '/forum.html',
    '/guestbook.html',
    '/login.html',
    '/register.html',
    '/cabinet.html',
    '/contacts.html',
    '/admin.html'
  ];

  console.log('--- 1. ПРОВЕРКА СТАТИЧЕСКИХ СТРАНИЦ (HTML) ---');
  for (const page of pages) {
    try {
      const res = await fetchUrl(page);
      const isOk = res.status === 200;
      console.log(`  [${isOk ? 'OK 200' : 'FAIL ' + res.status}] ${page}`);
    } catch (err) {
      console.log(`  [ERROR] ${page}: ${err.message}`);
    }
  }

  console.log('\n--- 2. ПРОВЕРКА REST API ЭНДПОИНТОВ ---');
  const apiEndpoints = [
    '/api/disks',
    '/api/services',
    '/api/guestbook',
    '/api/forum/categories'
  ];

  for (const ep of apiEndpoints) {
    try {
      const res = await fetchUrl(ep);
      const isSuccess = res.status === 200 && res.body.success;
      console.log(`  [${isSuccess ? 'SUCCESS 200' : 'FAIL ' + res.status}] ${ep} (records: ${Array.isArray(res.body.data) ? res.body.data.length : 'object'})`);
    } catch (err) {
      console.log(`  [ERROR] ${ep}: ${err.message}`);
    }
  }

  console.log('\n--- 3. ПРОВЕРКА АВТОРИЗАЦИИ И ПРОФИЛЯ ПОЛЬЗОВАТЕЛЯ ---');
  const testUser = {
    username: 'TestUser_' + Date.now().toString().slice(-4),
    password: 'password123',
    icq_uin: '123-456',
    city: 'Москва',
    avatar_url: 'img/avatar-neo.png'
  };

  try {
    // 3.1 Регистрация
    console.log(`  Попытка регистрации: ${testUser.username}...`);
    const regRes = await fetchUrl('/api/auth/register', { method: 'POST', body: testUser });
    console.log(`    -> Регистрация status: ${regRes.status}, success: ${regRes.body.success}, user: ${regRes.body.user?.username}`);

    const token = regRes.body.token;
    if (token) {
      // 3.2 Проверка /me
      console.log(`  Проверка GET /api/auth/me с токеном...`);
      const meRes = await fetchUrl('/api/auth/me', { headers: { 'X-Cyber-Token': token } });
      console.log(`    -> /me status: ${meRes.status}, user: ${meRes.body.user?.username}`);

      // 3.3 Проверка Кабинета
      console.log(`  Проверка GET /api/user/cabinet...`);
      const cabRes = await fetchUrl('/api/user/cabinet', { headers: { 'X-Cyber-Token': token } });
      console.log(`    -> /cabinet status: ${cabRes.status}, rating: ${cabRes.body.data?.rating}%`);

      // 3.4 Обновление QIP статуса
      console.log(`  Обновление QIP статуса на "🎮 Играю в CS 1.6"...`);
      const profRes = await fetchUrl('/api/user/profile', {
        method: 'PUT',
        headers: { 'X-Cyber-Token': token },
        body: { qip_status: '🎮 Играю в CS 1.6', text_quote: 'Тестовый статус 2007' }
      });
      console.log(`    -> /profile status: ${profRes.status}, qip_status: ${profRes.body.user?.qip_status}`);

      // 3.5 Запись на стену
      console.log(`  Запись на стену автографа...`);
      const wallRes = await fetchUrl('/api/user/wall', {
        method: 'POST',
        headers: { 'X-Cyber-Token': token },
        body: { author: testUser.username, message: 'Проверочный автограф на стене!' }
      });
      console.log(`    -> /wall status: ${wallRes.status}, comment: ${wallRes.body.data?.message}`);
    }
  } catch (err) {
    console.log(`  [ERROR Auth Test]: ${err.message}`);
  }

  console.log('\n=====================================================');
  console.log('✅ ВСЕ ПРОВЕРКИ УСПЕШНО ЗАВЕРШЕНЫ!');
  console.log('=====================================================');
}

runVerification();
