/* ==========================================================================
   ИНТЕРАКТИВНЫЙ СКРИПТ ПОРТАЛА «КИБЕРНИКИТКА» (Web 1.0 Logic & Security v6.0)
   (Модули: Авто-корректировка ввода, Адаптивность для всех устройств & CBR API)
   ========================================================================== */

/* --------------------------------------------------------------------------
   0. ГЛОБАЛЬНЫЙ ПЕРЕХВАТЧИК ОШИБОК И ЛОГИРОВАНИЕ (OBSERVABILITY & SAFETY)
   -------------------------------------------------------------------------- */
(function setupErrorLogging() {
  const originalConsoleError = console.error;
  console.error = function (...args) {
    originalConsoleError.apply(console, ['[CyberNikitka Error]', ...args]);
  };

  window.onerror = function (message, source, lineno, colno, error) {
    console.error(`Uncaught Exception: ${message} at ${source}:${lineno}:${colno}`, error);
    return false;
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  initClock();
  initHitCounter();
  initCatalogFilters();
  initForms();
  initCalculator();
  initFormAutoSave();
  initBackupLoader();
  initRealCurrencyRates();
  initAutoCorrections();
  initThenVsNowWidget();
  initPjaxNavigation();
});

/* --------------------------------------------------------------------------
   1. ОБНОВЛЕНИЕ ВРЕМЕНИ В ШАПКЕ
   -------------------------------------------------------------------------- */
function initClock() {
  const clockEl = document.getElementById('header-clock');
  if (!clockEl) return;

  function update() {
    const now = new Date();
    const isEn = window.CyberI18n && window.CyberI18n.currentLang === 'en';
    
    const daysRu = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    const daysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    const monthsRu = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
    const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const days = isEn ? daysEn : daysRu;
    const months = isEn ? monthsEn : monthsRu;

    const dayStr = days[now.getDay()];
    const dateNum = now.getDate();
    const monthStr = months[now.getMonth()];
    const hours = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');

    clockEl.textContent = `${dayStr}, ${dateNum} ${monthStr} ${hours}:${mins}`;
  }

  update();
  setInterval(update, 30000);

  window.addEventListener('cyberLangChanged', () => {
    update();
  });
}

/* --------------------------------------------------------------------------
   2. СЧЕТЧИК ПОСЕЩЕНИЙ В ПОДВАЛЕ
   -------------------------------------------------------------------------- */
function initHitCounter() {
  const counterEl = document.getElementById('hit-counter');
  if (!counterEl) return;

  try {
    let visits = parseInt(localStorage.getItem('cyber_nikitka_visits') || '4219', 10);
    if (isNaN(visits)) visits = 4219;

    if (!sessionStorage.getItem('cyber_nikitka_session')) {
      visits += 1;
      localStorage.setItem('cyber_nikitka_visits', visits.toString());
      sessionStorage.setItem('cyber_nikitka_session', 'true');
    }

    counterEl.textContent = String(visits).padStart(6, '0');
  } catch (err) {
    console.error('Сбой доступа к localStorage при работе счетчика:', err);
    counterEl.textContent = '004219';
  }
}

/* --------------------------------------------------------------------------
   3. ПОЛУЧЕНИЕ РЕАЛЬНОГО КУРСА ЦБ РФ (API CBR)
   -------------------------------------------------------------------------- */
function initRealCurrencyRates() {
  const usdEl = document.getElementById('real-usd');
  const eurEl = document.getElementById('real-eur');
  const usdTab = document.getElementById('real-usd-table');
  const eurTab = document.getElementById('real-eur-table');

  fetch('https://www.cbr-xml-daily.ru/daily_json.js')
    .then(res => res.json())
    .then(data => {
      if (data && data.Valute) {
        const usd = data.Valute.USD.Value.toFixed(2);
        const eur = data.Valute.EUR.Value.toFixed(2);
        if (usdEl) usdEl.textContent = usd;
        if (eurEl) eurEl.textContent = eur;
        if (usdTab) usdTab.textContent = usd;
        if (eurTab) eurTab.textContent = eur;
      }
    })
    .catch(() => {
      if (usdEl) usdEl.textContent = '88.50';
      if (eurEl) eurEl.textContent = '96.20';
      if (usdTab) usdTab.textContent = '88.50';
      if (eurTab) eurTab.textContent = '96.20';
    });
}

/* --------------------------------------------------------------------------
   4. АВТО-КОРРЕКТИРОВКА И АДАПТИВНАЯ ОПТИМИЗАЦИЯ ПОЛЕЙ
   -------------------------------------------------------------------------- */
function initAutoCorrections() {
  // 1. Авто-обрезка лишних пробелов по краям (Auto-Trim)
  document.querySelectorAll('input[type="text"], input[type="email"], textarea').forEach(input => {
    input.addEventListener('blur', () => {
      input.value = input.value.trim();
    });
  });

  // 2. Авто-форматирование российских номеров телефонов
  document.querySelectorAll('input[type="tel"]').forEach(input => {
    input.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.length > 0) {
        if (val[0] === '7' || val[0] === '8') {
          val = val.substring(1);
        }
        let formatted = '8 (';
        if (val.length > 0) formatted += val.substring(0, 3);
        if (val.length >= 3) formatted += ') ' + val.substring(3, 6);
        if (val.length >= 6) formatted += '-' + val.substring(6, 8);
        if (val.length >= 8) formatted += '-' + val.substring(8, 10);
        e.target.value = formatted;
      }
    });
  });
}

