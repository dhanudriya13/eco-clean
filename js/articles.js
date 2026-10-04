/**
 * EcoClean Modul Artikel Edukasi ("Tentang Minyak Jelantah")
 * Fitur: Daftar Artikel (Grid), Filter Kategori, Pencarian, dan Pembaca Artikel
 */

class ArticleHub {
  constructor() {
    this.articles = ARTICLES || [];
    this.filteredArticles = [...this.articles];
    this.currentCategory = 'all';
    this.activeArticleId = null;

    // DOM Elements
    this.gridSection = document.getElementById('daftar-artikel');
    this.grid = document.getElementById('articleGrid');
    this.searchInput = document.getElementById('articleSearchInput');
    this.filterPills = document.querySelectorAll('.article-filter-pill');
    this.reader = document.getElementById('articleReader');
    this.readerBody = document.getElementById('articleReaderBody');
    this.readerRelated = document.getElementById('articleReaderRelated');
    this.articlePool = document.getElementById('articleSourcePool');
    this.backBtn = document.getElementById('articleBackBtn');

    // Simpan rujukan node artikel statis agar hanya ada satu di DOM
    this.articleNodes = new Map();
    this.articles.forEach(article => {
      const node = document.getElementById(article.id);
      if (node) this.articleNodes.set(article.id, node);
    });

    this.init();
  }

  init() {
    this.renderGrid();
    this.bindEvents();
    this.handleHash();
  }

  bindEvents() {
    this.filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        this.filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.currentCategory = pill.getAttribute('data-category');
        this.applyFilter();
      });
    });

    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.keyword = e.target.value.trim().toLowerCase();
        this.applyFilter();
      });
    }

    if (this.backBtn) {
      this.backBtn.addEventListener('click', () => this.closeReader());
    }

    window.addEventListener('hashchange', () => this.handleHash());
  }

  applyFilter() {
    const keyword = this.keyword || '';

    this.filteredArticles = this.articles.filter(article => {
      const matchCategory = this.currentCategory === 'all' || article.category === this.currentCategory;
      const haystack = `${article.title} ${article.excerpt} ${article.category}`.toLowerCase();
      const matchKeyword = keyword === '' || haystack.includes(keyword);
      return matchCategory && matchKeyword;
    });

    this.renderGrid();
  }

  renderGrid() {
    if (!this.grid) return;

    if (this.filteredArticles.length === 0) {
      this.grid.innerHTML = `
        <div class="article-empty-state">
          <h3>Artikel tidak ditemukan</h3>
          <p>Coba kata kunci lain atau pilih kategori yang berbeda.</p>
        </div>
      `;
      return;
    }

    this.grid.innerHTML = this.filteredArticles.map(article => `
      <button class="article-card" data-id="${article.id}">
        <div class="article-card-top">
          <span class="article-card-icon">${article.icon}</span>
          <span class="article-card-cat">${article.category}</span>
        </div>
        <h3 class="article-card-title">${article.title}</h3>
        <p class="article-card-excerpt">${article.excerpt}</p>
        <div class="article-card-meta">
          <span>⏱️ ${article.readMinutes} menit baca</span>
          <span class="article-card-cta">Baca Artikel &rarr;</span>
        </div>
      </button>
    `).join('');

    this.grid.querySelectorAll('.article-card').forEach(card => {
      card.addEventListener('click', () => this.openArticle(card.getAttribute('data-id')));
    });
  }

  openArticle(id, updateHash = true) {
    const article = this.articles.find(item => item.id === id);
    const node = this.articleNodes.get(id);
    if (!article || !node || !this.reader) return;

    this.activeArticleId = id;

    if (this.readerBody) {
      this.readerBody.innerHTML = '';
      this.readerBody.appendChild(node);
      node.hidden = false;
    }

    this.renderRelated(article);
    this.gridSection.hidden = true;
    this.reader.hidden = false;

    if (updateHash && window.location.hash !== `#artikel/${id}`) {
      window.location.hash = `artikel/${id}`;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  closeReader() {
    if (!this.reader) return;

    const node = this.articleNodes.get(this.activeArticleId);
    if (node) {
      node.hidden = true;
      (this.articlePool || document.body).appendChild(node);
    }

    this.reader.hidden = true;
    this.gridSection.hidden = false;
    this.activeArticleId = null;

    if (window.location.hash.startsWith('#artikel/')) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  renderRelated(article) {
    if (!this.readerRelated) return;

    const related = this.articles
      .filter(item => item.category === article.category && item.id !== article.id)
      .slice(0, 3);

    if (related.length === 0) {
      this.readerRelated.innerHTML = '';
      return;
    }

    this.readerRelated.innerHTML = `
      <h4 class="article-related-title">Baca juga</h4>
      <div class="article-related-row">
        ${related.map(item => `
          <button class="article-related-chip" data-id="${item.id}">
            <span>${item.icon}</span> ${item.title}
          </button>
        `).join('')}
      </div>
    `;

    this.readerRelated.querySelectorAll('.article-related-chip').forEach(chip => {
      chip.addEventListener('click', () => this.openArticle(chip.getAttribute('data-id')));
    });
  }

  handleHash() {
    const match = window.location.hash.match(/^#artikel\/(art-\d+)$/);
    if (match && this.articleNodes.has(match[1])) {
      if (this.activeArticleId !== match[1]) {
        this.openArticle(match[1], false);
      }
    } else if (this.activeArticleId) {
      this.closeReader();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.articleHub = new ArticleHub();
});
