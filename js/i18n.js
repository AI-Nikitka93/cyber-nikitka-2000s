/* ==========================================================================
   КИБЕРНИКИТКА 2000s — I18N RETRO TRANSLATION ENGINE v1.0
   Persists language state in localStorage ('cyber_lang')
   ========================================================================== */

(function (global) {
  'use strict';

  const STORAGE_KEY = 'cyber_lang';
  const DEFAULT_LANG = 'ru';

  const i18nDictionary = {
    // 1. NAVIGATION
    nav: {
      sidebarTitle: { ru: 'НАВИГАЦИЯ', en: 'NAVIGATION' },
      home: { ru: '■ Главная страница', en: '■ Home' },
      services: { ru: '■ Услуги и Цены', en: '■ Services & Prices' },
      disks: { ru: '■ Обмен CD/DVD', en: '■ CD/DVD Exchange' },
      forum: { ru: '■ Ретро-Форум', en: '■ Retro Forum' },
      guestbook: { ru: '■ Гостевая книга', en: '■ Guestbook' },
      contacts: { ru: '■ Контакты мастерской', en: '■ Contacts' },
      admin: { ru: '■ Панель Мастера', en: '■ Admin Panel' },
      cabinet: { ru: '■ Личный Кабинет', en: '■ My Account' }
    },

    // 2. HEADER & MARQUEE
    header: {
      tagline: {
        ru: 'Официальный прайс-лист на ремонт ПК и сборку компьютеров 2000-х',
        en: 'Official 2000s PC Repair & Custom Computer Assembly Portal'
      },
      subtagline: {
        ru: 'Персональный компьютерный мастер, чистка от пыли и обмен CD/DVD дисками',
        en: 'Personal PC Repair Master, Dust Cleaning & CD/DVD Exchange'
      },
      servicesTagline: {
        ru: 'Официальный прайс-лист на ремонт ПК и сборку компьютеров 2000-х',
        en: 'Official 2000s PC Repair & Custom Computer Assembly Price List'
      },
      disksTagline: {
        ru: 'База коллекционных CD/DVD дисков для физического обмена',
        en: 'Database of Collectible CD/DVD Discs for Physical Exchange'
      },
      forumTagline: {
        ru: 'Конференция геймеров, коллекционеров дисков и сисадминов',
        en: 'Conference for Gamers, Disc Collectors & Sysadmins'
      },
      guestbookTagline: {
        ru: 'Оставляйте отзывы о ремонте и предложения по обмену дисков',
        en: 'Leave Feedback on Repairs & Disc Trade Suggestions'
      },
      contactsTagline: {
        ru: 'Адрес мастерской, контакты ICQ и схема проезда на радиорынок',
        en: 'Workshop Address, ICQ Contacts & Radio Market Location Map'
      },
      cabinetTagline: {
        ru: 'Личный Кабинет пользователя ретро-портала «КиберНикитка»',
        en: 'User Account Dashboard on CyberNikitka Retro Portal'
      },
      loginTagline: {
        ru: 'Авторизация в личный кабинет ретро-портала «КиберНикитка»',
        en: 'Account Authorization for CyberNikitka Retro Portal'
      },
      registerTagline: {
        ru: 'Регистрация нового пользователя ретро-портала «КиберНикитка»',
        en: 'New User Registration for CyberNikitka Retro Portal'
      },
      urgentCall: { ru: 'Срочный вызов: ', en: 'Urgent Call: ' },
      searchPlaceholder: { ru: 'Поиск по сайту...', en: 'Search site...' },
      searchBtn: { ru: 'Поиск', en: 'Search' },
      clockLoading: { ru: 'Загрузка времени...', en: 'Loading time...' },
      langSwitchLabel: { ru: 'LANG:', en: 'LANG:' }
    },

    marquee: {
      index: {
        ru: '★ Добро пожаловать на сайт Мастера Никитки! ★ Ремонт ПК, укладывание кабелей, переустановка Windows XP SP3 ★ Обмен лицензионных CD/DVD дисков 1 в 1! ★ Звоните прямо сейчас! ★',
        en: '★ Welcome to Master Nikitka\'s website! ★ PC repair, cable management, Windows XP SP3 reinstall ★ 1-to-1 CD/DVD exchange! ★ Call now! ★'
      },
      services: {
        ru: '★ Выезд мастера по городу — БЕСПЛАТНО при условии проведения ремонта! ★ На все работы предоставляется гарантия! ★',
        en: '★ Master city visit — FREE with repair! ★ All work guaranteed! ★'
      },
      disks: {
        ru: '★ Меняем CD на CD, DVD на DVD! ★ Все диски проверены на отсутствие царапин ★ Только рабочие болванки и лицензии ★',
        en: '★ Trade CD for CD, DVD for DVD! ★ All discs tested scratch-free ★ Working media & licenses only ★'
      },
      forum: {
        ru: '★ Добро пожаловать на ретро-форум «КиберНикитка»! Обсуждайте железо 2000-х, разгон процессоров и обмен дисками! ★',
        en: '★ Welcome to CyberNikitka Retro Forum! Discuss 2000s hardware, CPU overclocking & disc trading! ★'
      },
      guestbook: {
        ru: '★ Оставляйте свои отзывы о работе Мастера Никитки и предложения по сайту! ★',
        en: '★ Leave your reviews about Master Nikitka\'s work and website feedback! ★'
      },
      contacts: {
        ru: '★ Мастерская работает с 10:00 до 20:00 без выходных! Выезд мастера по всему городу! ★',
        en: '★ Workshop open daily 10:00 - 20:00! Master visits citywide! ★'
      },
      cabinet: {
        ru: '★ Добро пожаловать в Кабинет Пользователя! Устанавливайте QIP-статусы, качайте Рейтинг 2007 года и оставляйте автографы! ★',
        en: '★ Welcome to User Cabinet! Set QIP statuses, boost 2007 Rating and leave wall signatures! ★'
      },
      login: {
        ru: '★ Введите свой никнейм и пароль для входа в Личный Кабинет! ★',
        en: '★ Enter your username and password to log in to your account! ★'
      },
      register: {
        ru: '★ Заполните анкету для создания аккаунта! ★',
        en: '★ Fill out the form to create your account! ★'
      }
    },

    masterStatus: {
      title: { ru: 'СТАТУС МАСТЕРА', en: 'MASTER STATUS' },
      online: { ru: '● В СЕТИ (ONLINE)', en: '● ONLINE' },
      eta: { ru: 'Готов выехать на дом в течение 1 часа!', en: 'Ready for home visit within 1 hour!' },
      icq: { ru: 'ICQ: 777-200-07', en: 'ICQ: 777-200-07' }
    },

    // 3. INDEX PAGE
    index: {
      welcomeTitle: { ru: 'Компьютерная помощь «КиберНикитка» приветствует вас!', en: 'Computer Repair "CyberNikitka" Welcomes You!' },
      welcomeBody: {
        ru: 'Приветствую всех любителей душевного железа и ретро-компьютеров! Меня зовут <strong>Никитка</strong>, я профессионально занимаюсь ремонтом ПК, сборками под заказ и обменом дисками с 2001 года.<br><br>Если ваш компьютер тормозит, зависает в играх или выдает синий экран смерти BSOD — не беда! Приеду, почищу от пыли, заменю термопасту КТП-8 и настрою Windows XP!',
        en: 'Welcome all lovers of nostalgic hardware and retro PCs! My name is <strong>Nikitka</strong>, I have been professionally doing PC repair, custom builds, and disc trading since 2001.<br><br>If your computer lags, freezes in games, or throws a BSOD blue screen — no worries! I will visit, clean out dust, apply KPT-8 thermal paste, and tune Windows XP!'
      },
      newsTitle: { ru: 'СВЕЖИЕ НОВОСТИ МАСТЕРСКОЙ', en: 'WORKSHOP LATEST NEWS' },
      news1Title: { ru: '★ Поступление новых термопаст КПТ-8 и АлСил-3', en: '★ Fresh batch of KPT-8 & AlSil-3 thermal paste' },
      news1Body: {
        ru: 'Завез свежую термопасту КПТ-8 в тюбиках и термоклей АлСил-3 для радиаторов чипсета. При заказе чистки системного блока замена термопасты на процессоре — абсолютно БЕСПЛАТНО!',
        en: 'Stocked fresh KPT-8 thermal paste and AlSil-3 thermal glue for chipset heatsinks. Free CPU thermal paste repaste with any full PC tower cleaning!'
      },
      news2Title: { ru: '★ Завоз редких CD/DVD дисков!', en: '★ Rare CD/DVD discs stock arrival!' },
      news2Body: {
        ru: 'Обновился каталог! Приехали легендарные диски с играми «Heroes of Might and Magic V», «S.T.A.L.K.E.R.: Тень Чернобыля», а также подборки лучших программ для Windows XP. Спешите забронировать обмен в разделе Обмен CD/DVD!',
        en: 'Catalog updated! Legendary games arrived: "Heroes V", "S.T.A.L.K.E.R.: Shadow of Chernobyl", plus top Windows XP software collections. Reserve your trade in CD/DVD Exchange!'
      },
      btnGoToPrices: { ru: 'ПЕРЕЙТИ К ПРАЙС-ЛИСТУ И ЗАКАЗУ УСЛУГ »', en: 'GO TO PRICE LIST & ORDER SERVICES »' }
    },

    // 4. FOOTERS
    footer: {
      copyright: {
        ru: '© 2001–2026 Компьютерная помощь «КиберНикитка».',
        en: '© 2001–2026 Computer Repair "CyberNikitka".'
      },
      portfolioNote: {
        ru: '🎈 Развлекательный арт-проект & Ретро Web 1.0 Портфолио Концепт',
        en: '🎈 Fun Retro Web 1.0 Art Project & Portfolio Concept'
      },
      adminLink: { ru: 'Панель Мастера [Admin]', en: 'Master Admin Panel' },
      hitCounterLabel: { ru: 'Посетитель № ', en: 'Visitor #' }
    },

    // 5. INFORMERS
    informers: {
      title: { ru: 'ИНФОРМЕРЫ', en: 'INFORMERS' },
      thenVsNowTitle: { ru: '⏳ 2007 vs СЕГОДНЯ 🚀', en: '⏳ 2007 vs TODAY 🚀' },
      selectCityLabel: { ru: '🏙️ ГОРОД: ', en: '🏙️ CITY: ' },
      customCityOption: { ru: '🔍 [ Ввести свой город... ]', en: '🔍 [ Enter custom city... ]' },
      paramHeader: { ru: 'Параметр', en: 'Parameter' },
      thenHeader: { ru: '2007', en: '2007' },
      nowHeader: { ru: 'СЕЙЧАС', en: 'NOW' },
      weatherLabel: { ru: '🌡️ Погода', en: '🌡️ Weather' },
      usdLabel: { ru: '💵 USD (ЦБ)', en: '💵 USD (CBR)' },
      eurLabel: { ru: '💶 EUR (ЦБ)', en: '💶 EUR (CBR)' },
      gasolineLabel: { ru: '⛽ АИ-92', en: '⛽ AI-92 Gas' },
      marqueeHit: {
        ru: '🎵 Хит 2007: МакSим — «Знаешь ли ты» ★ 🎮 Игра 2007: S.T.A.L.K.E.R. ★ ⛽ АИ-92: 18.50₽ ➔ 68.82₽ (РФ)',
        en: '🎵 2007 Hit: MakSim — "Did You Know" ★ 🎮 2007 Game: S.T.A.L.K.E.R. ★ ⛽ Gas: 18.50₽ ➔ 68.82₽ (RU)'
      },
      tgTitle: { ru: '📱 ТЕЛЕГРАМ СОЗДАТЕЛЯ', en: '📱 CREATOR\'S TELEGRAM' },
      tgDesc: { ru: 'Пишите Мастеру Никитке прямо в Telegram:', en: 'Write directly to Master Nikitka in Telegram:' },
      friendsTitle: { ru: 'ДРУЗЬЯ САЙТА', en: 'SITE FRIENDS' }
    },

    // 6. PC BUILDER
    builder: {
      title: {
        ru: 'ИНТЕРАКТИВНЫЙ КОНФИГУРАТОР ПК v3.0 (ПРОВЕРКА СОВМЕСТИМОСТИ И CRYISIS ТЕСТ)',
        en: 'INTERACTIVE PC BUILDER v3.0 (COMPATIBILITY & CRYSIS BENCHMARK)'
      },
      description: {
        ru: 'Сконфигурируйте боевой системный блок 2000-х годов, выберите готовый пресет или соберите индивидуальную конфигурацию:',
        en: 'Configure a battle-ready 2000s PC rig, select a preset, or build a custom setup:'
      },
      presetsTitle: { ru: '⚡ Готовые сборки 2000-2007:', en: '⚡ Ready Presets 2000-2007:' },
      presetBudget: { ru: '💾 Бюджетник 2003 (Pentium 4 + FX 5200)', en: '💾 Budget 2003 (Pentium 4 + FX 5200)' },
      presetGamer: { ru: '🎮 Игровой танк 2005 (Athlon 64 + 7600 GT)', en: '🎮 Gamer Tank 2005 (Athlon 64 + 7600 GT)' },
      presetMonster: { ru: '🔥 Монстр 2007 (Core 2 Duo + 8800 GTS)', en: '🔥 Monster 2007 (Core 2 Duo + 8800 GTS)' },
      legendCpuMb: { ru: '💻 Базовые компоненты (CPU & MB)', en: '💻 Base Components (CPU & MB)' },
      legendGpuRam: { ru: '⚡ Графика, Память & Охлаждение', en: '⚡ GPU, RAM & Cooling' },
      legendHddPsu: { ru: '💾 Диск, Питание & Звук', en: '💾 Storage, PSU & Audio' },
      cpuLabel: { ru: '🧠 Процессор (CPU):', en: '🧠 Processor (CPU):' },
      mbLabel: { ru: '🟩 Материнская плата (MB):', en: '🟩 Motherboard (MB):' },
      gpuLabel: { ru: '🎮 Видеокарта (GPU):', en: '🎮 Graphics Card (GPU):' },
      ramLabel: { ru: '⚡ Оперативная память (RAM):', en: '⚡ RAM Memory:' },
      coolerLabel: { ru: '❄️ Кулер процессора (Cooler):', en: '❄️ CPU Cooler:' },
      hddLabel: { ru: '💾 Накопитель (HDD):', en: '💾 Hard Drive (HDD):' },
      soundLabel: { ru: '🔊 Звуковая карта (Sound):', en: '🔊 Sound Card:' },
      psuLabel: { ru: '🔌 Блок питания (PSU):', en: '🔌 Power Supply (PSU):' },
      totalPriceLabel: { ru: 'Итоговая стоимость:', en: 'Total Rig Price:' },
      powerDrawLabel: { ru: 'Энергопотребление системы:', en: 'System Power Consumption:' },
      fpsMatrixTitle: { ru: '🎮 Оцениваемый FPS в легендарных играх 2000-х:', en: '🎮 Estimated FPS in Legendary 2000s Games:' },
      btnBenchmark: { ru: '🔍 ПРОВЕРИТЬ СОВМЕСТИМОСТЬ (3DMARK TEST)', en: '🔍 TEST COMPATIBILITY (3DMARK BENCH)' },
      btnPrint: { ru: '🖨️ РАСПЕЧАТАТЬ ОФИЦИАЛЬНУЮ СМЕТУ С ПЕЧАТЬЮ', en: '🖨️ PRINT OFFICIAL WORKSHOP RECEIPT' }
    },

    // 7. SERVICES & ORDER FORM
    services: {
      title: {
        ru: 'ПРАЙС-ЛИСТ НА КОМПЬЮТЕРНЫЕ УСЛУГИ (ИНТЕРАКТИВНЫЙ КАЛЬКУЛЯТОР ВЫЗОВА)',
        en: 'COMPUTER REPAIR SERVICES PRICE LIST (INTERACTIVE CALCULATOR)'
      },
      hint: {
        ru: '💡 Отметьте галочками нужные услуги мастера — стоимость и скидка посчитаются автоматически!',
        en: '💡 Check the required services — total cost and discount calculate automatically!'
      },
      orderFormTitle: {
        ru: 'ФОРМА ВЫЗОВА МАСТЕРА ИЛИ ЗАКАЗА ПК',
        en: 'MASTER CALL & PC ASSEMBLY ORDER FORM'
      },
      orderTypeTitle: { ru: '🎯 ТИП ЗАКАЗА В МАСТЕРСКУЮ:', en: '🎯 ORDER TYPE:' },
      typeRepair: { ru: '🛠️ Вызов мастера / Ремонт ПК', en: '🛠️ Master Visit / PC Repair' },
      typeNewPc: { ru: '🖥️ Сборка Нового ПК из Конструктора', en: '🖥️ New 2000s PC Assembly' },
      typeCombo: { ru: '⚡ Все вместе (Сборка ПК + Вызов и Софт)', en: '⚡ Combo (New PC + Setup & Repair)' },
      nameLabel: { ru: 'Ваше имя: *', en: 'Your Name: *' },
      phoneLabel: { ru: 'Номер телефона: *', en: 'Phone Number: *' },
      btnSubmit: { ru: 'ОТПРАВИТЬ ЗАЯВКУ', en: 'SUBMIT ORDER' }
    },

    // 8. DISKS CATALOG
    disks: {
      title: { ru: 'Каталог CD/DVD дисков для обмена', en: 'CD/DVD Disc Catalog for Exchange' },
      intro: { ru: 'Выберите интересующий вас диск из списка ниже и нажмите кнопку «ОБМЕНЯТЬ». Все диски в рабочем состоянии без царапин!', en: 'Choose a disc from the list below and click "EXCHANGE". All media tested 100% scratch-free!' },
      categoriesLabel: { ru: 'Категории:', en: 'Categories:' },
      catAll: { ru: 'Все диски', en: 'All Disks' },
      catGames: { ru: 'Игры', en: 'Games' },
      catSoft: { ru: 'Софт / Программы', en: 'Software' },
      catMovies: { ru: 'Фильмы / Кино', en: 'Movies' },
      showingCount: { ru: 'Показано дисков: 12 из 12', en: 'Showing discs: 12 of 12' },
      inStock: { ru: 'В НАЛИЧИИ', en: 'IN STOCK' },
      btnExchange: { ru: 'ОБМЕНЯТЬ', en: 'TRADE NOW' },
      rulesTitle: { ru: 'ПРАВИЛА ОБМЕНА', en: 'EXCHANGE RULES' },
      rulesContent: {
        ru: '1. Диски должны быть без сильных царапин.<br>2. Обмен проходит 1 к 1.<br>3. Лицензии меняем только на аналогичные.<br>4. Предварительно бронируйте диски по телефону!',
        en: '1. Discs must be free of major scratches.<br>2. 1-to-1 exchange only.<br>3. License for license trade only.<br>4. Please call ahead to reserve discs!'
      }
    },

    // 9. FORUM
    forum: {
      statsTitle: { ru: 'СТАТИСТИКА', en: 'STATISTICS' },
      statTopics: { ru: 'Тем на форуме:', en: 'Forum Topics:' },
      statPosts: { ru: 'Сообщений:', en: 'Posts:' },
      statUsers: { ru: 'Пользователей:', en: 'Registered Users:' },
      quickLinksTitle: { ru: 'БЫСТРЫЕ ССЫЛКИ', en: 'QUICK LINKS' },
      btnHome: { ru: '🏠 Главная форума', en: '🏠 Forum Home' },
      btnNewTopic: { ru: '✏️ Создать тему', en: '✏️ New Topic' },
      mainHeading: { ru: 'Конференция «КиберНикитка»', en: '«CyberNikitka» Retro Conference' },
      btnCreateTopic: { ru: '+ СОЗДАТЬ НОВУЮ ТЕМУ', en: '+ CREATE NEW TOPIC' },
      colCategory: { ru: 'Форум / Описание', en: 'Forum / Description' },
      colTopics: { ru: 'Темы', en: 'Topics' },
      colReplies: { ru: 'Ответы', en: 'Replies' },
      colLastPost: { ru: 'Последнее сообщение', en: 'Last Post' },
      allTopicsTitle: { ru: 'СПИСОК ВСЕХ ТЕМ (ПОСЛЕДНИЕ ОБНОВЛЕНИЯ)', en: 'ALL TOPICS LIST (RECENT UPDATES)' },
      btnShowAllCategories: { ru: 'ПОКАЗАТЬ ВСЕ РАЗДЕЛЫ', en: 'SHOW ALL CATEGORIES' },
      btnBackToTopics: { ru: '« Назад к списку тем', en: '« Back to Topics' },
      quickReplyTitle: { ru: 'Быстрый ответ в эту тему', en: 'Quick Reply to Topic' },
      labelAuthor: { ru: 'Ваше имя / Никнейм: *', en: 'Your Name / Nickname: *' },
      labelIcq: { ru: 'ICQ UIN:', en: 'ICQ UIN:' },
      smiliesLabel: { ru: 'Смайлы:', en: 'Smilies:' },
      labelMessage: { ru: 'Сообщение: *', en: 'Message: *' },
      replyPlaceholder: { ru: 'Напишите ваш ответ...', en: 'Write your reply...' },
      btnSubmitReply: { ru: 'ОТПРАВИТЬ ОТВЕТ', en: 'SUBMIT REPLY' },
      btnClear: { ru: 'ОЧИСТИТЬ', en: 'CLEAR' },
      whoIsOnlineTitle: { ru: 'КТО ОНЛАЙН', en: 'WHO IS ONLINE' }
    },

    // 10. GUESTBOOK
    guestbook: {
      mainHeading: { ru: 'Гостевая книга мастерской', en: 'Workshop Guestbook' },
      intro: { ru: 'Здесь вы можете оставить отзыв о проведенном ремонте или договориться об обмене редкого диска.', en: 'Leave your review on repairs or arrange rare disc exchanges.' },
      formTitle: { ru: 'Оставить запись в Гостевой книге', en: 'Leave a Guestbook Entry' },
      labelAuthor: { ru: 'Ваше имя или никнейм: *', en: 'Your Name or Nickname: *' },
      authorPlaceholder: { ru: 'Например: Dimon_2007', en: 'e.g. Dimon_2007' },
      labelMessage: { ru: 'Текст сообщения: *', en: 'Message text: *' },
      messagePlaceholder: { ru: 'Напишите ваш отзыв или вопрос...', en: 'Write your review or question...' },
      labelCaptcha: { ru: 'Проверка на спам: сколько будет 2 + 3? *', en: 'Anti-Spam Check: What is 2 + 3? *' },
      captchaPlaceholder: { ru: 'Число', en: 'Number' },
      btnSubmit: { ru: 'ДОБАВИТЬ ЗАПИСЬ', en: 'POST ENTRY' },
      btnClear: { ru: 'ОЧИСТИТЬ', en: 'CLEAR' },
      postsTitle: { ru: 'ЛЕНТА СООБЩЕНИЙ', en: 'GUESTBOOK FEED' },
      adminReplyTitle: { ru: 'Ответ Мастера Никитки:', en: 'Master Nikitka\'s Reply:' },
      rulesTitle: { ru: 'ПРАВИЛА', en: 'RULES' },
      rulesBody: { ru: 'Запрещены мат, оскорбления и спам! Все сообщения проходят модерацию.', en: 'Profanity, insults, and spam are prohibited! All posts are moderated.' }
    },

    // 11. CONTACTS
    contacts: {
      mainHeading: { ru: 'Контакты и адрес мастерской', en: 'Contacts & Workshop Location' },
      labelPhone: { ru: 'Телефон для связи:', en: 'Contact Phone:' },
      masterName: { ru: '(Мастер Никитка)', en: '(Master Nikitka)' },
      labelTg: { ru: 'Telegram создателя:', en: 'Creator\'s Telegram:' },
      statusOnline: { ru: '[● В СЕТИ]', en: '[● ONLINE]' },
      statusOnlineEn: { ru: '[● В СЕТИ / ONLINE]', en: '[● ONLINE]' },
      labelIcq: { ru: 'ICQ UIN:', en: 'ICQ UIN:' },
      labelEmail: { ru: 'Электронная почта:', en: 'E-Mail:' },
      labelAddress: { ru: 'Адрес мастерской:', en: 'Workshop Address:' },
      addressVal: { ru: 'г. Москва, Радиорынок (Павильон № 42, 2 этаж)', en: 'Moscow, Radio Market (Pavilion #42, 2nd floor)' },
      labelWorkHours: { ru: 'Время работы:', en: 'Working Hours:' },
      workHoursVal: { ru: 'Ежедневно с 10:00 до 20:00 (без перерыва на обед)', en: 'Daily 10:00 to 20:00 (No lunch break)' },
      mapTitle: { ru: 'СХЕМА ПРОЕЗДА НА РАДИОРЫНОК', en: 'LOCATION MAP TO RADIO MARKET' },
      mapDirections: { ru: 'Проезд от метро на автобусе № 142 до остановки «Радиорынок».', en: 'Take bus #142 from metro station to «Radio Market» stop.' },
      quickMsgTitle: { ru: 'БЫСТРОЕ СООБЩЕНИЕ МАСТЕРУ', en: 'QUICK MESSAGE TO MASTER' },
      labelName: { ru: 'Ваше имя:', en: 'Your Name:' },
      labelContact: { ru: 'Ваш телефон, ICQ или Telegram:', en: 'Your Phone, ICQ or Telegram:' },
      labelMsg: { ru: 'Текст сообщения:', en: 'Message Text:' },
      btnSendMsg: { ru: 'ОТПРАВИТЬ В TELEGRAM / ICQ', en: 'SEND TO TELEGRAM / ICQ' },
      parkingTitle: { ru: 'ПАРКОВКА', en: 'PARKING' },
      parkingDesc: { ru: 'Возле радиорынка есть бесплатная парковка на 50 машин.', en: 'Free 50-car parking available near the radio market.' }
    },

    // 12. CABINET
    cabinet: {
      mainHeading: { ru: 'Кабинет Пользователя (Версия 2007)', en: 'User Cabinet (Version 2007)' },
      viewsTitle: { ru: 'ПРОСМОТРЫ', en: 'PROFILE VIEWS' },
      viewsLabel: { ru: 'Профиль просмотрен:', en: 'Profile viewed:' },
      viewsTimes: { ru: 'раз', en: 'times' },
      btnChangeAvatar: { ru: '🖼 Изменить аватарку', en: '🖼 Change Avatar' },
      btnLogout: { ru: '🚪 Выйти из системы', en: '🚪 Log Out' },
      qipStatusLabel: { ru: 'QIP Статус:', en: 'QIP Status:' },
      statusQuotePlaceholder: { ru: 'Моя цитата / статус в аське...', en: 'My ICQ status quote...' },
      btnSaveQuote: { ru: '[Сохранить]', en: '[Save]' },
      ratingTitle: { ru: '⚡ МОЙ РЕЙТИНГ АВТОРИТЕТА (2007 YEAR):', en: '⚡ MY REPUTATION RATING (YEAR 2007):' },
      ratingInfo: { ru: '💡 Рейтинг растет от добавления дисков (+10%), тем на форуме (+5%) и заказов ремонта (+15%)!', en: '💡 Rating boosts from trading discs (+10%), forum topics (+5%) & repair orders (+15%)!' },
      badgesSectionTitle: { ru: '🏆 МОИ НАГРАДЫ И РЕТРО-БЕЙДЖИ', en: '🏆 MY BADGES & RETRO REWARDS' },
      pcSpecsSectionTitle: { ru: '🖥 МОЯ КОНФИГУРАЦИЯ ПК ДЛЯ ПОДПИСИ НА ФОРУМЕ', en: '🖥 MY PC SPECIFICATION FOR FORUM SIGNATURE' },
      pcSpecsDesc: { ru: 'Укажите спецификацию вашего ПК. Она будет автоматически отображаться в подписи к вашим сообщениям на Форуме!', en: 'Enter your PC specs. It will automatically show in your Forum post signatures!' },
      labelPcSpecs: { ru: 'Процессор, ОЗУ и Видеокарта:', en: 'CPU, RAM and GPU Specs:' },
      pcSpecsPlaceholder: { ru: 'Например: Core 2 Duo E6600 | 2GB DDR2 | GeForce 8800GT', en: 'e.g. Core 2 Duo E6600 | 2GB DDR2 | GeForce 8800GT' },
      btnSavePcSpecs: { ru: '💾 СОХРАНИТЬ ПОДПИСЬ ПК', en: '💾 SAVE PC SIGNATURE' },
      wallSectionTitle: { ru: '✍️ СТЕНА АВТОГРАФОВ ПРОФИЛЯ', en: '✍️ PROFILE WALL / AUTOGRAPHS' },
      wallSubtitle: { ru: '[ Оставь автограф! ]', en: '[ Leave autograph! ]' },
      labelWallMsg: { ru: 'Оставить роспись / сообщение на стене:', en: 'Leave wall signature or message:' },
      wallMsgPlaceholder: { ru: 'Напиши что-нибудь приветливое...', en: 'Write a friendly note...' },
      btnSignWall: { ru: '🖊️ РОСПИСАТЬСЯ НА СТЕНЕ', en: '🖊️ SIGN THE WALL' },
      wallListTitle: { ru: 'Автографы друзей и гостей:', en: 'Autographs from friends & guests:' },
      disksSectionTitle: { ru: '📀 МОЙ ДИСКОВЫЙ ФОНД (ДОБАВИТЬ ДИСК НА ОБМЕН)', en: '📀 MY DISC COLLECTION (ADD FOR TRADE)' },
      addDiskTitle: { ru: 'Добавить диск в каталог обмена:', en: 'Add disc to exchange catalog:' },
      labelDiskTitle: { ru: 'Название диска: *', en: 'Disc Title: *' },
      diskTitlePlaceholder: { ru: 'Например: Fallout 2...', en: 'e.g. Fallout 2...' },
      labelDiskCategory: { ru: 'Категория:', en: 'Category:' },
      labelDiskType: { ru: 'Тип носителя:', en: 'Media Format:' },
      labelDiskYear: { ru: 'Год выпуска:', en: 'Release Year:' },
      labelDiskDesc: { ru: 'Описание диска и условия обмена:', en: 'Disc description & trade terms:' },
      diskDescPlaceholder: { ru: 'Состояние коробки...', en: 'Condition of box...' },
      btnAddDisk: { ru: '➕ ДОБАВИТЬ ДИСК В КАТАЛОГ', en: '➕ ADD DISC TO CATALOG' },
      myDisksTitle: { ru: 'Мои диски в каталоге:', en: 'My Discs in Catalog:' },
      colDiskTitle: { ru: 'Название диска', en: 'Disc Title' },
      colDiskCategory: { ru: 'Категория', en: 'Category' },
      colDiskFormat: { ru: 'Формат', en: 'Format' },
      colDiskStatus: { ru: 'Статус', en: 'Status' },
      requestsSectionTitle: { ru: '🛠 МОИ ВЫЗОВЫ МАСТЕРА И ЗАЯВКИ НА РЕМОНТ', en: '🛠 MY MASTER VISITS & REPAIR ORDERS' },
      colReqId: { ru: '№ Заявки', en: 'Order #' },
      colReqPhone: { ru: 'Телефон', en: 'Phone' },
      colReqDate: { ru: 'Дата', en: 'Date' },
      colReqStatus: { ru: 'Статус заявки', en: 'Order Status' },
      forumSectionTitle: { ru: '💬 МОЯ АКТИВНОСТЬ НА ФОРУМЕ', en: '💬 MY FORUM ACTIVITY' },
      myTopicsTitle: { ru: 'Мои созданные темы:', en: 'My Topics:' },
      myPostsTitle: { ru: 'Мои ответы и посты:', en: 'My Posts & Replies:' },
      infoSidebarTitle: { ru: 'ИНФО', en: 'INFO' },
      avatarModalTitle: { ru: '🖼️ ВЫБЕРИТЕ РЕТРО-АВАТАРКУ (80x80)', en: '🖼️ SELECT RETRO AVATAR (80x80)' },
      btnClose: { ru: 'ЗАКРЫТЬ', en: 'CLOSE' }
    },

    // 13. LOGIN & REGISTER
    cabinet: {
      mainHeading: { ru: 'Кабинет Пользователя (Версия 2007)', en: 'User Cabinet (2007 Edition)' },
      viewsTitle: { ru: 'ПРОСМОТРЫ', en: 'VIEWS' },
      viewsLabel: { ru: 'Профиль просмотрен:', en: 'Profile views:' },
      viewsTimes: { ru: 'раз', en: 'times' },
      btnChangeAvatar: { ru: '🖼 Изменить аватарку', en: '🖼 Change Avatar' },
      btnLogout: { ru: '🚪 Выйти из системы', en: '🚪 Log out' },
      qipStatusLabel: { ru: 'QIP Статус:', en: 'QIP Status:' },
      statusQuotePlaceholder: { ru: 'Моя цитата / статус в аське...', en: 'My quote / ICQ status...' },
      btnSaveQuote: { ru: '[Сохранить]', en: '[Save]' },
      ratingTitle: { ru: '⚡ МОЙ РЕЙТИНГ АВТОРИТЕТА (2007 YEAR):', en: '⚡ MY RATING & AUTHORITY (YEAR 2007):' },
      ratingInfo: { ru: '💡 Рейтинг растет от добавления дисков (+10%), тем на форуме (+5%) и заказов ремонта (+15%)!', en: '💡 Rating increases by adding discs (+10%), forum topics (+5%) and repair orders (+15%)!' },
      badgesSectionTitle: { ru: '🏆 МОИ НАГРАДЫ И РЕТРО-БЕЙДЖИ', en: '🏆 MY AWARDS & RETRO BADGES' },
      pcSpecsSectionTitle: { ru: '🖥 МОЯ КОНФИГУРАЦИЯ ПК ДЛЯ ПОДПИСИ НА ФОРУМЕ', en: '🖥 MY PC SPECS FOR FORUM SIGNATURE' },
      pcSpecsDesc: { ru: 'Укажите спецификацию вашего ПК. Она будет автоматически отображаться в подписи к вашим сообщениям на Форуме!', en: 'Enter your PC specs. It will automatically show in your signature on the Forum!' },
      labelPcSpecs: { ru: 'Процессор, ОЗУ и Видеокарта:', en: 'CPU, RAM and GPU:' },
      pcSpecsPlaceholder: { ru: 'Например: Core 2 Duo E6600 | 2GB DDR2 | GeForce 8800GT', en: 'e.g. Core 2 Duo E6600 | 2GB DDR2 | GeForce 8800GT' },
      btnSavePcSpecs: { ru: '💾 СОХРАНИТЬ ПОДПИСЬ ПК', en: '💾 SAVE PC SIGNATURE' },
      wallSectionTitle: { ru: '✍️ СТЕНА АВТОГРАФОВ ПРОФИЛЯ', en: '✍️ PROFILE WALL OF AUTOGRAPHS' },
      wallLeaveNote: { ru: '[ Оставь автограф! ]', en: '[ Leave signature! ]' },
      labelWallMsg: { ru: 'Оставить роспись / сообщение на стене:', en: 'Leave a signature / message on the wall:' },
      wallMsgPlaceholder: { ru: 'Напиши что-нибудь приветливое (например: Был тут, респект!)...', en: 'Write something friendly...' },
      wallPlaceholder: { ru: 'Напиши что-нибудь приветливое...', en: 'Write something friendly...' },
      btnSubmitWall: { ru: '✍️ ОСТАВИТЬ АВТОГРАФ НА СТЕНЕ', en: '✍️ LEAVE AUTOGRAPH ON WALL' },
      wallAutographsTitle: { ru: 'Автографы друзей:', en: 'Friends\' Autographs:' },
      disksSectionTitle: { ru: '📀 МОЙ ДИСКОВЫЙ ФОНД (ДОБАВИТЬ ДИСК НА ОБМЕН)', en: '📀 MY DISC COLLECTION (ADD DISC TO TRADE)' },
      addDiskTitle: { ru: 'Добавить диск в каталог обмена:', en: 'Add disc to trade catalog:' },
      labelDiskTitle: { ru: 'Название диска: *', en: 'Disc Title: *' },
      diskTitlePlaceholder: { ru: 'Например: Fallout 2 (Лицензия 1С)', en: 'e.g. Fallout 2 (1C License)' },
      labelDiskType: { ru: 'Тип носителя:', en: 'Media Type:' },
      labelDiskYear: { ru: 'Год выпуска:', en: 'Release Year:' },
      labelDiskDesc: { ru: 'Описание диска и условия обмена:', en: 'Disc description and trade terms:' },
      diskDescPlaceholder: { ru: 'Состояние коробки, царапины, на что хотели бы обменять...', en: 'Case condition, scratches, what you would trade for...' },
      qip: {
        online: { ru: '🟢 В сети (Online)', en: '🟢 Online' },
        dnd: { ru: '🟡 Занят (DND)', en: '🟡 Busy (DND)' },
        dumplings: { ru: '🍕 Ем пельмени', en: '🍕 Eating dumplings' },
        cs16: { ru: '🎮 Играю в CS 1.6', en: '🎮 Playing CS 1.6' },
        sleeping: { ru: '💤 Сплю', en: '💤 Sleeping' },
        smoking: { ru: '🚬 Курю на балконе', en: '🚬 Smoking on balcony' },
        winamp: { ru: '🎧 Слушаю Winamp', en: '🎧 Listening Winamp' }
      }
    },

    login: {
      pageTitle: { ru: '🔑 ВХОД В СИСТЕМУ «КИБЕРНИКИТКА»', en: '🔑 LOGIN TO «CYBERNIKITKA»' },
      modalTitle: { ru: '🔑 ВХОД В СИСТЕМУ «КИБЕРНИКИТКА»', en: '🔑 LOGIN TO «CYBERNIKITKA»' },
      intro: { ru: 'Введите имя пользователя и пароль для получения доступа к Личному Кабинету.', en: 'Enter your username and password to access your Account.' },
      labelUsername: { ru: 'Имя пользователя (Логин): *', en: 'Username (Login): *' },
      usernamePlaceholder: { ru: 'Например: Dimon_2007', en: 'e.g. Dimon_2007' },
      labelPassword: { ru: 'Пароль: *', en: 'Password: *' },
      passwordPlaceholder: { ru: '••••••••', en: '••••••••' },
      labelRemember: { ru: 'Запомнить меня на этом ПК', en: 'Remember me on this PC' },
      btnSubmit: { ru: 'ВОЙТИ В СИСТЕМУ', en: 'LOG IN' },
      linkRegister: { ru: '[ Регистрация ]', en: '[ Register ]' },
      testAccountsNote: { ru: 'Тестовые учетные записи: Admin (Логин: nikitka_master / Пароль: admin123)', en: 'Test Accounts: Admin (Login: nikitka_master / Password: admin123)' },
      securityTitle: { ru: 'БЕЗОПАСНОСТЬ', en: 'SECURITY' },
      securityDesc: { ru: 'Ваш сессионный токен защищен хэшированием SHA-256. Не передавайте свои пароли третьим лицам!', en: 'Your session token is secured with SHA-256 hashing. Do not share your passwords!' }
    },

    register: {
      mainHeading: { ru: 'Регистрация нового пользователя', en: 'New User Registration' },
      labelUsername: { ru: 'Никнейм / Логин: *', en: 'Nickname / Username: *' },
      usernamePlaceholder: { ru: 'Например: Gamer_2007', en: 'e.g. Gamer_2007' },
      labelIcq: { ru: 'ICQ UIN:', en: 'ICQ UIN:' },
      icqPlaceholder: { ru: '777-200-07', en: '777-200-07' },
      labelPassword: { ru: 'Пароль: *', en: 'Password: *' },
      passwordPlaceholder: { ru: 'Минимум 4 символа', en: 'Minimum 4 characters' },
      labelConfirmPassword: { ru: 'Повторите пароль: *', en: 'Confirm Password: *' },
      confirmPasswordPlaceholder: { ru: 'Повтор пароля', en: 'Repeat password' },
      labelCity: { ru: 'Ваш город:', en: 'Your City:' },
      cityPlaceholder: { ru: 'Например: Москва', en: 'e.g. Moscow' },
      labelAvatar: { ru: 'Выберите ретро-аватарку:', en: 'Choose a retro avatar:' },
      btnSubmit: { ru: 'ЗАРЕГИСТРИРОВАТЬСЯ', en: 'CREATE ACCOUNT' },
      linkLogin: { ru: '[ Уже есть аккаунт? Войти ]', en: '[ Already have an account? Login ]' },
      informerTitle: { ru: 'ИНФОРМАТОР', en: 'INFORMER' },
      informerDesc: { ru: 'После регистрации вы сможете вести свой дисковый фонд и отслеживать статус ремонта компьютера!', en: 'After registration you can manage your disc collection & track PC repair status!' }
    },

    // 14. TIME MACHINE & NYAN CAT
    cat: {
      speech: {
        ru: '💬 «МЯУ! Бегу в 2007 год относить вашу заявку Мастеру Никитке через Dial-Up модем 56k!...»',
        en: '💬 «MEOW! Running to year 2007 to deliver your order via 56k Dial-Up modem!...»'
      },
      pauseNotice: {
        ru: ' (⏸️ Наведите мышкой для паузы!)',
        en: ' (⏸️ Hover mouse to pause!)'
      }
    },
    modal: {
      timeMachineTitle: {
        ru: '⏳ ТЕЛЕПОРТАЦИЯ ЗАЯВКИ В 2007 ГОД [PORTAL ACTIVE]',
        en: '⏳ TELEPORTING ORDER TO YEAR 2007 [PORTAL ACTIVE]'
      },
      successTitle: {
        ru: '🚀 ЗАЯВКА УСПЕШНО ОТПРАВЛЕНА В 2007 ГОД!',
        en: '🚀 ORDER SUCCESSFULLY TELEPORTED TO YEAR 2007!'
      },
      catBanner: {
        ru: '🐱 ฅ^•ﻌ•^ฅ Кот Барсик доставил заявку через Dial-Up модем 56k!',
        en: '🐱 ฅ^•ﻌ•^ฅ Barsik the Cat delivered your order via 56k Dial-Up modem!'
      },
      btnRunCatAgain: { ru: '🐱 ЗАПУСТИТЬ КОТА ЕЩЕ РАЗ!', en: '🐱 RUN CAT AGAIN!' },
      btnConfirm: { ru: '👍 ПОНЯТНО, ЖДУ МАСТЕРА ИЗ 2007 ГОДА!', en: '👍 GOT IT, WAITING FOR MASTER FROM 2007!' }
    },

    // 15. AUTH
    auth: {
      greeting: { ru: 'Привет, ', en: 'Hello, ' },
      login: { ru: '[ Вход ]', en: '[ Login ]' },
      register: { ru: '[ Регистрация ]', en: '[ Register ]' },
      cabinet: { ru: '[ Личный кабинет ]', en: '[ My Account ]' },
      logout: { ru: '[ Выход ]', en: '[ Logout ]' }
    }
  };

  const CyberI18n = {
    currentLang: DEFAULT_LANG,

    init() {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && (saved === 'ru' || saved === 'en')) {
        this.currentLang = saved;
      } else {
        this.currentLang = DEFAULT_LANG;
      }

      this.applyTranslations();
      this.updateSwitcherUI();
    },

    getLang() {
      return this.currentLang;
    },

    setLang(lang) {
      if (lang !== 'ru' && lang !== 'en') return;
      this.currentLang = lang;
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch (e) {}

      this.applyTranslations();
      this.updateSwitcherUI();

      window.dispatchEvent(new CustomEvent('cyberLangChanged', {
        detail: { lang: lang }
      }));
    },

    t(path, fallback = '') {
      const parts = path.split('.');
      let current = i18nDictionary;
      for (let i = 0; i < parts.length; i++) {
        if (!current[parts[i]]) return fallback || path;
        current = current[parts[i]];
      }
      if (typeof current === 'object' && current[this.currentLang]) {
        return current[this.currentLang];
      }
      return fallback || path;
    },

    applyTranslations() {
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const text = this.t(key);
        if (text) el.textContent = text;
      });

      document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.getAttribute('data-i18n-html');
        const html = this.t(key);
        if (html) el.innerHTML = html;
      });

      document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const ph = this.t(key);
        if (ph) el.placeholder = ph;
      });
    },

    updateSwitcherUI() {
      document.querySelectorAll('.lang-btn').forEach(btn => {
        const lang = btn.getAttribute('data-lang');
        if (lang === this.currentLang) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }
  };

  global.CyberI18n = CyberI18n;

  document.addEventListener('DOMContentLoaded', () => {
    CyberI18n.init();
  });
})(typeof window !== 'undefined' ? window : this);
