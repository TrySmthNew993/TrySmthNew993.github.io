(() => {
  const games = Array.isArray(window.APEXWARE_GAMES) ? window.APEXWARE_GAMES : [];

  const viewHome = document.getElementById('view-home');
  const viewLibrary = document.getElementById('view-library');
  const homeCount = document.getElementById('home-count');
  const homeStrip = document.getElementById('home-strip');

  const grid = document.getElementById('games-grid');
  const searchInput = document.getElementById('game-search');
  const filterPills = document.querySelectorAll('.filter-pill');
  const sortSelect = document.getElementById('sort-select');
  const libraryCount = document.getElementById('library-count');

  const modal = document.getElementById('game-modal');
  const modalBody = document.getElementById('modal-body');
  const modalClose = document.getElementById('modal-close');

  const FAV_KEY = 'apexware_favorites_v1';
  let favorites = new Set();
  try {
    const saved = JSON.parse(localStorage.getItem(FAV_KEY) || '[]');
    if (Array.isArray(saved)) favorites = new Set(saved);
  } catch {
    favorites = new Set();
  }

  let activeFilter = 'all';
  let searchQuery = '';
  let sortMode = 'default';

  function saveFavorites() {
    try {
      localStorage.setItem(FAV_KEY, JSON.stringify([...favorites]));
    } catch {
      // Ignore storage quota / privacy mode errors
    }
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function createSvgBookmark(filled) {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('width', '15');
    svg.setAttribute('height', '15');
    svg.setAttribute('viewBox', '0 0 16 16');
    svg.setAttribute('fill', filled ? 'currentColor' : 'none');
    svg.setAttribute('aria-hidden', 'true');

    const path = document.createElementNS(ns, 'path');
    path.setAttribute('d', 'M4 2.5H12C12.2761 2.5 12.5 2.72386 12.5 3V13.5L8 10.75L3.5 13.5V3C3.5 2.72386 3.72386 2.5 4 2.5Z');
    path.setAttribute('stroke', 'currentColor');
    path.setAttribute('stroke-width', '1.5');
    path.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(path);
    return svg;
  }

  function createSvgExternalArrow() {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('width', '12');
    svg.setAttribute('height', '12');
    svg.setAttribute('viewBox', '0 0 16 16');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('aria-hidden', 'true');

    const path = document.createElementNS(ns, 'path');
    path.setAttribute('d', 'M4.5 11.5L11.5 4.5M11.5 4.5H5.5M11.5 4.5V10.5');
    path.setAttribute('stroke', 'currentColor');
    path.setAttribute('stroke-width', '1.7');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(path);
    return svg;
  }

  /* =========================================================================
     HASH ROUTING (#/ vs #/library)
     ========================================================================= */
  function syncRoute() {
    const hash = window.location.hash || '#/';
    const isLibrary = hash.startsWith('#/library');
    if (viewHome) viewHome.hidden = isLibrary;
    if (viewLibrary) viewLibrary.hidden = !isLibrary;
    if (isLibrary) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }

  window.addEventListener('hashchange', syncRoute);

  /* =========================================================================
     HOME STARTING PAGE STRIP
     ========================================================================= */
  function renderHomeStrip() {
    if (homeCount) {
      const padded = String(games.length).padStart(2, '0');
      homeCount.textContent = `${padded} RELEASES`;
    }
    if (!homeStrip) return;
    homeStrip.replaceChildren();

    games.forEach((game) => {
      const item = el('button', 'strip-item');
      item.type = 'button';
      item.title = `Open ${game.title} in Library`;
      item.addEventListener('click', () => {
        window.location.hash = '#/library';
        openModal(game);
      });

      const thumb = el('div', 'strip-thumb');
      if (game.icon) {
        const img = el('img');
        img.src = game.icon;
        img.alt = game.title;
        thumb.appendChild(img);
      } else {
        thumb.appendChild(el('span', 'slot-monogram', game.iconSlot?.monogram || 'GM'));
      }
      item.appendChild(thumb);
      item.appendChild(el('span', 'strip-title', game.title));
      homeStrip.appendChild(item);
    });
  }

  /* =========================================================================
     ICON SLOT & ACTION LINKS
     ========================================================================= */
  function buildIconSlot(game) {
    const slot = el('div', 'game-icon-slot');

    const renderFallback = () => {
      slot.classList.add('is-empty');
      slot.replaceChildren();
      const fallback = el('div', 'slot-fallback');
      fallback.appendChild(el('span', 'slot-monogram', game.iconSlot?.monogram || 'GM'));
      fallback.appendChild(el('span', 'slot-hint', game.iconSlot?.hint || 'ICON SLOT'));
      slot.appendChild(fallback);
    };

    if (game.icon) {
      const img = el('img', 'game-icon-img');
      img.src = game.icon;
      img.alt = `${game.title} icon`;
      img.loading = 'lazy';
      img.addEventListener('error', renderFallback, { once: true });
      slot.appendChild(img);
    } else {
      renderFallback();
    }

    return slot;
  }

  function buildActionLink(label, url, variantClass) {
    const link = el('a', `action-btn ${variantClass}`);
    link.appendChild(el('span', '', label));
    link.appendChild(createSvgExternalArrow());
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.addEventListener('click', (e) => e.stopPropagation());
    return link;
  }

  /* =========================================================================
     DETAIL MODAL
     ========================================================================= */
  function openModal(game) {
    if (!modal || !modalBody) return;
    modalBody.replaceChildren();

    const header = el('div', 'game-card-top');
    header.appendChild(buildIconSlot(game));

    const titleWrap = el('div', 'game-title-wrap');
    const meta = el('div', 'game-meta-row');
    const isTesting = (game.status || '').toUpperCase() === 'UNDER TESTING';
    meta.appendChild(el('span', `status-pill ${isTesting ? 'status-testing' : ''}`, game.status || 'LIVE'));
    titleWrap.appendChild(meta);
    const title = el('h2', '', game.title);
    title.id = 'modal-title';
    titleWrap.appendChild(title);
    titleWrap.appendChild(el('p', 'game-subtitle', game.subtitle));
    header.appendChild(titleWrap);
    modalBody.appendChild(header);

    const desc = el('p', 'game-desc', game.description);
    desc.style.marginTop = '16px';
    modalBody.appendChild(desc);

    const tags = el('div', 'modal-tags');
    (game.tags || []).forEach((t) => tags.appendChild(el('span', 'tag-chip', t)));
    modalBody.appendChild(tags);

    const actions = el('div', 'game-actions');
    if (game.pageUrl) actions.appendChild(buildActionLink('Play Live', game.pageUrl, 'action-primary'));
    if (game.repoUrl) actions.appendChild(buildActionLink('Repository', game.repoUrl, 'action-secondary'));
    if (game.secondaryLink?.url) {
      actions.appendChild(buildActionLink(game.secondaryLink.label, game.secondaryLink.url, 'action-tertiary'));
    }
    modalBody.appendChild(actions);

    modal.hidden = false;
  }

  function closeModal() {
    if (modal) modal.hidden = true;
  }

  modalClose?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  /* =========================================================================
     LIBRARY CARDS & FILTERING
     ========================================================================= */
  function renderGameCard(game) {
    const card = el('article', 'game-card glass-frost pointer-reactive');
    card.addEventListener('click', () => openModal(game));

    const top = el('div', 'game-card-top');
    top.appendChild(buildIconSlot(game));

    const titleWrap = el('div', 'game-title-wrap');
    const metaRow = el('div', 'game-meta-row');
    const isTesting = (game.status || '').toUpperCase() === 'UNDER TESTING';
    metaRow.appendChild(el('span', `status-pill ${isTesting ? 'status-testing' : ''}`, game.status || 'LIVE'));

    const isFav = favorites.has(game.id);
    const favBtn = el('button', `fav-btn ${isFav ? 'is-fav' : ''}`);
    favBtn.type = 'button';
    favBtn.title = isFav ? 'Remove from saved' : 'Save game';
    favBtn.setAttribute('aria-label', `Save ${game.title}`);
    favBtn.appendChild(createSvgBookmark(isFav));
    favBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (favorites.has(game.id)) {
        favorites.delete(game.id);
      } else {
        favorites.add(game.id);
      }
      saveFavorites();
      renderGames();
    });
    metaRow.appendChild(favBtn);

    titleWrap.appendChild(metaRow);
    titleWrap.appendChild(el('h2', '', game.title));
    titleWrap.appendChild(el('p', 'game-subtitle', game.subtitle));
    top.appendChild(titleWrap);
    card.appendChild(top);

    card.appendChild(el('p', 'game-desc', game.description));

    const actions = el('div', 'game-actions');
    if (game.pageUrl) actions.appendChild(buildActionLink('Play', game.pageUrl, 'action-primary'));
    if (game.repoUrl) actions.appendChild(buildActionLink('Repo', game.repoUrl, 'action-secondary'));
    if (game.secondaryLink?.url) {
      actions.appendChild(buildActionLink(game.secondaryLink.label, game.secondaryLink.url, 'action-tertiary'));
    }
    card.appendChild(actions);

    return card;
  }

  function renderGames() {
    if (!grid) return;
    const q = searchQuery.trim().toLowerCase();

    let list = games.filter((game) => {
      if (activeFilter === 'favorites' && !favorites.has(game.id)) return false;
      if (activeFilter !== 'all' && activeFilter !== 'favorites' && game.category !== activeFilter) {
        return false;
      }
      if (!q) return true;
      const haystack = [game.title, game.subtitle, game.description, ...(game.tags || [])]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });

    if (sortMode === 'az') {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortMode === 'favorites') {
      list = [...list].sort((a, b) => Number(favorites.has(b.id)) - Number(favorites.has(a.id)));
    }

    if (libraryCount) {
      libraryCount.textContent = String(list.length);
    }

    grid.replaceChildren();
    if (list.length === 0) {
      grid.appendChild(
        el('div', 'empty-state glass-frost', 'No games match your current filter.')
      );
      return;
    }

    list.forEach((game) => grid.appendChild(renderGameCard(game)));
  }

  filterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      filterPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      activeFilter = pill.dataset.filter || 'all';
      renderGames();
    });
  });

  searchInput?.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderGames();
  });

  sortSelect?.addEventListener('change', (e) => {
    sortMode = e.target.value;
    renderGames();
  });

  // Subtle monochrome specular catchlight
  document.addEventListener('pointermove', (e) => {
    const targets = document.querySelectorAll('.pointer-reactive');
    for (const node of targets) {
      const rect = node.getBoundingClientRect();
      if (
        e.clientX >= rect.left - 80 &&
        e.clientX <= rect.right + 80 &&
        e.clientY >= rect.top - 80 &&
        e.clientY <= rect.bottom + 80
      ) {
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        node.style.setProperty('--mx', `${x.toFixed(1)}%`);
        node.style.setProperty('--my', `${y.toFixed(1)}%`);
      }
    }
  });

  renderHomeStrip();
  renderGames();
  syncRoute();
})();
