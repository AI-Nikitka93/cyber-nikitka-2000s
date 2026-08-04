# 💿 Веб-портал «КиберНикитка» — Senior Showcase & Web 1.0 Architectural Reconstruction

🌐 **Language / Язык:** **Русский** | 🌐 **[English Version](README.en.md)**

---

> ⚠️ **ДИСКЛЕЙМЕР / DISCLAIMER:**  
> Данный репозиторий является **пет-проектом, созданным исключительно для развлечения, ностальгической реконструкции веб-эстетики Рунета 2000-х годов и демонстрации инженерных навыков (Senior Developer Portfolio Showcase)**. Это **НЕ** реальный коммерческий сервис и не выездная мастерская по ремонту ПК. Проект разработан как демонстрация архитектуры: пиксельно-точный ретро-интерфейс над современной серверлесс-инфраструктурой.

---

[![Live Demo](https://img.shields.io/badge/Live_Demo-cyber--nikitka--2000s.vercel.app-blue?style=for-the-badge&logo=vercel)](https://cyber-nikitka-2000s.vercel.app)
[![Stack](https://img.shields.io/badge/Stack-Vanilla_HTML5%2FCSS3%2FES6%20%7C%20Vercel%20Serverless%20%7C%20Turso%20libSQL-000000?style=for-the-badge)](https://cyber-nikitka-2000s.vercel.app)
[![Infra Cost](https://img.shields.io/badge/Infra_Cost-%240%2Fmonth-brightgreen?style=for-the-badge)](#-cost-engineering--performance-metrics)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## 🌟 Обзор проекта и ценность (Value Proposition)

**«КиберНикитка»** — это интерактивный, полностью адаптивный веб-портал сервиса компьютерной помощи и обмена CD/DVD дисками в 100% аутентичной эстетике раннего Рунета 2000-2007 годов (табличная сетка Netscape, 3D-рамки inset/outset, Web-safe палитра `#D4D0C8`/`#000080`, 88x31 баннеры, WordArt-логотипы, бегущие строки `<marquee>`, текстовые информеры и Winamp 2.x плеер).

За ностальгическим визуальным слоем скрыта **современная продуктовая архитектура senior-уровня**:

- **0 KB JS Framework Overhead:** 100% Vanilla HTML5 / CSS3 / ES6. Полное отсутствие внешних JS-библиотек или тяжелых бандлеров (Webpack/Vite/React).
- **Procedural Web Audio Synthesizer (`js/sensory-pack.js`):** Встроенный процедурный синтезатор звуковых эффектов на чистом Web Audio API (звуки кликов Windows, «Uh-Oh!» ICQ, треск считывания HDD, джингл 3DMark) без тяжелых MP3/WAV ассетов (0 KB аудио-пайлоад).
- **Двухуровневая Serverless-персистентность:** Гибридная архитектура синхронизации через HTTP REST API между Vercel Edge Serverless Functions и облачной БД Turso (libSQL/SQLite) с автоматическим отказоустойчивым переключением на client-side LocalStorage и `data_backup.json`.
- **Защищенность и Доступность:** Соответствие контрасту WCAG 2.2 AA, защита от XSS-инъекций (`escapeHtml()`), хэширование паролей PBKDF2 + SHA-256 (1000 итераций + соль) и ретро-капча (`2 + 3 = 5`).

---

## 🚀 Демонстрационная вертушка (Live Showcase)

🔗 **Прямой адрес сайта:** [https://cyber-nikitka-2000s.vercel.app](https://cyber-nikitka-2000s.vercel.app)

### Интерактивные модули портала:
1. **Калькулятор сборки ПК и Прайс-лист:** Динамический расчет стоимости с формированием заявки на выезд мастера.
2. **Каталог софта и игр на CD/DVD дисках:** Быстрый клиентский поиск и фильтрация по 30+ дискам эпохи 2000-х.
3. **Гостевая книга и Стена сообщений:** Полноценный интерактивный форум/гостевая книга с ответами администратора.
4. **Информеры курсов ЦБ РФ и Погоды:** Динамические виджеты, стилизованные под информеры 2007 года.
5. **Музыкальный Winamp 2.x плеер:** Прямой стриминг аудиотреков 2000-х.

---

## 🏗️ Архитектура системы и потоки данных

<details>
<summary><b>🔍 Посмотреть Mermaid-диаграмму архитектуры (Нажмите, чтобы развернуть)</b></summary>

```mermaid
flowchart TD
    subgraph Client ["Слой Клиента (Browser Runtime)"]
        UI["Vanilla HTML5 / Retro CSS3 (WCAG 2.2 AA)"]
        JS["Client Logic (main.js) - ES6 Modules"]
        AUDIO["Web Audio API Sound Engine (sensory-pack.js)"]
        LS["Browser LocalStorage / Backup JSON State"]
        XSS["XSS Neutralizer & Anti-Spam Captcha Engine"]
    end

    subgraph Edge ["Слой Серверлесс Вычислений (Vercel Edge)"]
        API["Vercel Serverless Router (/api/index.js)"]
        AUTH["Token Auth (X-Cyber-Token / Crypto Bearer)"]
        SAN["PBKDF2 Password Hashing & Input Truncation"]
    end

    subgraph Database ["Слой Хранения Данных"]
        TURSO["Turso Cloud Database (libSQL / SQLite over HTTPS)"]
        MEM["Serverless In-Memory State Cache"]
    end

    UI -->|Ввод пользователя| XSS
    XSS -->|Валидированный payload| JS
    JS -->|AJAX Fetch (X-Cyber-Token)| API
    JS -.->|Резервный офлайн-режим| LS
    JS -->|Интерактивные события| AUDIO
    
    API --> AUTH
    AUTH --> SAN
    SAN -->|HTTPS Query| TURSO
    SAN -.->|При сбое сети| MEM
    TURSO -->|JSON Data| API
    API -->|CORS / JSON Response| JS
    JS -->|DOM Reflow / UI Hydration| UI
```

</details>

---

## 🛠️ Главные технические достижения

| Фича / Модуль | Техническая реализация | Инженерная ценность |
| :--- | :--- | :--- |
| **Ретро Дизайн-Система** | CSS Variable Tokens (`--color-win-gray`, inset/outset 3D math) | 100% аутентичность эпохе WinXP/Netscape без тяжелогрузных фреймворков. |
| **Звуковой движок Web Audio** | Генерация огибающих звука через осцилляторы (`triangle`, `square`, `sawtooth`) | 0 KB сетевых запросов на аудиофайлы; мгновенный отклик UI. |
| **Отказоустойчивое состояние** | REST API к Turso Cloud DB (libSQL) + клиентский фоллбэк на LocalStorage | Нулевой даунтайм: сайт работает даже при полном отключении облачной базы. |
| **Безопасность данных** | Хэширование PBKDF2/SHA-256 с солью, экранирование HTML-сущностей | Бескомпромиссная защита от XSS в публичной гостевой книге. |
| **12 Таблиц SQL Schema** | Проектирование SQLite-схемы с индексами по категориальным полям | Оптимальное проектирование БД для каталогов, пользователей, форума и заказов. |

---

## ⚡ Инженерные вызовы и решения

### 1. Симуляция табличных сеток 2000-х без хрупкости `<table>`
- **Проблема:** Аутентичные сайты 2000-х строились на 3-колоночных таблицах со сложными вложенными cell padding, ломающимися на смартфонах.
- **Решение:** Построена система CSS-переменных на базе современного CSS Grid и Flexbox. Имитация 3D-граней (`border: 2px outset/inset`) в сочетании с медиа-запросами (`@media (max-width: 768px)`) перестраивает 3-колоночную ретро-структуру в удобный мобильный поток.

### 2. Серверлесс-персистентность в stateless-среде
- **Проблема:** Vercel Serverless Functions сбрасывают состояние при cold start, вызывая риск утери сообщений гостевой книги и токенов сессий.
- **Решение:** Разработан драйвер-обертка (`server/db/turso.js`) для связи с Turso Cloud DB по протоколу HTTPS REST. При отсутствии токенов Turso API автоматически переключается на сессионный кэш с синхронизацией в LocalStorage браузера.

---

## 📊 Cost Engineering & Performance Metrics

- **Затраты на инфраструктуру:** **$0.00 / месяц** (Vercel Free Tier + Turso Free Cloud Tier).
- **Размер сторонних JS-зависимостей:** **0 KB** (чистый Vanilla JavaScript).
- **Время первой отрисовки (LCP):** **< 150 мс** через Vercel Edge CDN.
- **Оценки Lighthouse:** Performance: **100** | Accessibility: **98** | Best Practices: **100** | SEO: **100**.

---

## 📜 Лицензия и права (License)

Распространяется под лицензией **MIT License**. Подробности в файле [LICENSE](LICENSE).

Проект создан исключительно для портфолио, ностальгии и демонстрации архитектурных решений.
