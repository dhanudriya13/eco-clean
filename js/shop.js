/**
 * EcoClean Modul Toko Bahan & Produk Pembuatan Sabun Alami
 * Fitur: Filter Produk, Keranjang Belanja & Checkout WhatsApp Direct
 */

class EcoShop {
  constructor() {
    this.products = PRODUCTS || [];
    this.filteredProducts = [...this.products];
    this.cart = JSON.parse(localStorage.getItem('ecoclean-cart')) || [];
    this.currentCategory = 'all';

    // DOM Elements
    this.productGrid = document.getElementById('shopProductGrid');
    this.categoryPills = document.querySelectorAll('.shop-filter-pill');
    this.cartBtn = document.getElementById('cartToggleBtn');
    this.cartDrawer = document.getElementById('cartDrawer');
    this.closeCartBtn = document.getElementById('closeCartBtn');
    this.cartBadge = document.getElementById('cartCountBadge');
    this.cartItemsList = document.getElementById('cartItemsList');
    this.cartTotalPriceDisplay = document.getElementById('cartTotalPrice');
    this.checkoutWaBtn = document.getElementById('checkoutWaBtn');

    this.init();
  }

  init() {
    this.renderProducts();
    this.updateCartUI();
    this.bindEvents();
  }

  bindEvents() {
    // Filter Kategori
    if (this.categoryPills.length > 0) {
      this.categoryPills.forEach(pill => {
        pill.addEventListener('click', () => {
          this.categoryPills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          this.currentCategory = pill.getAttribute('data-category');
          this.applyFilter();
        });
      });
    }

    // Toggle Cart Drawer
    if (this.cartBtn) {
      this.cartBtn.addEventListener('click', () => this.toggleCart(true));
    }
    if (this.closeCartBtn) {
      this.closeCartBtn.addEventListener('click', () => this.toggleCart(false));
    }

    // Checkout via WhatsApp
    if (this.checkoutWaBtn) {
      this.checkoutWaBtn.addEventListener('click', () => this.checkoutWhatsApp());
    }
  }

  applyFilter() {
    if (this.currentCategory === 'all') {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter(p => p.category === this.currentCategory);
    }
    this.renderProducts();
  }