/* --------------------------------------------------------------------------
   5. ФИЛЬТРАЦИЯ И ПОИСК ДИСКОВ
   -------------------------------------------------------------------------- */
function initCatalogFilters() {
  const searchInput = document.getElementById('catalog-search');
  const headerSearchInput = document.getElementById('header-search-input');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const diskCards = document.querySelectorAll('.disk-card');

  if (!diskCards.length) return;

  let currentCategory = 'all';
  let searchQuery = '';

  function applyFilter() {
    diskCards.forEach(card => {
      const category = card.dataset.category || '';
      const title = (card.querySelector('.disk-title')?.textContent || '').toLowerCase();
      
      const matchCategory = (currentCategory === 'all' || category === currentCategory);
      const matchSearch = (!searchQuery || title.includes(searchQuery.toLowerCase()));

      if (matchCategory && matchSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });

    const visibleCount = Array.from(diskCards).filter(c => c.style.display !== 'none').length;
    const countEl = document.getElementById('catalog-count');
    if (countEl) {
      const t = (window.CyberI18n && typeof window.CyberI18n.t === 'function') ? window.CyberI18n.t.bind(window.CyberI18n) : (k, f) => f;
      countEl.textContent = `${t('catalog.countPrefix', 'Показано дисков:')} ${visibleCount} ${t('catalog.countOf', 'из')} ${diskCards.length}`;
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.category || 'all';
      applyFilter();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      applyFilter();
    });
  }

  if (headerSearchInput) {
    headerSearchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      if (searchInput) searchInput.value = searchQuery;
      applyFilter();
    });
  }
}

/* --------------------------------------------------------------------------
   6. ВАЛИДАЦИЯ ФОРМ И ЗАЩИТА (XSS & ANTI-SPAM CAPTCHA)
   -------------------------------------------------------------------------- */
function triggerRunningCat() {
  const oldCat = document.getElementById('running-retro-cat');
  if (oldCat) oldCat.remove();

  const t = (window.CyberI18n && typeof window.CyberI18n.t === 'function') ? window.CyberI18n.t.bind(window.CyberI18n) : (k, f) => f;
  const catSpeechText = t('cat.speech', '💬 «МЯУ! Бегу в 2007 год относить вашу заявку Мастеру Никитке через Dial-Up модем 56k!...»') + t('cat.pauseNotice', ' (⏸️ Наведите мышкой для паузы!)');

  const catContainer = document.createElement('div');
  catContainer.id = 'running-retro-cat';
  catContainer.className = 'running-cat-container';
  catContainer.innerHTML = `
    <div class="cat-speech-bubble">
      ${catSpeechText}
    </div>
    <div class="cat-main-body">
      <span class="cat-rainbow-trail">≡≡≡≡≡≡≡≡≡≡★</span>
      <span class="cat-head-sprite">🐱💨</span>
      <span class="cat-items-trail">💾 📀 ⚡ 🔌 💻</span>
    </div>
  `;
  document.body.appendChild(catContainer);

  spawnFloppyParticles();

  setTimeout(() => {
    if (catContainer) catContainer.remove();
  }, 18500);
}

