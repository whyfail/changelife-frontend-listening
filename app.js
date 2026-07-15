(() => {
  const lessons = window.CHANGELIFE_LESSONS || [];
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const audio = $('#audioPlayer');
  const app = $('#app');
  const lessonList = $('#lessonList');
  const transcriptList = $('#transcriptList');
  const transcriptScroll = $('#transcriptScroll');
  const progressRange = $('#progressRange');
  const volumeRange = $('#volumeRange');
  const playButton = $('#playButton');
  const speedButton = $('#speedButton');
  const favoriteButton = $('#favoriteButton');
  const languageMode = $('#languageMode');
  const playModeControl = $('#playModeControl');
  const autoScroll = $('#autoScroll');
  const searchInput = $('#lessonSearch');
  const speeds = [0.75, 1, 1.25, 1.5];
  const playModes = new Set(['single', 'sequence', 'shuffle']);
  const formatSpeed = (value) => (Number.isInteger(value) ? `${value.toFixed(1)}×` : `${value}×`);
  const lessonIds = new Set(lessons.map((lesson) => lesson.id));
  const restoreSet = (name) => {
    const saved = JSON.parse(localStorage.getItem(`changelife:${name}`) || '[]');
    return new Set(saved.filter((id) => lessonIds.has(id)));
  };

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const lockViewport = () => {
    if (window.scrollX !== 0 || window.scrollY !== 0) window.scrollTo(0, 0);
  };
  window.scrollTo(0, 0);
  window.addEventListener('scroll', lockViewport, { passive: true });

  const savedIndex = Number(localStorage.getItem('changelife:lastLesson'));
  const savedPlayMode = localStorage.getItem('changelife:playMode');
  const state = {
    currentIndex: Number.isInteger(savedIndex) && savedIndex >= 0 && savedIndex < lessons.length ? savedIndex : 0,
    activeLine: -1,
    mode: localStorage.getItem('changelife:mode') || 'bilingual',
    speed: Number(localStorage.getItem('changelife:speed')) || 1,
    playMode: playModes.has(savedPlayMode) ? savedPlayMode : 'sequence',
    favorites: restoreSet('favorites'),
    completed: restoreSet('completed'),
    segments: [],
    toastTimer: 0,
  };

  const icons = () => window.lucide?.createIcons({ attrs: { 'stroke-width': 1.8 } });

  const formatTime = (seconds) => {
    const value = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
    return `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, '0')}`;
  };

  const wordCount = (text) => (text.match(/[A-Za-z0-9]+(?:['-][A-Za-z0-9]+)*/g) || []).length;

  const saveSet = (name, set) => localStorage.setItem(`changelife:${name}`, JSON.stringify([...set]));

  const showToast = (message) => {
    const toast = $('#toast');
    toast.textContent = message;
    toast.classList.add('visible');
    window.clearTimeout(state.toastTimer);
    state.toastTimer = window.setTimeout(() => toast.classList.remove('visible'), 2400);
  };

  const currentLesson = () => lessons[state.currentIndex];

  const progressStyle = (input, value, max) => {
    const percentage = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
    input.style.setProperty('--range-progress', `${percentage}%`);
  };

  const buildSegments = (duration = 120) => {
    const dialogue = currentLesson().dialogue;
    const hasTimings = dialogue.every((turn) => Number.isFinite(turn.start) && Number.isFinite(turn.end));
    if (hasTimings) {
      state.segments = dialogue.map((turn, index) => ({
        start: turn.start,
        end: dialogue[index + 1]?.start ?? duration,
      }));
      updateTranscriptTimes();
      return;
    }
    const weights = dialogue.map((turn) => wordCount(turn.english) + 2.2);
    const total = weights.reduce((sum, weight) => sum + weight, 0);
    let cursor = 0;
    state.segments = weights.map((weight) => {
      const start = (cursor / total) * duration;
      cursor += weight;
      return { start, end: (cursor / total) * duration };
    });
    updateTranscriptTimes();
  };

  const updateTranscriptTimes = () => {
    $$('.transcript-line').forEach((line, index) => {
      const time = line.querySelector('.line-time');
      if (time && state.segments[index]) time.textContent = formatTime(state.segments[index].start);
    });
  };

  const lessonIcon = (lesson) => {
    if (state.completed.has(lesson.id)) return '<i data-lucide="circle-check"></i>';
    if (lessons[state.currentIndex]?.id === lesson.id && !audio.paused) return '<i data-lucide="audio-lines"></i>';
    return '<i data-lucide="play"></i>';
  };

  const renderLessonList = (query = '') => {
    const normalized = query.trim().toLowerCase();
    const filtered = lessons.filter((lesson) =>
      `${lesson.title} ${lesson.product}`.toLowerCase().includes(normalized),
    );
    $('#lessonCount').textContent = String(filtered.length);
    $('#completedCount').textContent = `${state.completed.size} / ${lessons.length} complete`;

    if (!filtered.length) {
      lessonList.innerHTML = '<div class="empty-lessons">没有找到匹配节目</div>';
      return;
    }

    lessonList.innerHTML = filtered
      .map((lesson) => {
        const index = lessons.findIndex((item) => item.id === lesson.id);
        const active = index === state.currentIndex;
        return `
          <button class="lesson-item${active ? ' active' : ''}" type="button" data-index="${index}" aria-current="${active ? 'true' : 'false'}">
            <span class="lesson-index">${lesson.number}</span>
            <span class="lesson-copy">
              <strong>${lesson.title}</strong>
              <span>${lesson.product} · 2 min</span>
            </span>
            <span class="lesson-state" aria-hidden="true">${lessonIcon(lesson)}</span>
          </button>`;
      })
      .join('');

    $$('.lesson-item').forEach((button) => {
      button.addEventListener('click', () => {
        const index = Number(button.dataset.index);
        loadLesson(index, !audio.paused);
        closeDrawer();
      });
    });
    icons();
  };

  const renderTranscript = () => {
    const lesson = currentLesson();
    transcriptList.innerHTML = lesson.dialogue
      .map(
        (turn, index) => `
          <button class="transcript-line" type="button" role="listitem" data-line="${index}" data-speaker="${turn.speaker}" data-mode="${state.mode}">
            <span class="speaker-avatar" aria-hidden="true">${turn.speaker[0]}</span>
            <span class="line-copy">
              <span class="line-speaker">${turn.speaker}</span>
              <p class="line-english" lang="en">${turn.english}</p>
              <p class="line-chinese" lang="zh-CN">${turn.chinese}</p>
            </span>
            <span class="line-time">0:00</span>
          </button>`,
      )
      .join('');

    $$('.transcript-line').forEach((line) => {
      line.addEventListener('click', () => {
        const index = Number(line.dataset.line);
        if (state.segments[index]) audio.currentTime = state.segments[index].start + 0.05;
        audio.play().catch(() => showToast('浏览器阻止了自动播放，请再次点击播放'));
      });
    });
    buildSegments(audio.duration || 120);
  };

  const updateFavorite = () => {
    const isFavorite = state.favorites.has(currentLesson().id);
    favoriteButton.setAttribute('aria-pressed', String(isFavorite));
    favoriteButton.title = isFavorite ? '取消收藏' : '收藏';
  };

  const updateMode = () => {
    $$('#languageMode button').forEach((button) => {
      const active = button.dataset.mode === state.mode;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    $$('.transcript-line').forEach((line) => (line.dataset.mode = state.mode));
  };

  const updatePlayMode = () => {
    $$('[data-play-mode]').forEach((button) => {
      const active = button.dataset.playMode === state.playMode;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  };

  const randomLessonIndex = () => {
    if (lessons.length < 2) return state.currentIndex;
    const candidate = Math.floor(Math.random() * (lessons.length - 1));
    return candidate >= state.currentIndex ? candidate + 1 : candidate;
  };

  const nextLessonIndex = () => (state.playMode === 'shuffle' ? randomLessonIndex() : state.currentIndex + 1);

  const setPlayIcon = () => {
    const playing = !audio.paused;
    playButton.innerHTML = `<i data-lucide="${playing ? 'pause' : 'play'}"></i>`;
    playButton.title = playing ? '暂停' : '播放';
    playButton.setAttribute('aria-label', playing ? '暂停' : '播放');
    renderLessonList(searchInput.value);
    icons();
  };

  const loadLesson = (index, autoplay = false) => {
    const nextIndex = (index + lessons.length) % lessons.length;
    state.currentIndex = nextIndex;
    state.activeLine = -1;
    const lesson = currentLesson();
    const root = document.documentElement;
    root.style.setProperty('--accent', lesson.accent);
    root.style.setProperty('--tint', lesson.tint);

    $('#episodeLabel').textContent = `EPISODE ${lesson.number}`;
    $('#mobileEpisodeNumber').textContent = lesson.number;
    $('#mobileEpisodeTitle').textContent = lesson.title;
    $('#episodeTitle').textContent = lesson.title;
    $('#episodeProduct').textContent = lesson.product;
    $('#coverProduct').textContent = lesson.product;
    $('#episodeDate').textContent = lesson.source_date;
    $('#episodeDate').dateTime = lesson.source_date;
    $('#episodeLogo').src = lesson.logo;
    $('#episodeLogo').alt = `${lesson.product} logo`;
    $('#sourceTitle').textContent = lesson.source_title;
    $('#sourceLink').href = lesson.source_url;
    document.title = `${lesson.title} · ChangeLife`;

    audio.src = lesson.audio;
    audio.playbackRate = state.speed;
    progressRange.value = 0;
    progressRange.max = 120;
    progressStyle(progressRange, 0, 120);
    $('#currentTime').textContent = '0:00';
    $('#durationTime').textContent = '2:00';
    transcriptScroll.scrollTop = 0;
    renderTranscript();
    renderLessonList(searchInput.value);
    updateFavorite();
    updateMode();
    localStorage.setItem('changelife:lastLesson', String(state.currentIndex));
    icons();

    if (autoplay) {
      audio.play().catch(() => showToast('点击播放按钮开始收听'));
    }
  };

  const updateActiveLine = () => {
    if (!state.segments.length) return;
    const time = audio.currentTime;
    let next = state.segments.findIndex((segment) => time >= segment.start && time < segment.end);
    if (next < 0 && time >= state.segments.at(-1).end) next = state.segments.length - 1;
    if (next === state.activeLine) return;

    const previous = transcriptList.querySelector('.transcript-line.active');
    previous?.classList.remove('active');
    const current = transcriptList.querySelector(`[data-line="${next}"]`);
    current?.classList.add('active');
    state.activeLine = next;

    if (autoScroll.checked && current) {
      const scrollBounds = transcriptScroll.getBoundingClientRect();
      const lineBounds = current.getBoundingClientRect();
      const targetTop =
        transcriptScroll.scrollTop +
        (lineBounds.top - scrollBounds.top) -
        (transcriptScroll.clientHeight - lineBounds.height) / 2;
      transcriptScroll.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
    }
  };

  const togglePlay = () => {
    if (audio.paused) audio.play().catch(() => showToast('无法播放音频，请检查文件是否完整'));
    else audio.pause();
  };

  const openDrawer = () => app.classList.add('drawer-open');
  const closeDrawer = () => app.classList.remove('drawer-open');

  playButton.addEventListener('click', togglePlay);
  $('#previousButton').addEventListener('click', () => loadLesson(state.currentIndex - 1, true));
  $('#nextButton').addEventListener('click', () => loadLesson(nextLessonIndex(), true));
  $('#rewindButton').addEventListener('click', () => (audio.currentTime = Math.max(0, audio.currentTime - 10)));
  $('#forwardButton').addEventListener('click', () => (audio.currentTime = Math.min(audio.duration || 120, audio.currentTime + 10)));
  $('#drawerOpen').addEventListener('click', openDrawer);
  $('#drawerClose').addEventListener('click', closeDrawer);
  $('#drawerScrim').addEventListener('click', closeDrawer);

  favoriteButton.addEventListener('click', () => {
    const id = currentLesson().id;
    if (state.favorites.has(id)) state.favorites.delete(id);
    else state.favorites.add(id);
    saveSet('favorites', state.favorites);
    updateFavorite();
    showToast(state.favorites.has(id) ? '已收藏当前节目' : '已取消收藏');
  });

  speedButton.addEventListener('click', () => {
    const current = speeds.indexOf(state.speed);
    state.speed = speeds[(current + 1) % speeds.length];
    audio.playbackRate = state.speed;
    speedButton.textContent = formatSpeed(state.speed);
    localStorage.setItem('changelife:speed', String(state.speed));
  });

  playModeControl.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-play-mode]');
    if (!button) return;
    state.playMode = button.dataset.playMode;
    localStorage.setItem('changelife:playMode', state.playMode);
    updatePlayMode();
  });

  volumeRange.addEventListener('input', () => {
    audio.volume = Number(volumeRange.value);
    progressStyle(volumeRange, audio.volume, 1);
  });

  progressRange.addEventListener('input', () => {
    audio.currentTime = Number(progressRange.value);
    progressStyle(progressRange, audio.currentTime, Number(progressRange.max));
  });

  languageMode.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-mode]');
    if (!button) return;
    state.mode = button.dataset.mode;
    localStorage.setItem('changelife:mode', state.mode);
    updateMode();
  });

  searchInput.addEventListener('input', () => renderLessonList(searchInput.value));

  audio.addEventListener('loadedmetadata', () => {
    const duration = audio.duration || 120;
    progressRange.max = duration;
    $('#durationTime').textContent = formatTime(duration);
    buildSegments(duration);
    const savedPosition = Number(localStorage.getItem(`changelife:position:${currentLesson().id}`));
    if (savedPosition > 0 && savedPosition < duration - 5) audio.currentTime = savedPosition;
  });

  audio.addEventListener('timeupdate', () => {
    progressRange.value = audio.currentTime;
    $('#currentTime').textContent = formatTime(audio.currentTime);
    progressStyle(progressRange, audio.currentTime, audio.duration || 120);
    updateActiveLine();
    if (Math.floor(audio.currentTime) % 5 === 0) {
      localStorage.setItem(`changelife:position:${currentLesson().id}`, String(audio.currentTime));
    }
  });

  audio.addEventListener('play', setPlayIcon);
  audio.addEventListener('pause', setPlayIcon);
  audio.addEventListener('error', () => showToast('音频加载失败，请确认节目文件与页面位于同一目录'));
  audio.addEventListener('ended', () => {
    state.completed.add(currentLesson().id);
    saveSet('completed', state.completed);
    if (state.playMode === 'single') {
      state.activeLine = -1;
      audio.currentTime = 0;
      transcriptScroll.scrollTop = 0;
      audio.play().catch(() => showToast('点击播放按钮继续收听'));
      return;
    }
    loadLesson(nextLessonIndex(), true);
  });

  document.addEventListener('keydown', (event) => {
    if (event.target instanceof HTMLInputElement) return;
    if (event.code === 'Space') {
      event.preventDefault();
      togglePlay();
    } else if (event.code === 'ArrowLeft') {
      audio.currentTime = Math.max(0, audio.currentTime - 5);
    } else if (event.code === 'ArrowRight') {
      audio.currentTime = Math.min(audio.duration || 120, audio.currentTime + 5);
    } else if (event.code === 'Escape') {
      closeDrawer();
    }
  });

  autoScroll.checked = localStorage.getItem('changelife:autoScroll') !== 'false';
  autoScroll.addEventListener('change', () => localStorage.setItem('changelife:autoScroll', String(autoScroll.checked)));
  speedButton.textContent = formatSpeed(state.speed);
  audio.playbackRate = state.speed;
  progressStyle(volumeRange, 1, 1);
  updateMode();
  updatePlayMode();
  loadLesson(state.currentIndex, false);
})();
