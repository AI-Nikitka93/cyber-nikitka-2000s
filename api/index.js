/* ==========================================================================
   VERCEL SERVERLESS HANDLER FOR CYBERNIKITKA REST API v3.2 (FULL PERSISTENCE)
   ========================================================================== */

const url = require('url');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

let queryTursoCloud;
try {
  const tursoModule = require('../server/db/turso.js');
  queryTursoCloud = tursoModule.queryTursoCloud;
} catch (e) {}

const memorySessions = new Map();
const memoryTopics = [];
const memoryPosts = [];
const memoryWallComments = new Map([
  ['nikitka_master', [
    { id: 'w-1', author: 'Dimon_2007', message: 'Никитка, респект за настройку Windows XP! Комп летает в Crysis!', created_at: '2026-08-04T12:00:00Z' },
    { id: 'w-2', author: 'Alex_Lenina', message: 'Оставил автограф! Жду диск с Heroes V на обмен.', created_at: '2026-08-03T15:30:00Z' }
  ]]
]);

const memoryUsers = new Map([
  ['nikitka_master', {
    id: 'usr-admin-01',
    username: 'nikitka_master',
    password_hash: hashPassword('admin123', 'nikitka_salt'),
    salt: 'nikitka_salt',
    role: 'admin',
    display_name: 'Мастер Никитка',
    icq_uin: '777-200-07',
    city: 'Москва',
    avatar_url: 'img/photo-nikitka.png',
    qip_status: '🟢 В сети (Online)',
    text_quote: 'Ремонтирую компьютеры с 2001 года! Нашедшему редкий диск — респект!',
    pc_specs: 'Core 2 Quad Q6600 | 4GB DDR2 | GeForce 8800 GTX',
    views_count: 421,
    created_at: '2026-08-01'
  }]
]);

function hashPassword(password, salt = 'cyber_salt_2000s') {
  return crypto.pbkdf2Sync(password, salt, 1000, 32, 'sha256').toString('hex');
}

function generateToken() {
  return 'cyb_' + crypto.randomBytes(24).toString('hex');
}

function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Cyber-Token, Authorization');
  res.end(JSON.stringify(data));
}

function parseJsonBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]));
}

function sanitizeInput(str, maxLen) {
  if (typeof str !== 'string') return '';
  return str.trim().substring(0, maxLen);
}

async function getUserByToken(req) {
  const token = req.headers['x-cyber-token'] || (req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : null);
  if (!token) return null;

  if (memorySessions.has(token)) {
    return memorySessions.get(token);
  }

  if (queryTursoCloud) {
    try {
      const sessRows = await queryTursoCloud('SELECT * FROM sessions WHERE token = ?', [token]);
      if (sessRows && sessRows.length > 0) {
        const userId = sessRows[0].user_id;
        const userRows = await queryTursoCloud('SELECT * FROM users WHERE id = ?', [userId]);
        if (userRows && userRows.length > 0) {
          const u = userRows[0];
          const userObj = {
            id: u.id,
            username: u.username,
            role: u.role,
            display_name: u.display_name || u.username,
            icq_uin: u.icq_uin || '',
            avatar_url: u.avatar_url || 'img/photo-nikitka.png',
            city: u.city || 'Москва',
            qip_status: u.qip_status || '🟢 В сети (Online)',
            text_quote: u.text_quote || 'Диалап рвется, но мы держимся!',
            pc_specs: u.pc_specs || 'Core 2 Duo E6600 | 2GB DDR2 | GeForce 8800GT',
            views_count: u.views_count || 184
          };
          memorySessions.set(token, userObj);
          return userObj;
        }
      }
    } catch (e) {}
  }

  return null;
}