function spawnFloppyParticles() {
  const icons = ['💾', '📀', '⚡', '🔌', '💻', '🐱', '📞', '🖱️'];
  for (let i = 0; i < 15; i++) {
    setTimeout(() => {
      const p = document.createElement('div');
      p.className = 'retro-floppy-particle';
      p.textContent = icons[Math.floor(Math.random() * icons.length)];
      p.style.left = `${Math.random() * 80 + 10}vw`;
      p.style.bottom = `${Math.random() * 20 + 20}vh`;
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 2800);
    }, i * 150);
  }
}

function showTimeMachineModal(clientName, phone) {
  const oldModal = document.getElementById('time-machine-modal-overlay');
  if (oldModal) oldModal.remove();

  if (window.SoundFX) {
    if (typeof window.SoundFX.playHddSeek === 'function') window.SoundFX.playHddSeek();
    if (typeof window.SoundFX.playIcqUhOh === 'function') {
      setTimeout(() => window.SoundFX.playIcqUhOh(), 300);
    }
  }

  const estimateEl = document.getElementById('services-total-price');
  const estimateText = estimateEl ? estimateEl.textContent : '';

  const t = (window.CyberI18n && typeof window.CyberI18n.t === 'function') ? window.CyberI18n.t.bind(window.CyberI18n) : (k, f) => f;

  const overlay = document.createElement('div');
  overlay.id = 'time-machine-modal-overlay';
  overlay.className = 'time-machine-overlay';

  overlay.innerHTML = `
    <div class="time-machine-window">
      <div class="time-machine-titlebar">
        <span>${t('modal.timeMachineTitle', '⏳ ТЕЛЕПОРТАЦИЯ ЗАЯВКИ В 2007 ГОД [PORTAL ACTIVE]')}</span>
        <button type="button" onclick="closeTimeMachineModal()" style="font-size: 10px; font-weight: bold; cursor: pointer; padding: 0 5px; background: #C0C0C0; border: 1px outset #FFF;">✕</button>
      </div>
      <div class="time-machine-body">
        <div class="time-portal-box">
          <div style="font-size: 16px; font-weight: bold; color: #FFFF00; margin-bottom: 4px; text-shadow: 0 0 5px #FFFF00;">
            ${t('modal.successTitle', '🚀 ЗАЯВКА УСПЕШНО ОТПРАВЛЕНА В 2007 ГОД!')}
          </div>
          <div class="time-portal-cat-banner">
            ${t('modal.catBanner', '🐱 ฅ^•ﻌ•^ฅ Кот Барсик доставил заявку через Dial-Up модем 56k!')}
          </div>
          <p style="margin: 8px 0; color: #00FF00; font-size: 11px;">
            «Спасибо, <strong>${escapeHtml(clientName)}</strong>! Ваша заявка ${estimateText ? `на сумму <strong style="color: #FFFF00;">${escapeHtml(estimateText)}</strong>` : ''} прошла сквозь временную петлю и успешно вручена Мастеру Никитке прямо в 2007 году!»
          </p>
          <div style="border-top: 1px dashed #00FF00; margin: 8px 0; padding-top: 6px; font-size: 10px; color: #FFFFFF;">
            ⏳ Как только ученые изобретут машину времени (или Никитка допьет баночку Dr Pepper), мастер сразу же приедет к вам на номер <strong style="color: #00FFFF;">${escapeHtml(phone)}</strong> с термопастой КПТ-8 и диском Windows XP SP3!
          </div>
          <div style="font-size: 9px; color: #7FFFD4; margin-top: 4px;">
            ⚡ Скорость соединения: 56.0 Кбит/с | Статус портала: 🟢 100% СТАБИЛЕН
          </div>
        </div>
        <div style="text-align: center; margin-top: 8px;">
          <div style="font-size: 10px; color: #333; margin-bottom: 8px; font-weight: bold;">
            📱 Пока машина времени в разработке — пишите Никитке прямо в Telegram: <a href="https://t.me/Ai_nikitka93" target="_blank" style="color: #0088CC; text-decoration: underline;">👉 @Ai_nikitka93</a>
          </div>
          <div style="display: flex; gap: 6px; justify-content: center; flex-wrap: wrap;">
            <button type="button" class="retro-button" onclick="triggerRunningCat();" style="font-size: 10px;">
              ${t('modal.btnRunCatAgain', '🐱 ЗАПУСТИТЬ КОТА ЕЩЕ РАЗ!')}
            </button>
            <button type="button" class="retro-button" onclick="closeTimeMachineModal()" style="padding: 6px 20px; font-weight: bold; background: #FFFDF0; border: 2px outset #FFF;">
              ${t('modal.btnConfirm', '👍 ПОНЯТНО, ЖДУ МАСТЕРА ИЗ 2007 ГОДА!')}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
}

function closeTimeMachineModal() {
  const overlay = document.getElementById('time-machine-modal-overlay');
  if (overlay) overlay.remove();
}

function initForms() {
  const repairForm = document.getElementById('repair-form');
  if (repairForm) {
    repairForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = repairForm.querySelector('[name="client_name"]');
      const phoneInput = repairForm.querySelector('[name="client_phone"]');
      const banner = document.getElementById('repair-form-banner');
      const submitBtn = repairForm.querySelector('button[type="submit"]');

      const name = sanitizeInput(nameInput.value, 40);
      const phone = sanitizeInput(phoneInput.value, 20);

      if (!name || !phone) {
        showBanner(banner, 'error', 'Ошибка! Пожалуйста, укажите ваше Имя и Телефон.');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'ОТПРАВКА...';
      }

      // Trigger fun retro running cat animation!
      triggerRunningCat();

      setTimeout(() => {
        // Show Time Machine Modal Popup!
        showTimeMachineModal(name, phone);

        showBanner(banner, 'success', `🚀 Спасибо, ${escapeHtml(name)}! Заявка отправлена в 2007 год! Мастер перезвонит на номер ${escapeHtml(phone)}.`);
        repairForm.reset();
        localStorage.removeItem('cyber_repair_draft');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'ОТПРАВИТЬ ЗАЯВКУ';
        }
      }, 600);
    });
  }

  const guestbookForm = document.getElementById('guestbook-form');
  if (guestbookForm) {
    guestbookForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const authorInput = guestbookForm.querySelector('[name="author"]');
      const messageInput = guestbookForm.querySelector('[name="message"]');
      const captchaInput = guestbookForm.querySelector('[name="captcha"]');
      const banner = document.getElementById('guestbook-banner');
      const postsContainer = document.getElementById('guestbook-posts');

      const author = sanitizeInput(authorInput ? authorInput.value : '', 30);
      const message = sanitizeInput(messageInput ? messageInput.value : '', 500);
      const captcha = (captchaInput ? captchaInput.value : '').trim();

      if (!author || !message) {
        showBanner(banner, 'error', 'Заполните Имя и Текст сообщения!');
        return;
      }

      if (captcha !== '5') {
        showBanner(banner, 'error', 'Ошибка спам-защиты! Неверный ответ на проверочный вопрос (2 + 3 = 5).');
        return;
      }

      if (postsContainer) {
        const now = new Date();
        const dateStr = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()}`;
        const newPost = document.createElement('div');
        newPost.className = 'guestbook-post';
        newPost.innerHTML = `
          <div class="post-header">
            <span class="post-author">${escapeHtml(author)}</span>
            <span>${dateStr}</span>
          </div>
          <div class="post-body">${escapeHtml(message)}</div>
          <div class="admin-reply">
            <div class="admin-reply-title">Ответ Мастера Никитки:</div>
            <div>Спасибо за отзыв! Рад помочь вам с компьютером!</div>
          </div>
        `;
        postsContainer.prepend(newPost);
      }

      showBanner(banner, 'success', 'Ваше сообщение успешно проверено и добавлено в Гостевую книгу!');
      guestbookForm.reset();
      localStorage.removeItem('cyber_guestbook_draft');
    });
  }
}

