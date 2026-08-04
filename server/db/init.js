/* ==========================================================================
   ИНИЦИАЛИЗАЦИЯ И НАПОЛНЕНИЕ БАЗЫ ДАННЫХ SQLITE (v2.0 Full-Stack Engine)
   Поддержка: built-in node:sqlite (Node v22+), better-sqlite3 и sqlite3
   ========================================================================== */

const fs = require('fs');
const path = require('path');

const DB_DIR = __dirname;
const DB_FILE = path.join(DB_DIR, 'kibernik.db');
const SCHEMA_FILE = path.join(DB_DIR, 'schema.sql');
const SEED_FILE = path.join(DB_DIR, 'seed.sql');

function getDatabaseAdapter() {
  // 1. Попытка нативного node:sqlite (встроен в Node.js v22+)
  try {
    const { DatabaseSync } = require('node:sqlite');
    console.log('[CyberNikitka DB] Используется нативный встроенный модуль node:sqlite (Node v24)');
    return {
      type: 'node:sqlite',
      create: (file) => {
        const db = new DatabaseSync(file);
        return {
          exec: (sql) => db.exec(sql),
          prepare: (sql) => {
            const stmt = db.prepare(sql);
            return {
              get: (...params) => stmt.get(...params)
            };
          },
          close: () => db.close()
        };
      }
    };
  } catch (e) {}

  // 2. Попытка better-sqlite3
  try {
    const BetterSqlite3 = require('better-sqlite3');
    console.log('[CyberNikitka DB] Используется модуль better-sqlite3');
    return {
      type: 'better-sqlite3',
      create: (file) => new BetterSqlite3(file)
    };
  } catch (e) {}

  throw new Error('Не найден подходящий драйвер SQLite. Обновите Node.js до v22+ или установите better-sqlite3.');
}

async function initDatabase() {
  console.log('[CyberNikitka DB] Старт инициализации базы данных SQLite...');
  const adapter = getDatabaseAdapter();

  const db = adapter.create(DB_FILE);

  try {
    // 1. Чтение и выполнение schema.sql
    console.log('[CyberNikitka DB] Загрузка схемы DDL из schema.sql...');
    const schemaSql = fs.readFileSync(SCHEMA_FILE, 'utf-8');
    db.exec(schemaSql);
    console.log('[CyberNikitka DB] Схема DDL (12 таблиц и индексы) успешно создана!');

    // 2. Чтение и выполнение seed.sql
    console.log('[CyberNikitka DB] Наполнение базы первично данными из seed.sql...');
    const seedSql = fs.readFileSync(SEED_FILE, 'utf-8');
    db.exec(seedSql);
    console.log('[CyberNikitka DB] Первичные данные (30 дисков, 15 услуг, 6 отзывов, форум, ПК) загружены!');

    // 3. Сверка количества записей
    const disksCount = db.prepare('SELECT COUNT(*) as count FROM disks').get().count;
    const servicesCount = db.prepare('SELECT COUNT(*) as count FROM services').get().count;
    const guestbookCount = db.prepare('SELECT COUNT(*) as count FROM guestbook').get().count;
    const usersCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    const forumCatCount = db.prepare('SELECT COUNT(*) as count FROM forum_categories').get().count;

    console.log('\n================ ИТОГИ ИНИЦИАЛИЗАЦИИ БАЗЫ ДАННЫХ ================');
    console.log(`Файл БД: ${DB_FILE}`);
    console.log(`- Пользователей: ${usersCount}`);
    console.log(`- CD/DVD Дисков: ${disksCount}`);
    console.log(`- Услуг и Прайсов: ${servicesCount}`);
    console.log(`- Отзывов в Гостевой: ${guestbookCount}`);
    console.log(`- Категорий Форума: ${forumCatCount}`);
    console.log('=================================================================\n');

  } catch (err) {
    console.error('[CyberNikitka DB Error] Ошибка при инициализации базы данных:', err);
  } finally {
    if (db && typeof db.close === 'function') {
      db.close();
    }
  }
}

if (require.main === module) {
  initDatabase();
}

module.exports = { initDatabase, DB_FILE };
