/* ==========================================================================
   ОБЛАЧНАЯ МИГРАЦИЯ И СИНХРОНИЗАЦИЯ С TURSO (LibSQL Cloud Engine)
   База данных: libsql://kiber-zolkaiart.aws-eu-west-1.turso.io
   ========================================================================== */

const fs = require('fs');
const path = require('path');

const DB_DIR = __dirname;
const SCHEMA_FILE = path.join(DB_DIR, 'schema.sql');
const SEED_FILE = path.join(DB_DIR, 'seed.sql');

function loadEnv() {
  const envPath = path.join(__dirname, '../../.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
      if (match) {
        process.env[match[1]] = match[2].trim();
      }
    });
  }
}

loadEnv();

const TURSO_URL = process.env.TURSO_DATABASE_URL || 'libsql://kiber-zolkaiart.aws-eu-west-1.turso.io';
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_TOKEN) {
  console.error('[Turso Sync Error] TURSO_AUTH_TOKEN не найден в .env!');
  process.exit(1);
}

const httpUrl = TURSO_URL.replace(/^libsql:\/\//, 'https://') + '/v2/pipeline';

async function executeTursoPipeline(statements) {
  const requests = statements.map(sql => ({
    type: 'execute',
    stmt: { sql }
  }));
  requests.push({ type: 'close' });

  const response = await fetch(httpUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TURSO_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ requests })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Turso HTTP ${response.status}: ${errText}`);
  }

  return await response.json();
}

async function queryTurso(sql) {
  const res = await executeTursoPipeline([sql]);
  if (res.results && res.results[0] && res.results[0].response && res.results[0].response.result) {
    return res.results[0].response.result;
  }
  return null;
}

function parseSqlStatements(sqlText) {
  // 1. Очистка строк комментариев --
  const cleanedText = sqlText
    .split('\n')
    .filter(line => !line.trim().startsWith('--'))
    .join('\n');

  // 2. Разбиваем по точке с запятой ;
  return cleanedText
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0);
}

async function syncTurso() {
  console.log(`[Turso Sync] Подключение к облачной БД: ${TURSO_URL}...`);

  try {
    // 1. Применение schema.sql
    console.log('[Turso Sync] Чтение и миграция DDL схемы (schema.sql)...');
    const schemaSql = fs.readFileSync(SCHEMA_FILE, 'utf-8');
    const schemaStatements = parseSqlStatements(schemaSql);
    
    console.log(`[Turso Sync] Выполнение ${schemaStatements.length} DDL-команд...`);
    await executeTursoPipeline(schemaStatements);
    console.log('[Turso Sync] Схема DDL (12 таблиц и индексы) успешно создана в облаке Turso!');

    // 2. Применение seed.sql
    console.log('[Turso Sync] Наполнение облачной БД первично данными (seed.sql)...');
    const seedSql = fs.readFileSync(SEED_FILE, 'utf-8');
    const seedStatements = parseSqlStatements(seedSql);

    console.log(`[Turso Sync] Отправка ${seedStatements.length} SQL-запросов данных (30 дисков, 15 услуг, 6 отзывов, форум)...`);
    
    const BATCH_SIZE = 15;
    for (let i = 0; i < seedStatements.length; i += BATCH_SIZE) {
      const batch = seedStatements.slice(i, i + BATCH_SIZE);
      await executeTursoPipeline(batch);
      console.log(`[Turso Sync] Выполнен пакет ${Math.min(i + BATCH_SIZE, seedStatements.length)} из ${seedStatements.length}...`);
    }
    console.log('[Turso Sync] Все данные успешно записаны в Turso!');

    // 3. Верификация количества записей в облачной БД
    console.log('\n================ ПРОВЕРКА ДАННЫХ В ОБЛАЧНОЙ БД TURSO ================');
    
    const disksRes = await queryTurso('SELECT COUNT(*) as count FROM disks');
    const disksCount = disksRes?.rows?.[0]?.[0]?.value || 0;

    const servicesRes = await queryTurso('SELECT COUNT(*) as count FROM services');
    const servicesCount = servicesRes?.rows?.[0]?.[0]?.value || 0;

    const guestbookRes = await queryTurso('SELECT COUNT(*) as count FROM guestbook');
    const guestbookCount = guestbookRes?.rows?.[0]?.[0]?.value || 0;

    const usersRes = await queryTurso('SELECT COUNT(*) as count FROM users');
    const usersCount = usersRes?.rows?.[0]?.[0]?.value || 0;

    const forumCatRes = await queryTurso('SELECT COUNT(*) as count FROM forum_categories');
    const forumCatCount = forumCatRes?.rows?.[0]?.[0]?.value || 0;

    console.log(`Облачный адрес: ${TURSO_URL}`);
    console.log(`- Пользователей: ${usersCount}`);
    console.log(`- CD/DVD Дисков: ${disksCount}`);
    console.log(`- Услуг и Прайсов: ${servicesCount}`);
    console.log(`- Отзывов в Гостевой: ${guestbookCount}`);
    console.log(`- Категорий Форума: ${forumCatCount}`);
    console.log('=====================================================================\n');

  } catch (err) {
    console.error('[Turso Sync Error] Сбой синхронизации с Turso:', err);
  }
}

if (require.main === module) {
  syncTurso();
}

module.exports = { syncTurso, executeTursoPipeline };