/* --------------------------------------------------------------------------
   7. АВТОСОХРАНЕНИЕ И ВОССТАНОВЛЕНИЕ ЧЕРНОВИКОВ ФОРМ
   -------------------------------------------------------------------------- */
function initFormAutoSave() {
  const repairForm = document.getElementById('repair-form');
  const guestbookForm = document.getElementById('guestbook-form');

  if (repairForm) {
    const nameInput = repairForm.querySelector('[name="client_name"]');
    const phoneInput = repairForm.querySelector('[name="client_phone"]');
    const draft = JSON.parse(localStorage.getItem('cyber_repair_draft') || '{}');

    if (draft.name && nameInput) nameInput.value = draft.name;
    if (draft.phone && phoneInput) phoneInput.value = draft.phone;

    repairForm.addEventListener('input', () => {
      localStorage.setItem('cyber_repair_draft', JSON.stringify({
        name: nameInput ? nameInput.value : '',
        phone: phoneInput ? phoneInput.value : ''
      }));
    });
  }

  if (guestbookForm) {
    const authorInput = guestbookForm.querySelector('[name="author"]');
    const messageInput = guestbookForm.querySelector('[name="message"]');
    const draft = JSON.parse(localStorage.getItem('cyber_guestbook_draft') || '{}');

    if (draft.author && authorInput) authorInput.value = draft.author;
    if (draft.message && messageInput) messageInput.value = draft.message;

    guestbookForm.addEventListener('input', () => {
      localStorage.setItem('cyber_guestbook_draft', JSON.stringify({
        author: authorInput ? authorInput.value : '',
        message: messageInput ? messageInput.value : ''
      }));
    });
  }
}

