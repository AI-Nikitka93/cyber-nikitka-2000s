/* ==========================================================================
   КЛИЕНТСКИЙ АДАПТЕР API С АВТОРИЗАЦИЕЙ, ЛИЧНЫМ КАБИНЕТОМ И QIP СТАТУСАМИ
   Проект «КиберНикитка» v3.1
   ========================================================================== */

const ApiClient = {
  baseUrl: '/api',

  getToken() {
    return localStorage.getItem('cyber_token') || '';
  },

  setToken(token) {
    if (token) {
      localStorage.setItem('cyber_token', token);
    } else {
      localStorage.removeItem('cyber_token');
    }
  },

  getCurrentUser() {
    const cached = localStorage.getItem('cyber_user');
    return cached ? JSON.parse(cached) : null;
  },

  async request(endpoint, options = {}) {
    const token = this.getToken();
    const defaultHeaders = {
      'Content-Type': 'application/json'
    };
    if (token) {
      defaultHeaders['X-Cyber-Token'] = token;
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: { ...defaultHeaders, ...options.headers }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP Error ${response.status}`);
      }

      const resData = await response.json();
      if (!resData.success) {
        throw new Error(resData.error?.message || 'Ошибка API');
      }

      return resData;
    } catch (err) {
      console.warn(`[CyberNikitka API Fallback] Сервер недоступен (${endpoint}). Переход на локальный офлайн-режим.`, err.message);
      return this.fallback(endpoint, options);
    }
  },

  // --- МЕТОДЫ АВТОРИЗАЦИИ И ПРОФИЛЯ ---
  async register(payload) {
    const res = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (res.token) {
      this.setToken(res.token);
      if (res.user) localStorage.setItem('cyber_user', JSON.stringify(res.user));
      this.updateHeaderAuthUI();
    }
    return res;
  },

  async login(payload) {
    const res = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (res.token) {
      this.setToken(res.token);
      if (res.user) localStorage.setItem('cyber_user', JSON.stringify(res.user));
      this.updateHeaderAuthUI();
    }
    return res;
  },

  async getMe() {
    const token = this.getToken();
    if (!token) return null;
    try {
      const res = await this.request('/auth/me');
      if (res.user) {
        localStorage.setItem('cyber_user', JSON.stringify(res.user));
        return res.user;
      }
    } catch (e) {
      const cached = localStorage.getItem('cyber_user');
      if (cached) return JSON.parse(cached);
    }
    return null;
  },

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (e) {}
    this.setToken(null);
    localStorage.removeItem('cyber_user');
    this.updateHeaderAuthUI();
    window.location.href = 'index.html';
  },

  async getCabinet() {
    return this.request('/user/cabinet');
  },

  async updateProfile(payload) {
    const res = await this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
    if (res.user) {
      localStorage.setItem('cyber_user', JSON.stringify(res.user));
      this.updateHeaderAuthUI();
    }
    return res;
  },

  async postWallAutograph(payload) {
    return this.request('/user/wall', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async addMyDisk(payload) {
    return this.request('/user/disks', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  updateHeaderAuthUI() {
    const headerRight = document.querySelector('.header-right');
    if (!headerRight) return;

    const user = this.getCurrentUser();
    let authBlock = document.getElementById('header-auth-block');
    if (!authBlock) {
      authBlock = document.createElement('div');
      authBlock.id = 'header-auth-block';
      authBlock.style.marginTop = '4px';
      authBlock.style.fontSize = '10px';
      headerRight.appendChild(authBlock);
    }

    if (user && user.username) {
      authBlock.innerHTML = `
        <span style="color: #00FF00; font-weight: bold;">Привет, ${user.display_name || user.username}!</span> | 
        <a href="cabinet.html" style="color: #FFFF00; font-weight: bold; text-decoration: underline;">[ Личный кабинет ]</a> | 
        <a href="#" onclick="ApiClient.logout(); return false;" style="color: #FFAAAA; text-decoration: underline;">[ Выход ]</a>
      `;
    } else {
      authBlock.innerHTML = `
        <a href="login.html" style="color: #FFFFFF; font-weight: bold; text-decoration: underline;">[ Вход ]</a> | 
        <a href="register.html" style="color: #FFFF00; font-weight: bold; text-decoration: underline;">[ Регистрация ]</a>
      `;
    }
  },

  // --- КОНТЕНТНЫЕ МЕТОДЫ ---
  async getDisks(category = 'all', search = '') {
    const query = new URLSearchParams({ category, q: search }).toString();
    return this.request(`/disks?${query}`);
  },

  async getServices() {
    return this.request('/services');
  },

  async getGuestbook() {
    return this.request('/guestbook');
  },

  async addGuestbookEntry(payload) {
    return this.request('/guestbook', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async sendRepairRequest(payload) {
    return this.request('/repair-requests', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async getForum() {
    return this.request('/forum/categories');
  },

  async sendForumTopic(payload) {
    return this.request('/forum/topics', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async sendForumPost(payload) {
    return this.request('/forum/posts', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async checkPcBuild(payload) {
    return this.request('/pc-builder/check', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  // ------------------------------------------------------------------------
  // ЛОКАЛЬНЫЙ РЕЗЕРВНЫЙ ФОЛЛБЭК
  // ------------------------------------------------------------------------
  async fallback(endpoint, options) {
    if (endpoint.startsWith('/user/profile')) {
      const body = JSON.parse(options.body || '{}');
      const user = this.getCurrentUser() || {};
      const updated = { ...user, ...body };
      localStorage.setItem('cyber_user', JSON.stringify(updated));
      return { success: true, user: updated, fallback: true };
    }

    if (endpoint.startsWith('/user/wall')) {
      const body = JSON.parse(options.body || '{}');
      return {
        success: true,
        data: {
          id: 'w-local-' + Date.now(),
          author: body.author || 'Гость',
          message: body.message,
          created_at: new Date().toISOString()
        },
        fallback: true
      };
    }

    if (endpoint.startsWith('/auth/login')) {
      const body = JSON.parse(options.body || '{}');
      const userObj = {
        id: 'usr-local-01',
        username: body.username || 'Пользователь',
        role: body.username === 'nikitka_master' ? 'admin' : 'user',
        display_name: body.username || 'Пользователь',
        icq_uin: '777-200-07',
        city: 'Москва',
        avatar_url: 'img/photo-nikitka.png',
        qip_status: '🟢 В сети (Online)',
        text_quote: 'Диалап рвется, но мы держимся!',
        pc_specs: 'Core 2 Duo E6600 | 2GB DDR2 | GeForce 8800GT',
        views_count: 184
      };
      this.setToken('cyb_local_token');
      localStorage.setItem('cyber_user', JSON.stringify(userObj));
      return { success: true, token: 'cyb_local_token', user: userObj, fallback: true };
    }

    if (endpoint.startsWith('/user/cabinet')) {
      const user = this.getCurrentUser();
      if (!user || !this.getToken()) {
        throw new Error('Для входа в Личный Кабинет необходимо сначала войти!');
      }
      return {
        success: true,
        data: {
          profile: user,
          rating: 85,
          wall_comments: [
            { id: 'w-1', author: 'nikitka_master', message: 'Привет! Оставил автограф на твоей стенке 2007 года!', created_at: '2026-08-04T12:00:00Z' }
          ],
          disks: [{ id: 'd-1', title: 'S.T.A.L.K.E.R.: Тень Чернобыля', category: 'games', type: 'DVD-5', year: 2007 }],
          repair_requests: [{ id: 'req-1', client_name: user.username, client_phone: '8 (900) 200-07-07', status: 'В обработке', created_at: '2026-08-04' }],
          forum_topics: [{ id: 'top-01', title: 'Настройка Windows XP', created_at: '2026-08-01' }],
          forum_posts: [{ id: 'post-01', content: 'Спасибо за помощь!', created_at: '2026-08-02' }]
        },
        fallback: true
      };
    }

    if (endpoint.startsWith('/disks')) {
      const backup = await this.loadBackupFile();
      return { success: true, data: backup.disks || [], fallback: true };
    }

    if (endpoint.startsWith('/guestbook')) {
      const backup = await this.loadBackupFile();
      return { success: true, data: backup.guestbook || [], fallback: true };
    }

    return { success: true, data: [], fallback: true };
  },

  async loadBackupFile() {
    if (window._cachedBackupData) return window._cachedBackupData;
    try {
      const res = await fetch('data_backup.json');
      const data = await res.json();
      window._cachedBackupData = data;
      return data;
    } catch (e) {
      return { disks: [], guestbook: [] };
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  ApiClient.updateHeaderAuthUI();
});

window.ApiClient = ApiClient;
