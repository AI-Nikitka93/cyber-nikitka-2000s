/* ==========================================================================
   МУЛЬТИСЕНСОРНЫЙ ПАКЕТ «КИБЕРНИКИТКА 2000s» v2.6 (100% HTTPS LIVE RADIO)
   Модули: Winamp 2.x Web Player (Прямой HTTPS Эфир), Matrix Screen Saver & Web Audio Sound FX
   ========================================================================== */

(function () {
  'use strict';

  // ------------------------------------------------------------------------
  // 1. WEB AUDIO SOUND FX ENGINE (Синтезатор кликов и ICQ Uh-Oh!)
  // ------------------------------------------------------------------------
  const SoundFX = {
    ctx: null,

    init() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
    },

    playClick() {
      try {
        this.init();
        if (!this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.05);

        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
      } catch (e) {}
    },

    playIcqUhOh() {
      try {
        this.init();
        if (!this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(659, now + 0.12);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.setValueAtTime(0.2, now + 0.12);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.3);
      } catch (e) {}
    },

    playHddSeek() {
      try {
        this.init();
        if (!this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const now = this.ctx.currentTime;
        for (let i = 0; i < 4; i++) {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          
          const startTime = now + (i * 0.03) + (Math.random() * 0.01);
          osc.frequency.setValueAtTime(120 + Math.random() * 250, startTime);
          
          gain.gain.setValueAtTime(0.08, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.02);
          
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          
          osc.start(startTime);
          osc.stop(startTime + 0.02);
        }
      } catch (e) {}
    },

    play3DMarkChime() {
      try {
        this.init();
        if (!this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50];
        
        notes.forEach((freq, index) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          
          const startTime = now + (index * 0.08);
          osc.frequency.setValueAtTime(freq, startTime);
          
          gain.gain.setValueAtTime(0.15, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
          
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          
          osc.start(startTime);
          osc.stop(startTime + 0.4);
        });
      } catch (e) {}
    }
  };

  // ------------------------------------------------------------------------
  // 2. WINAMP 2.X WEB PLAYER WITH 100% HTTPS LIVE RADIO STREAMS
  // ------------------------------------------------------------------------
  const WinampPlayer = {
    isPlaying: false,
    audioCtx: null,
    analyser: null,
    sourceNode: null,
    audioElem: null,
    currentStation: 'nashe',

    // 100% Валидные HTTPS Онлайн-Радиостанции (без Mixed Content блокировок)
    stations: {
      nashe: {
        name: '🎸 Наше Радио 101.7 FM (Рок 2000-х)',
        url: 'https://nashe1.hostingradio.ru/nashe-128.mp3'
      },
      retrofm: {
        name: '🕺 Ретро FM (Дискотека 2000-х)',
        url: 'https://pub0202.101.ru:8443/stream/pro/aac/64/88'
      },
      retrohit: {
        name: '📻 Ретро Хит 101.ru (Хиты 2000-х)',
        url: 'https://pub0202.101.ru:8443/stream/pro/aac/64/1'
      },
      synthwave: {
        name: '⚡ Retro Synth 2000s (Live)',
        url: 'https://stream.zeno.fm/f3wvbbqmdg8uv'
      }
    },

    init() {
      this.injectWidget();
      this.setupAudioElement();
    },

    setupAudioElement() {
      this.audioElem = document.createElement('audio');
      this.audioElem.crossOrigin = 'anonymous';
      this.audioElem.style.display = 'none';
      document.body.appendChild(this.audioElem);

      this.audioElem.onerror = (e) => {
        console.warn('[Winamp Radio] Ошибка подключения к эфиру радио:', e);
        const marquee = document.getElementById('winamp-marquee');
        if (marquee) marquee.textContent = '[ОШИБКА ПОДКЛЮЧЕНИЯ К ЭФИРУ]';
      };
    },

    injectWidget() {
      const sidebarRight = document.querySelector('.sidebar-right');
      if (!sidebarRight) return;

      const box = document.createElement('div');
      box.className = 'winamp-box';
      box.innerHTML = `
        <div class="winamp-header">
          <span>WINAMP 2.91 - LIVE RADIO</span>
          <span style="cursor:pointer;" onclick="this.parentElement.parentElement.style.display='none'">✕</span>
        </div>
        <div class="winamp-display">
          <div class="winamp-title-marquee" id="winamp-marquee">[WINAMP] 1. Наше Радио 101.7 FM</div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
            <canvas id="winamp-analyzer" width="100" height="24" class="winamp-analyzer"></canvas>
            <span id="winamp-timer" style="font-family: monospace; font-size: 11px; color: #00FF00; background: #000; padding: 2px 4px; border: 1px solid #00FF00;">00:00</span>
          </div>
        </div>
        <div style="padding: 4px; background: #222;">
          <select id="winamp-station-select" class="retro-select" style="width: 100%; font-size: 10px; padding: 2px; background: #000; color: #00FF00; border: 1px solid #00FF00;">
            <option value="nashe">🎸 Наше Радио 101.7 FM</option>
            <option value="retrofm">🕺 Ретро FM (Дискотека 2000)</option>
            <option value="retrohit">📻 Ретро Хит 101.ru (HTTPS)</option>
            <option value="synthwave">⚡ Retro Synth 2000s (Live)</option>
          </select>
        </div>
        <div class="winamp-controls">
          <button type="button" class="winamp-btn" id="winamp-play" title="Play">► PLAY</button>
          <button type="button" class="winamp-btn" id="winamp-pause" title="Pause">❚❚ PAUSE</button>
          <button type="button" class="winamp-btn" id="winamp-stop" title="Stop">◼ STOP</button>
        </div>
      `;

      sidebarRight.insertBefore(box, sidebarRight.firstChild);

      document.getElementById('winamp-station-select').addEventListener('change', (e) => {
        this.changeStation(e.target.value);
      });
      document.getElementById('winamp-play').addEventListener('click', () => this.play());
      document.getElementById('winamp-pause').addEventListener('click', () => this.pause());
      document.getElementById('winamp-stop').addEventListener('click', () => this.stop());

      this.drawAnalyzer();
    },

    initWebAudio() {
      if (!this.audioCtx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioCtx();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      if (!this.analyser) {
        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.fftSize = 64;
      }
      if (this.audioElem && !this.sourceNode) {
        try {
          this.sourceNode = this.audioCtx.createMediaElementSource(this.audioElem);
          this.sourceNode.connect(this.analyser);
          this.analyser.connect(this.audioCtx.destination);
        } catch (e) {}
      }
    },

    saveState() {
      try {
        sessionStorage.setItem('winamp_playing', this.isPlaying ? 'true' : 'false');
        sessionStorage.setItem('winamp_station', this.currentStation);
      } catch (e) {}
    },

    restoreState() {
      try {
        const isPlaying = sessionStorage.getItem('winamp_playing') === 'true';
        const savedStation = sessionStorage.getItem('winamp_station');

        if (savedStation && this.stations[savedStation]) {
          this.currentStation = savedStation;
          const selectEl = document.getElementById('winamp-station-select');
          if (selectEl) selectEl.value = savedStation;
        }

        if (isPlaying) {
          // Auto-resume radio playback
          setTimeout(() => {
            this.play();
          }, 300);
        }
      } catch (e) {}
    },

    changeStation(stationKey) {
      this.currentStation = stationKey;
      const st = this.stations[stationKey];

      const marquee = document.getElementById('winamp-marquee');
      if (marquee) marquee.textContent = `[NOW PLAYING] ${st.name}`;

      this.saveState();

      if (this.isPlaying) {
        this.stop();
        this.play();
      }
    },

    play() {
      if (this.isPlaying) return;
      this.isPlaying = true;
      this.saveState();
      this.initWebAudio();

      const st = this.stations[this.currentStation];
      const marquee = document.getElementById('winamp-marquee');
      if (marquee) marquee.textContent = `[PLAYING] ${st.name}`;

      if (st.url) {
        this.audioElem.src = st.url;
        this.audioElem.play().catch(err => {
          console.warn('[Winamp Radio Error]', err.message);
          if (marquee) marquee.textContent = '[ОШИБКА ПОДКЛЮЧЕНИЯ]';
        });
      }

      this.startTimer();
      this.drawAnalyzer();
    },

    pause() {
      this.isPlaying = false;
      this.saveState();
      if (this.audioElem) this.audioElem.pause();
    },

    stop() {
      this.pause();
      this.saveState();
      if (this.audioElem) {
        this.audioElem.pause();
        this.audioElem.currentTime = 0;
      }
      const timerEl = document.getElementById('winamp-timer');
      if (timerEl) timerEl.textContent = '00:00';
    },

    startTimer() {
      let seconds = 0;
      const timerInterval = setInterval(() => {
        if (!this.isPlaying) {
          clearInterval(timerInterval);
          return;
        }
        seconds++;
        const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
        const secs = String(seconds % 60).padStart(2, '0');
        const timerEl = document.getElementById('winamp-timer');
        if (timerEl) timerEl.textContent = `${mins}:${secs}`;
      }, 1000);
    },

    drawAnalyzer() {
      const canvas = document.getElementById('winamp-analyzer');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const bars = 12;
      const barWidth = 6;
      const gap = 2;

      let freqData = new Uint8Array(16);
      if (this.isPlaying && this.analyser) {
        this.analyser.getByteFrequencyData(freqData);
      }

      for (let i = 0; i < bars; i++) {
        let height = 2;
        if (this.isPlaying) {
          const val = freqData[i] || Math.floor(Math.random() * 140);
          height = Math.max(2, Math.floor((val / 255) * canvas.height));
        }

        const x = i * (barWidth + gap);
        const y = canvas.height - height;

        const grad = ctx.createLinearGradient(0, canvas.height, 0, 0);
        grad.addColorStop(0, '#00FF00');
        grad.addColorStop(0.7, '#FFFF00');
        grad.addColorStop(1, '#FF0000');

        ctx.fillStyle = grad;
        ctx.fillRect(x, y, barWidth, height);
      }

      if (this.isPlaying) {
        requestAnimationFrame(() => this.drawAnalyzer());
      }
    }
  };

  // ------------------------------------------------------------------------
  // 3. MATRIX DIGITAL RAIN SCREEN SAVER (Авто-скринсейвер 30 сек бездействия)
  // ------------------------------------------------------------------------
  const MatrixScreenSaver = {
    canvas: null,
    ctx: null,
    interval: null,
    idleTimer: null,
    isActive: false,

    init() {
      this.createCanvas();
      this.resetIdleTimer();

      ['mousemove', 'keydown', 'click', 'scroll'].forEach(evt => {
        window.addEventListener(evt, () => {
          if (this.isActive) this.stop();
          this.resetIdleTimer();
        });
      });
    },

    createCanvas() {
      this.canvas = document.createElement('canvas');
      this.canvas.id = 'matrix-screensaver';
      this.canvas.style.position = 'fixed';
      this.canvas.style.top = '0';
      this.canvas.style.left = '0';
      this.canvas.style.width = '100vw';
      this.canvas.style.height = '100vh';
      this.canvas.style.zIndex = '99999';
      this.canvas.style.display = 'none';
      this.canvas.style.background = '#000000';
      document.body.appendChild(this.canvas);
      this.ctx = this.canvas.getContext('2d');
    },

    resetIdleTimer() {
      if (this.idleTimer) clearTimeout(this.idleTimer);
      this.idleTimer = setTimeout(() => this.start(), 30000);
    },

    start() {
      if (this.isActive) return;
      this.isActive = true;
      this.canvas.style.display = 'block';
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;

      const chars = '0123456789ABCDEFｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ';
      const fontSize = 14;
      const columns = Math.floor(this.canvas.width / fontSize);
      const drops = Array(columns).fill(1);

      this.interval = setInterval(() => {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#00FF00';
        this.ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
          const text = chars.charAt(Math.floor(Math.random() * chars.length));
          this.ctx.fillText(text, i * fontSize, drops[i] * fontSize);

          if (drops[i] * fontSize > this.canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      }, 40);
    },

    stop() {
      if (!this.isActive) return;
      this.isActive = false;
      this.canvas.style.display = 'none';
      if (this.interval) clearInterval(this.interval);
    }
  };

  // ------------------------------------------------------------------------
  // 4. ИНИЦИАЛИЗАЦИЯ И НАВЕШИВАНИЕ СОБЫТИЙ
  // ------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    WinampPlayer.init();
    WinampPlayer.restoreState();
    MatrixScreenSaver.init();

    document.body.addEventListener('click', (e) => {
      if (e.target.closest('button, .retro-button, a.nav-button')) {
        SoundFX.playClick();
      }
    });

    document.body.addEventListener('submit', () => {
      SoundFX.playIcqUhOh();
    });
  });

  window.SoundFX = SoundFX;
})();