/* --------------------------------------------------------------------------
   8. ИНТЕРАКТИВНЫЙ КАЛЬКУЛЯТОР СБОРКИ ПК
   -------------------------------------------------------------------------- */
function initCalculator() {
  const calcForm = document.getElementById('calc-form');
  const resultEl = document.getElementById('calc-result');
  if (!calcForm || !resultEl) return;

  function recalculate() {
    const purpose = parseInt(calcForm.querySelector('[name="purpose"]').value || '0', 10);
    const cpu = parseInt(calcForm.querySelector('[name="cpu"]').value || '0', 10);
    const gpu = parseInt(calcForm.querySelector('[name="gpu"]').value || '0', 10);

    const total = Math.max(0, purpose + cpu + gpu);
    resultEl.textContent = `${total.toLocaleString('ru-RU')} руб.`;
  }

  calcForm.addEventListener('change', recalculate);
  recalculate();
}

/* --------------------------------------------------------------------------
   9. ЗАГРУЗЧИК БЭКАПА ДАННЫХ И ВОССТАНОВЛЕНИЕ (DATA RECOVERY)
   -------------------------------------------------------------------------- */
function initBackupLoader() {
  window.CyberNikitkaData = {
    loadBackup: function () {
      fetch('data_backup.json')
        .then(res => res.json())
        .then(data => {
          alert(`Бэкап загружен! Дисков в бэкапе: ${data.disks ? data.disks.length : 0}, записей в отзывах: ${data.guestbook ? data.guestbook.length : 0}`);
        })
        .catch(err => {
          console.error('Ошибка загрузки data_backup.json:', err);
        });
    }
  };
}

/* --------------------------------------------------------------------------
   10. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ И XSS ЭКРАНИРОВАНИЕ
   -------------------------------------------------------------------------- */
function showBanner(el, type, text) {
  if (!el) {
    alert(text);
    return;
  }
  el.className = `retro-banner-${type}`;
  el.textContent = text;
  el.style.display = 'block';
}

function sanitizeInput(str, maxLength) {
  if (typeof str !== 'string') return '';
  let trimmed = str.trim();
  if (maxLength && trimmed.length > maxLength) {
    trimmed = trimmed.substring(0, maxLength);
  }
  return trimmed;
}