  renderProducts() {
    if (!this.productGrid) return;

    if (this.filteredProducts.length === 0) {
      this.productGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
          <h4>Tidak ada produk dalam kategori ini</h4>
        </div>
      `;
      return;
    }

    this.productGrid.innerHTML = this.filteredProducts.map(p => `
      <div class="product-card" data-id="${p.id}">
        <div class="product-img-wrapper">
          <img src="${p.image}" alt="${p.name}" loading="lazy">
          <span class="product-badge">${p.badge}</span>
        </div>
        <div class="product-info-body">
          <div class="product-cat-tag">${p.category}</div>
          <h3 class="product-title">${p.name}</h3>
          <p class="product-desc">${p.description}</p>
          <div class="product-rating">
            <span>⭐ ${p.rating}</span>
            <span style="color: var(--text-dim); font-size: 0.8rem;">(Stok Ready)</span>
          </div>
          <div class="product-price-row">
            <div>
              <div class="product-price">Rp ${p.price.toLocaleString('id-ID')}</div>
              <div class="product-unit">/ ${p.unit}</div>
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="btn btn-secondary btn-sm add-to-cart-btn" data-id="${p.id}" title="Tambah ke Keranjang">
                🛒 +1
              </button>
              <button class="btn btn-primary btn-sm buy-now-btn" data-id="${p.id}">
                Beli 💬
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    // Bind event tombol pada kartu
    this.productGrid.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        this.addToCart(id);
      });
    });

    this.productGrid.querySelectorAll('.buy-now-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        this.buyNowSingle(id);
      });
    });
  }

  addToCart(productId, qty = 1) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = this.cart.findIndex(item => item.id === productId);
    if (existingIndex > -1) {
      this.cart[existingIndex].qty += qty;
    } else {
      this.cart.push({ ...product, qty: qty });
    }

    this.saveCart();
    this.updateCartUI();
    if (window.showToast) {
      window.showToast(`"${product.name}" dimasukkan ke keranjang!`);
    }
  }

  buyNowSingle(productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    const text = `Halo EcoClean Buleleng, saya ingin membeli langsung:\n• *${product.name}* (1 ${product.unit}) = Rp ${product.price.toLocaleString('id-ID')}\n\nMohon petunjuk pembayaran & alamat pengiriman di Buleleng. Terima kasih!`;
    const waUrl = `https://wa.me/6289603372387?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  }

  updateQuantity(productId, delta) {
    const index = this.cart.findIndex(item => item.id === productId);
    if (index > -1) {
      this.cart[index].qty += delta;
      if (this.cart[index].qty <= 0) {
        this.cart.splice(index, 1);
      }
      this.saveCart();
      this.updateCartUI();
    }
  }

  saveCart() {
    localStorage.setItem('ecoclean-cart', JSON.stringify(this.cart));
  }

  toggleCart(open) {
    if (!this.cartDrawer) return;
    if (open) {
      this.cartDrawer.classList.add('active');
    } else {
      this.cartDrawer.classList.remove('active');
    }
  }

  updateCartUI() {
    const totalItems = this.cart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = this.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    if (this.cartBadge) {
      this.cartBadge.textContent = totalItems;
      this.cartBadge.style.display = totalItems > 0 ? 'inline-flex' : 'none';
    }

    if (this.cartTotalPriceDisplay) {
      this.cartTotalPriceDisplay.textContent = `Rp ${totalPrice.toLocaleString('id-ID')}`;
    }

    if (!this.cartItemsList) return;

    if (this.cart.length === 0) {
      this.cartItemsList.innerHTML = `
        <div style="text-align: center; padding: 40px; color: var(--text-muted);">
          <div style="font-size: 2.5rem; margin-bottom: 8px;">🛒</div>
          <p>Keranjang belanja Anda masih kosong</p>
        </div>
      `;
      if (this.checkoutWaBtn) this.checkoutWaBtn.disabled = true;
      return;
    }

    if (this.checkoutWaBtn) this.checkoutWaBtn.disabled = false;

    this.cartItemsList.innerHTML = this.cart.map(item => `
      <div class="cart-item-row">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">Rp ${item.price.toLocaleString('id-ID')} / ${item.unit}</div>
          <div class="cart-qty-controls">
            <button class="cart-qty-btn decrease-qty-btn" data-id="${item.id}">-</button>
            <span class="cart-qty-val">${item.qty}</span>
            <button class="cart-qty-btn increase-qty-btn" data-id="${item.id}">+</button>
          </div>
        </div>
        <div style="font-weight: 700; color: var(--primary);">
          Rp ${(item.price * item.qty).toLocaleString('id-ID')}
        </div>
      </div>
    `).join('');

    // Bind quantity control buttons inside cart drawer
    this.cartItemsList.querySelectorAll('.decrease-qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.updateQuantity(id, -1);
      });
    });

    this.cartItemsList.querySelectorAll('.increase-qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.updateQuantity(id, 1);
      });
    });
  }

  checkoutWhatsApp() {
    if (this.cart.length === 0) return;

    let itemsText = this.cart.map(item => `• *${item.name}* (${item.qty}x) = Rp ${(item.price * item.qty).toLocaleString('id-ID')}`).join('\n');
    const totalPrice = this.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    const message = `🌿 *PEMESANAN ECOCLEAN BULELENG*\n\nBerikut rincian pesanan bahan/produk sabun saya:\n${itemsText}\n\n💰 *Total Pembayaran:* Rp ${totalPrice.toLocaleString('id-ID')}\n\nMohon info alamat pengiriman / COD wilayah Buleleng. Terima kasih!`;
    const waUrl = `https://wa.me/6289603372387?text=${encodeURIComponent(message)}`;

    window.open(waUrl, '_blank');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.ecoShop = new EcoShop();
});
