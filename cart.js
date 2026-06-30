// ===== ROOMIE CHARM — Shared Cart + Product Store =====

const RC = {

  // ── PRODUCTS (stored in localStorage, editable via admin.html) ──
  getProducts() {
    try {
      const stored = localStorage.getItem('rc_products');
      if (stored) return JSON.parse(stored);
    } catch {}
    // Default sample products — replaced once you add your own via admin
    return [
      { id:'demo1', name:'Rose Velvet Cushion', category:'bedding', price:199, badge:'Bestseller', desc:'Soft blush velvet cushion cover 45×45cm.', img:'' },
      { id:'demo2', name:'Fairy Light String 5m', category:'lighting', price:149, badge:'New', desc:'Warm white LED string lights, perfect above a bed.', img:'' },
      { id:'demo3', name:'Vanilla Rose Candle', category:'scent', price:120, badge:'', desc:'Hand-poured soy wax candle in a blush glass jar.', img:'' },
      { id:'demo4', name:'Moon Phase Wall Prints', category:'wall', price:220, badge:'New', desc:'Set of 3 minimal moon phase art prints, A4 size.', img:'' },
    ];
  },
  saveProducts(products) {
    localStorage.setItem('rc_products', JSON.stringify(products));
  },
  getCategories() {
    try {
      const stored = localStorage.getItem('rc_categories');
      if (stored) return JSON.parse(stored);
    } catch {}
    return [
      { id:'bedding',  label:'Bedding & Cushions',      emoji:'🛏️' },
      { id:'scent',    label:'Candles & Scent',          emoji:'🕯️' },
      { id:'wall',     label:'Wall Art & Mirrors',       emoji:'🪞' },
      { id:'lighting', label:'Fairy Lights & Lamps',     emoji:'✨' },
      { id:'florals',  label:'Flower Arrangements',      emoji:'🌸' },
      { id:'trinkets', label:'Trinkets & Accessories',   emoji:'💎' },
    ];
  },
  saveCategories(cats) {
    localStorage.setItem('rc_categories', JSON.stringify(cats));
  },

  // ── CART ──
  getCart() {
    try { return JSON.parse(localStorage.getItem('rc_cart') || '[]'); } catch { return []; }
  },
  saveCart(cart) {
    localStorage.setItem('rc_cart', JSON.stringify(cart));
    this.updateBadge();
  },
  addItem(product) {
    const cart = this.getCart();
    const existing = cart.find(i => i.id === product.id);
    if (existing) { existing.qty += 1; }
    else { cart.push({ ...product, qty: 1 }); }
    this.saveCart(cart);
    this.renderDrawer();
    this.openDrawer();
  },
  removeItem(id) {
    this.saveCart(this.getCart().filter(i => i.id !== id));
    this.renderDrawer();
  },
  changeQty(id, delta) {
    let cart = this.getCart();
    const item = cart.find(i => i.id === id);
    if (item) { item.qty += delta; if (item.qty <= 0) cart = cart.filter(i => i.id !== id); }
    this.saveCart(cart);
    this.renderDrawer();
  },
  clearCart() {
    localStorage.removeItem('rc_cart');
    this.updateBadge();
    this.renderDrawer();
  },
  getTotal() { return this.getCart().reduce((s,i) => s + i.price * i.qty, 0); },
  getCount() { return this.getCart().reduce((s,i) => s + i.qty, 0); },

  // ── BADGE ──
  updateBadge() {
    const badge = document.getElementById('cartCount');
    if (!badge) return;
    const n = this.getCount();
    badge.textContent = n;
    badge.classList.toggle('hidden', n === 0);
  },

  // ── DRAWER ──
  openDrawer() {
    document.getElementById('cartOverlay')?.classList.add('open');
    document.getElementById('cartDrawer')?.classList.add('open');
  },
  closeDrawer() {
    document.getElementById('cartOverlay')?.classList.remove('open');
    document.getElementById('cartDrawer')?.classList.remove('open');
  },
  renderDrawer() {
    const el = document.getElementById('cartItemsList');
    if (!el) return;
    const cart = this.getCart();
    this.updateBadge();
    const footer = document.getElementById('cartFooter');
    if (cart.length === 0) {
      el.innerHTML = `<div class="cart-empty"><span>🛒</span><p>Your cart is empty.<br/>Add something cute!</p></div>`;
      if (footer) footer.style.display = 'none';
      return;
    }
    if (footer) footer.style.display = 'block';
    el.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-img">${item.img ? `<img src="${item.img}" alt="${item.name}" style="width:56px;height:56px;object-fit:cover;border-radius:10px;">` : `<span style="font-size:2rem;">${item.emoji||'🛍️'}</span>`}</div>
        <div class="cart-item-info">
          <p class="cart-item-name">${item.name}</p>
          <p class="cart-item-price">R${(item.price * item.qty).toFixed(2)}</p>
          <div class="cart-item-controls">
            <button class="qty-btn" onclick="RC.changeQty('${item.id}',-1)">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="RC.changeQty('${item.id}',1)">+</button>
            <button class="cart-item-remove" onclick="RC.removeItem('${item.id}')" aria-label="Remove">✕</button>
          </div>
        </div>
      </div>`).join('');
    const total = this.getTotal();
    const shipping = total >= 500 ? 0 : 60;
    document.getElementById('cartSubtotal').textContent = `R${total.toFixed(2)}`;
    document.getElementById('cartShipping').textContent = shipping === 0 ? 'Free 🎉' : `R${shipping.toFixed(2)}`;
    document.getElementById('cartGrandTotal').textContent = `R${(total + shipping).toFixed(2)}`;
  },

  toggleMenu() { document.getElementById('mobileMenu')?.classList.toggle('open'); }
};

document.addEventListener('DOMContentLoaded', () => {
  RC.updateBadge();
  RC.renderDrawer();
});