function decodeWeatherCode(code) {
  if (code === 0) return '☀️ Ясно';
  if (code >= 1 && code <= 3) return '⛅ Малооблачно';
  if (code === 45 || code === 48) return '🌫 Туман';
  if (code >= 51 && code <= 65) return '🌧️ Дождь';
  if (code >= 71 && code <= 77) return '❄️ Снег';
  if (code >= 80 && code <= 82) return '🌧️ Ливень';
  if (code >= 95) return '⛈️ Гроза';
  return '☁️ Облачно';
}

function initRealCurrencyRates() {
  const usdEl = document.getElementById('real-usd');
  const eurEl = document.getElementById('real-eur');
  const usdTab = document.getElementById('real-usd-table');
  const eurTab = document.getElementById('real-eur-table');
  const usdInf = document.getElementById('inf-usd-now');
  const eurInf = document.getElementById('inf-eur-now');

  fetch('https://www.cbr-xml-daily.ru/daily_json.js')
    .then(res => res.json())
    .then(data => {
      if (data && data.Valute) {
        const usd = data.Valute.USD.Value.toFixed(2);
        const eur = data.Valute.EUR.Value.toFixed(2);
        if (usdEl) usdEl.textContent = usd;
        if (eurEl) eurEl.textContent = eur;
        if (usdTab) usdTab.textContent = usd;
        if (eurTab) eurTab.textContent = eur;
        if (usdInf) usdInf.textContent = usd;
        if (eurInf) eurInf.textContent = eur;
      }
    })
    .catch(() => {
      if (usdEl) usdEl.textContent = '80.07';
      if (eurEl) eurEl.textContent = '91.96';
      if (usdTab) usdTab.textContent = '80.07';
      if (eurTab) eurTab.textContent = '91.96';
      if (usdInf) usdInf.textContent = '80.07';
      if (eurInf) eurInf.textContent = '91.96';
    });
}

const CITIES = {
  moscow: { name: '📍 Москва', lat: 55.7558, lon: 37.6173 },
  spb: { name: '📍 Санкт-Петербург', lat: 59.9343, lon: 30.3351 },
  minsk: { name: '📍 Минск (Беларусь)', lat: 53.9006, lon: 27.5590 },
  brest: { name: '📍 Брест (Беларусь)', lat: 52.0976, lon: 23.7340 },
  grodno: { name: '📍 Гродно (Беларусь)', lat: 53.6694, lon: 23.8131 },
  gomel: { name: '📍 Гомель (Беларусь)', lat: 52.4345, lon: 30.9754 },
  vitebsk: { name: '📍 Витебск (Беларусь)', lat: 55.1904, lon: 30.2049 },
  mogilev: { name: '📍 Могилев (Беларусь)', lat: 53.8981, lon: 30.3325 },
  omsk: { name: '📍 Омск', lat: 54.9885, lon: 73.3242 },
  novosibirsk: { name: '📍 Новосибирск', lat: 55.0084, lon: 82.9357 },
  ekaterinburg: { name: '📍 Екатеринбург', lat: 56.8389, lon: 60.6057 },
  kazan: { name: '📍 Казань', lat: 55.7887, lon: 49.1221 },
  nnov: { name: '📍 Н. Новгород', lat: 56.3269, lon: 44.0059 },
  chelyabinsk: { name: '📍 Челябинск', lat: 55.1644, lon: 61.4368 },
  samara: { name: '📍 Самара', lat: 53.2001, lon: 50.1500 },
  ufa: { name: '📍 Уфа', lat: 54.7388, lon: 55.9721 },
  rostov: { name: '📍 Ростов-на-Дону', lat: 47.2357, lon: 39.7015 },
  krasnodar: { name: '📍 Краснодар', lat: 45.0355, lon: 38.9753 },
  voronezh: { name: '📍 Воронеж', lat: 51.6720, lon: 39.1843 },
  perm: { name: '📍 Пермь', lat: 58.0105, lon: 56.2502 },
  volgograd: { name: '📍 Волгоград', lat: 48.7071, lon: 44.5169 },
  krasnoyarsk: { name: '📍 Красноярск', lat: 56.0184, lon: 92.8672 },
  saratov: { name: '📍 Саратов', lat: 51.5406, lon: 46.0086 },
  tumen: { name: '📍 Тюмень', lat: 57.1613, lon: 65.5250 },
  tolyatti: { name: '📍 Тольятти', lat: 53.5303, lon: 49.3461 },
  barnaul: { name: '📍 Барнаул', lat: 53.3606, lon: 83.7636 },
  vladivostok: { name: '📍 Владивосток', lat: 43.1155, lon: 131.8855 },
  almaty: { name: '📍 Алматы (Казахстан)', lat: 43.2220, lon: 76.8512 },
  astana: { name: '📍 Астана (Казахстан)', lat: 51.1694, lon: 71.4491 },
  yerevan: { name: '📍 Ереван (Армения)', lat: 40.1792, lon: 44.4991 },
  tbilisi: { name: '📍 Тбилиси (Грузия)', lat: 41.7151, lon: 44.8271 },
  tashkent: { name: '📍 Ташкент (Узбекистан)', lat: 41.2995, lon: 69.2401 }
};