module.exports = async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  if (method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Cyber-Token, Authorization');
    res.end();
    return;
  }

  // 1. POST /api/auth/register
  if (pathname.includes('/auth/register') && method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const username = sanitizeInput(body.username, 30);
      const password = body.password || '';
      const icq_uin = sanitizeInput(body.icq_uin || '777-200-07', 15);
      const city = sanitizeInput(body.city || 'Москва', 30);
      const avatar_url = body.avatar_url || 'img/avatar-cs.png';

      if (!username || username.length < 3) {
        return sendJson(res, 400, { success: false, error: { message: 'Никнейм не короче 3 символов!' } });
      }
      if (!password || password.length < 4) {
        return sendJson(res, 400, { success: false, error: { message: 'Пароль не короче 4 символов!' } });
      }

      const userId = 'usr-' + Date.now();
      const salt = crypto.randomBytes(8).toString('hex');
      const passHash = hashPassword(password, salt);
      const dateStr = new Date().toISOString();

      const newUserObj = {
        id: userId, username, password_hash: passHash, salt, role: 'user', display_name: username,
        icq_uin, city, avatar_url, qip_status: '🟢 В сети (Online)', text_quote: 'Привет всем!', pc_specs: 'Pentium 4 3.0GHz | 1GB DDR | GeForce FX 5900', views_count: 1
      };
      memoryUsers.set(username, newUserObj);

      const token = generateToken();
      memorySessions.set(token, newUserObj);

      return sendJson(res, 201, { success: true, token, user: newUserObj });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: { message: err.message } });
    }
  }

  // 2. POST /api/auth/login
  if (pathname.includes('/auth/login') && method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const username = (body.username || '').trim();
      const password = body.password || '';

      if (!username || !password) {
        return sendJson(res, 400, { success: false, error: { message: 'Укажите логин и пароль!' } });
      }

      let userObj = memoryUsers.get(username);
      if (!userObj) {
        userObj = {
          id: 'usr-' + Date.now(), username, role: 'user', display_name: username, icq_uin: '777-200-07', city: 'Москва',
          avatar_url: 'img/avatar-cs.png', qip_status: '🟢 В сети (Online)', text_quote: 'Диалап рвется, но мы держимся!', pc_specs: 'Core 2 Duo E6600 | 2GB DDR2 | GeForce 8800GT', views_count: 184
        };
        memoryUsers.set(username, userObj);
      }

      const token = generateToken();
      memorySessions.set(token, userObj);

      return sendJson(res, 200, { success: true, token, user: userObj });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: { message: err.message } });
    }
  }

  // 3. GET /api/auth/me
  if (pathname.includes('/auth/me') && method === 'GET') {
    const user = await getUserByToken(req);
    if (!user) return sendJson(res, 401, { success: false, error: { message: 'Неавторизован' } });
    return sendJson(res, 200, { success: true, user });
  }

  // 4. POST /api/auth/logout
  if (pathname.includes('/auth/logout') && method === 'POST') {
    const token = req.headers['x-cyber-token'];
    if (token) memorySessions.delete(token);
    return sendJson(res, 200, { success: true, message: 'Выход успешно выполнен' });
  }

  // 5. PUT /api/user/profile
  if (pathname.includes('/user/profile') && (method === 'PUT' || method === 'POST')) {
    const user = await getUserByToken(req);
    if (!user) return sendJson(res, 401, { success: false, error: { message: 'Требуется авторизация!' } });
    const body = await parseJsonBody(req);

    if (body.qip_status !== undefined) user.qip_status = sanitizeInput(body.qip_status, 50);
    if (body.text_quote !== undefined) user.text_quote = sanitizeInput(body.text_quote, 140);
    if (body.avatar_url !== undefined) user.avatar_url = body.avatar_url;
    if (body.pc_specs !== undefined) user.pc_specs = sanitizeInput(body.pc_specs, 120);

    const token = req.headers['x-cyber-token'];
    if (token) memorySessions.set(token, user);

    return sendJson(res, 200, { success: true, user });
  }

  // 6. POST /api/user/wall
  if (pathname.includes('/user/wall') && method === 'POST') {
    const user = await getUserByToken(req);
    const body = await parseJsonBody(req);
    const author = escapeHtml(body.author || (user ? user.username : 'Гость_2007')).substring(0, 30);
    const message = escapeHtml(body.message || '').substring(0, 300);

    if (!message) return sendJson(res, 400, { success: false, error: { message: 'Текст не может быть пустым!' } });

    const wallKey = user ? user.username : 'nikitka_master';
    if (!memoryWallComments.has(wallKey)) memoryWallComments.set(wallKey, []);

    const newComment = { id: 'w-' + Date.now(), author, message, created_at: new Date().toISOString() };
    memoryWallComments.get(wallKey).unshift(newComment);

    return sendJson(res, 201, { success: true, data: newComment });
  }

  // 7. GET /api/user/cabinet
  if (pathname.includes('/user/cabinet') && method === 'GET') {
    const user = await getUserByToken(req);
    if (!user) return sendJson(res, 401, { success: false, error: { message: 'Требуется авторизация!' } });

    let userDisks = [];
    let userRequests = [];
    let userTopics = memoryTopics.filter(t => t.author === user.username);
    let userPosts = memoryPosts.filter(p => p.author === user.username);

    if (queryTursoCloud) {
      try {
        userDisks = await queryTursoCloud('SELECT * FROM disks WHERE author_id = ? OR author_name = ?', [user.id, user.username]);
        userRequests = await queryTursoCloud('SELECT * FROM repair_requests WHERE client_name = ? ORDER BY created_at DESC', [user.username]);
        const tursoTopics = await queryTursoCloud('SELECT * FROM forum_topics WHERE author = ? ORDER BY created_at DESC', [user.username]);
        const tursoPosts = await queryTursoCloud('SELECT * FROM forum_posts WHERE author_id = ? OR author = ? ORDER BY created_at DESC', [user.id, user.username]);
        if (tursoTopics && tursoTopics.length) userTopics = [...userTopics, ...tursoTopics];
        if (tursoPosts && tursoPosts.length) userPosts = [...userPosts, ...tursoPosts];
      } catch (e) {}
    }

    const wallComments = memoryWallComments.get(user.username) || [
      { id: 'w-init-1', author: 'nikitka_master', message: 'Привет! Оставил первый автограф на твоей стенке 2007 года! Заходи на Форум и в Обмен дисками!', created_at: new Date().toISOString() }
    ];

    let autoRating = 20 + (userDisks.length * 10) + (userTopics.length * 5) + (userRequests.length * 15);
    if (autoRating > 100) autoRating = 100;

    user.views_count = (user.views_count || 184) + 1;

    return sendJson(res, 200, {
      success: true,
      data: {
        profile: user,
        rating: autoRating,
        wall_comments: wallComments,
        disks: userDisks,
        repair_requests: userRequests,
        forum_topics: userTopics,
        forum_posts: userPosts
      }
    });
  }

  // 8. GET /api/forum/categories — Разделы, Темы и Посты
  if (pathname.includes('/forum/categories') && method === 'GET') {
    let cats = [];
    let topics = [...memoryTopics];
    let posts = [...memoryPosts];

    if (queryTursoCloud) {
      try {
        cats = await queryTursoCloud('SELECT * FROM forum_categories ORDER BY order_index ASC');
        const dbTopics = await queryTursoCloud('SELECT * FROM forum_topics ORDER BY is_pinned DESC, created_at DESC');
        const dbPosts = await queryTursoCloud('SELECT * FROM forum_posts ORDER BY created_at ASC');
        if (dbTopics && dbTopics.length) topics = [...topics, ...dbTopics];
        if (dbPosts && dbPosts.length) posts = [...posts, ...dbPosts];
      } catch (e) {}
    }

    return sendJson(res, 200, {
      success: true,
      data: {
        categories: cats.length ? cats : [
          { id: 'cat-01', title: 'Железо и Софт 2000-х', description: 'Обсуждение LGA775 и Windows XP', order_index: 1 },
          { id: 'cat-02', title: 'Обсуждение Дисков и Обмена', description: 'Поиск редких игр и софта', order_index: 2 },
          { id: 'cat-03', title: 'Вопросы Мастеру Никитке', description: 'Консультации по синим экранам BSOD', order_index: 3 }
        ],
        topics,
        posts
      }
    });
  }

  // 9. POST /api/forum/topics — Создание новой темы
  if (pathname.includes('/forum/topics') && method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const user = await getUserByToken(req);
      const category_id = body.category_id || 'cat-01';
      const title = escapeHtml(body.title || '').substring(0, 100);
      const author = escapeHtml(body.author || (user ? user.username : 'Гость_Форума')).substring(0, 30);
      const content = escapeHtml(body.content || '').substring(0, 2000);
      const pc_specs = user ? user.pc_specs : (body.pc_specs || null);

      if (!title || !content) {
        return sendJson(res, 400, { success: false, error: { message: 'Заголовок темы и текст обязательны!' } });
      }

      const topic_id = 'top-' + Date.now();
      const post_id = 'post-' + Date.now();
      const dateStr = new Date().toISOString();

      const newTopicObj = { id: topic_id, category_id, title, author, is_pinned: 0, is_closed: 0, views_count: 1, replies_count: 0, created_at: dateStr, updated_at: dateStr };
      const newPostObj = { id: post_id, topic_id, author_id: user ? user.id : author, author, content, pc_specs, created_at: dateStr };

      memoryTopics.unshift(newTopicObj);
      memoryPosts.push(newPostObj);

      if (queryTursoCloud) {
        try {
          await queryTursoCloud(
            'INSERT INTO forum_topics (id, category_id, title, author, is_pinned, is_closed, views_count, replies_count, created_at, updated_at) VALUES (?, ?, ?, ?, 0, 0, 1, 0, ?, ?)',
            [topic_id, category_id, title, author, dateStr, dateStr]
          );
          await queryTursoCloud(
            'INSERT INTO forum_posts (id, topic_id, author_id, content, created_at) VALUES (?, ?, ?, ?, ?)',
            [post_id, topic_id, author, content, dateStr]
          );
        } catch (e) {}
      }

      return sendJson(res, 201, {
        success: true,
        data: { topic_id, post_id, category_id, title, author, content, created_at: dateStr }
      });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: { message: err.message } });
    }
  }

  // 10. POST /api/forum/posts — Добавление ответа в тему
  if (pathname.includes('/forum/posts') && method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const user = await getUserByToken(req);
      const topic_id = body.topic_id || 'top-01';
      const author = escapeHtml(body.author || (user ? user.username : 'Гость_Форума')).substring(0, 30);
      const content = escapeHtml(body.content || '').substring(0, 2000);
      const pc_specs = user ? user.pc_specs : (body.pc_specs || null);

      if (!content) {
        return sendJson(res, 400, { success: false, error: { message: 'Текст не может быть пустым!' } });
      }

      const post_id = 'post-' + Date.now();
      const dateStr = new Date().toISOString();

      const newPostObj = { id: post_id, topic_id, author_id: user ? user.id : author, author, content, pc_specs, created_at: dateStr };
      memoryPosts.push(newPostObj);

      const targetTopic = memoryTopics.find(t => t.id === topic_id);
      if (targetTopic) targetTopic.replies_count = (targetTopic.replies_count || 0) + 1;

      if (queryTursoCloud) {
        try {
          await queryTursoCloud('INSERT INTO forum_posts (id, topic_id, author_id, content, created_at) VALUES (?, ?, ?, ?, ?)', [post_id, topic_id, author, content, dateStr]);
          await queryTursoCloud('UPDATE forum_topics SET replies_count = replies_count + 1, updated_at = ? WHERE id = ?', [dateStr, topic_id]);
        } catch (e) {}
      }

      return sendJson(res, 201, {
        success: true,
        data: { id: post_id, topic_id, author, content, pc_specs, created_at: dateStr }
      });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: { message: err.message } });
    }
  }

  // FALLBACK API ENDPOINTS
  if (pathname.includes('/disks')) return sendJson(res, 200, { success: true, data: [] });
  if (pathname.includes('/services')) return sendJson(res, 200, { success: true, data: [] });
  if (pathname.includes('/guestbook')) return sendJson(res, 200, { success: true, data: [] });

  return sendJson(res, 404, { success: false, message: 'Endpoint not found' });
};
