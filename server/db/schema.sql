-- ==========================================================================
-- СХЕМА БАЗЫ ДАННЫХ SQLITE (v2.0 Full-Stack Architecture)
-- Проект: «КиберНикитка» (Компьютерная помощь & Обмен CD/DVD)
-- Таблиц в схеме: 12
-- ==========================================================================

PRAGMA foreign_keys = ON;

-- 1. Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    icq_uin TEXT,
    avatar TEXT DEFAULT '/img/photo-nikitka.png',
    role TEXT CHECK(role IN ('user', 'admin')) NOT NULL DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Сессии пользователей
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Каталог CD/DVD дисков
CREATE TABLE IF NOT EXISTS disks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT CHECK(category IN ('games', 'software', 'movies', 'music')) NOT NULL,
    media_type TEXT CHECK(media_type IN ('CD-ROM', 'DVD-5', 'DVD-9', 'CD-RW')) NOT NULL,
    release_year INTEGER NOT NULL,
    condition TEXT DEFAULT 'Отличное (без царапин)',
    status TEXT CHECK(status IN ('in_stock', 'exchanged', 'reserved')) DEFAULT 'in_stock',
    owner_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    cover_url TEXT DEFAULT '/img/cover-game.png',
    description TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Прайс-лист услуг мастерской
CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT CHECK(category IN ('repair', 'assembly', 'software', 'network', 'recovery')) NOT NULL,
    price INTEGER NOT NULL,
    description TEXT NOT NULL
);

-- 5. Заявки на ремонт и вызов мастера
CREATE TABLE IF NOT EXISTS repair_requests (
    id TEXT PRIMARY KEY,
    client_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    issue_desc TEXT NOT NULL,
    status TEXT CHECK(status IN ('new', 'in_progress', 'completed', 'cancelled')) DEFAULT 'new',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 6. Заявки на обмен дисков
CREATE TABLE IF NOT EXISTS disk_exchanges (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    offered_disk_title TEXT NOT NULL,
    requested_disk_id TEXT NOT NULL REFERENCES disks(id) ON DELETE CASCADE,
    contact TEXT NOT NULL,
    status TEXT CHECK(status IN ('pending', 'approved', 'rejected', 'completed')) DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 7. Гостевая книга
CREATE TABLE IF NOT EXISTS guestbook (
    id TEXT PRIMARY KEY,
    nickname TEXT NOT NULL,
    city TEXT DEFAULT 'Москва',
    message TEXT NOT NULL,
    admin_reply TEXT,
    status TEXT CHECK(status IN ('approved', 'pending', 'spam')) DEFAULT 'approved',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 8. Категории ретро-форума
CREATE TABLE IF NOT EXISTS forum_categories (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    order_index INTEGER DEFAULT 0
);

-- 9. Темы форума
CREATE TABLE IF NOT EXISTS forum_topics (
    id TEXT PRIMARY KEY,
    category_id TEXT NOT NULL REFERENCES forum_categories(id) ON DELETE CASCADE,
    author_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    is_pinned INTEGER CHECK(is_pinned IN (0, 1)) DEFAULT 0,
    is_closed INTEGER CHECK(is_closed IN (0, 1)) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 10. Сообщения форума
CREATE TABLE IF NOT EXISTS forum_posts (
    id TEXT PRIMARY KEY,
    topic_id TEXT NOT NULL REFERENCES forum_topics(id) ON DELETE CASCADE,
    author_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 11. База комплектующих ПК (Сборщик ПК)
CREATE TABLE IF NOT EXISTS pc_components (
    id TEXT PRIMARY KEY,
    category TEXT CHECK(category IN ('cpu', 'gpu', 'ram', 'motherboard', 'psu', 'storage')) NOT NULL,
    name TEXT NOT NULL,
    socket TEXT,
    power_watt INTEGER DEFAULT 0,
    price INTEGER NOT NULL
);

-- 12. Новости мастерской
CREATE TABLE IF NOT EXISTS news (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT DEFAULT '/img/photo-workshop.png',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ИНДЕКСЫ ДЛЯ УСКОРЕНИЯ ВЫБОРКИ
CREATE INDEX IF NOT EXISTS idx_disks_cat ON disks(category);
CREATE INDEX IF NOT EXISTS idx_disks_status ON disks(status);
CREATE INDEX IF NOT EXISTS idx_forum_topics_cat ON forum_topics(category_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_topic ON forum_posts(topic_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