function fetchCityWeather(cityKey) {
  const city = CITIES[cityKey] || CITIES.moscow;
  const infWThen = document.getElementById('inf-w-then');
  const infWNow = document.getElementById('inf-w-now');
  const weatherLabel = document.getElementById('inf-weather-label');
  const wThenEl = document.getElementById('weather-then-val');
  const wNowEl = document.getElementById('weather-now-val');

  if (weatherLabel) {
    const shortName = city.name.replace('📍 ', '').split(' (')[0];
    weatherLabel.textContent = `🌡️ Погода (${shortName})`;
  }

  if (infWThen) infWThen.textContent = '⏳ ...';
  if (infWNow) infWNow.textContent = '🚀 ...';

  // 1. Historical Weather 04.08.2007 from Open-Meteo
  const archiveUrl = `https://archive-api.open-meteo.com/v1/archive?latitude=${city.lat}&longitude=${city.lon}&start_date=2007-08-04&end_date=2007-08-04&daily=temperature_2m_max,weathercode`;
  fetch(archiveUrl)
    .then(r => r.json())
    .then(d => {
      if (d && d.daily && d.daily.temperature_2m_max && d.daily.temperature_2m_max.length > 0) {
        const tempMax = Math.round(d.daily.temperature_2m_max[0] * 10) / 10;
        const valStr = `${tempMax > 0 ? '+' : ''}${tempMax}°C`;
        if (infWThen) infWThen.textContent = valStr;
        if (wThenEl) wThenEl.textContent = valStr;
      }
    })
    .catch(() => {
      if (infWThen) infWThen.textContent = '+20.6°C';
    });

  // 2. Current Live Weather from Open-Meteo
  const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true`;
  fetch(forecastUrl)
    .then(r => r.json())
    .then(d => {
      if (d && d.current_weather) {
        const temp = Math.round(d.current_weather.temperature * 10) / 10;
        const valStr = `${temp > 0 ? '+' : ''}${temp}°C`;
        if (infWNow) infWNow.textContent = valStr;
        if (wNowEl) wNowEl.textContent = valStr;
      }
    })
    .catch(() => {
      if (infWNow) infWNow.textContent = '+25.2°C';
    });
}

function geocodeAndSetCity(cityName) {
  const customBox = document.getElementById('inf-custom-box');
  const customMsg = document.getElementById('inf-custom-msg');
  if (customMsg) customMsg.textContent = 'Поиск...';

  fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=ru`)
    .then(r => r.json())
    .then(d => {
      if (d && d.results && d.results.length > 0) {
        const res = d.results[0];
        const name = res.name;
        const lat = res.latitude;
        const lon = res.longitude;

        const customObj = { name: `📍 ${name}`, lat, lon };
        CITIES.custom = customObj;
        localStorage.setItem('cyber_custom_city', JSON.stringify(customObj));
        localStorage.setItem('cyber_selected_city', 'custom');

        const citySelect = document.getElementById('inf-city-select');
        if (citySelect) {
          let opt = citySelect.querySelector('option[value="custom"]');
          if (!opt) {
            opt = document.createElement('option');
            opt.value = 'custom';
            citySelect.insertBefore(opt, citySelect.firstChild);
          }
          opt.textContent = `📍 ${name}`;
          citySelect.value = 'custom';
        }

        if (customBox) customBox.style.display = 'none';
        if (customMsg) customMsg.textContent = '';

        fetchCityWeather('custom');
      } else {
        if (customMsg) customMsg.textContent = '❌ Город не найден';
      }
    })
    .catch(() => {
      if (customMsg) customMsg.textContent = '❌ Ошибка поиска';
    });
}

function initThenVsNowWidget() {
  const citySelect = document.getElementById('inf-city-select');
  const customBox = document.getElementById('inf-custom-box');
  const customInput = document.getElementById('inf-custom-input');
  const customBtn = document.getElementById('inf-custom-btn');

  // Restore saved custom city if exists
  const savedCustom = localStorage.getItem('cyber_custom_city');
  if (savedCustom) {
    try {
      const parsed = JSON.parse(savedCustom);
      if (parsed && parsed.lat && parsed.lon) {
        CITIES.custom = parsed;
        if (citySelect) {
          let opt = citySelect.querySelector('option[value="custom"]');
          if (!opt) {
            opt = document.createElement('option');
            opt.value = 'custom';
            citySelect.insertBefore(opt, citySelect.firstChild);
          }
          opt.textContent = parsed.name;
        }
      }
    } catch (e) {}
  }

  let savedCity = localStorage.getItem('cyber_selected_city') || 'moscow';
  if (savedCity === 'custom' && !CITIES.custom) savedCity = 'moscow';

  if (citySelect) {
    citySelect.value = savedCity;
    citySelect.addEventListener('change', (e) => {
      const selected = e.target.value;
      if (selected === 'custom_search') {
        if (customBox) customBox.style.display = 'block';
        if (customInput) customInput.focus();
      } else {
        if (customBox) customBox.style.display = 'none';
        localStorage.setItem('cyber_selected_city', selected);
        fetchCityWeather(selected);
      }
    });
  }

  if (customBtn && customInput) {
    const triggerSearch = () => {
      const val = customInput.value.trim();
      if (val) geocodeAndSetCity(val);
    };
    customBtn.addEventListener('click', triggerSearch);
    customInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') triggerSearch();
    });
  }

  fetchCityWeather(savedCity);
}

function initPjaxNavigation() {
  document.body.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('//') || href.startsWith('#') || href.startsWith('javascript:') || link.getAttribute('target') === '_blank') {
      return;
    }

    if (href.endsWith('.png') || href.endsWith('.jpg') || href.endsWith('.zip') || href.endsWith('.pdf')) {
      return;
    }

    // Exclude dynamic script pages so their inline API scripts execute 100% reliably
    if (href.includes('forum.html') || href.includes('cabinet.html') || href.includes('admin.html') || href.includes('login.html') || href.includes('register.html') || href.includes('services.html')) {
      return; // Normal browser load (radio auto-resumes instantly via sessionStorage)
    }

    e.preventDefault();

    fetch(href)
      .then(res => res.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const newMain = doc.querySelector('main.content-center') || doc.querySelector('main');
        const currentMain = document.querySelector('main.content-center') || document.querySelector('main');

        if (newMain && currentMain) {
          currentMain.innerHTML = newMain.innerHTML;
        }

        if (doc.title) document.title = doc.title;

        window.history.pushState({}, '', href);

        const activeFile = href.split('/').pop().split('?')[0] || 'index.html';
        document.querySelectorAll('.nav-button').forEach(navBtn => {
          const btnHref = navBtn.getAttribute('href');
          if (btnHref === activeFile || (activeFile === '' && btnHref === 'index.html')) {
            navBtn.classList.add('active');
          } else {
            navBtn.classList.remove('active');
          }
        });

        initClock();
        initCatalogFilters();
        initForms();
        initCalculator();
        initFormAutoSave();
        initThenVsNowWidget();

        window.scrollTo({ top: 0, behavior: 'smooth' });
      })
      .catch(() => {
        window.location.href = href;
      });
  });

  window.addEventListener('popstate', () => {
    window.location.reload();
  });
}



