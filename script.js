// Base de dados simulada de produtos pesquisáveis
const productsData = [
  {
    id: 1,
    title: "Smartphone Galaxy S23 Ultra 256GB",
    category: "Eletrônicos",
    image: "https://via.placeholder.com/200/1e1e1e/ffffff?text=Galaxy+S23",
    verifiedStore: true,
    stores: [
      { name: "Loja Tech", price: 4899.00, deliveryDays: 2, safetyScore: "9.8/10" },
      { name: "MarketPlace X", price: 5120.00, deliveryDays: 4, safetyScore: "9.2/10" },
      { name: "E-Eletro", price: 4950.00, deliveryDays: 3, safetyScore: "9.5/10" }
    ]
  },
  {
    id: 2,
    title: "Notebook Gamer RTX 3050 16GB RAM",
    category: "Eletrônicos",
    image: "https://via.placeholder.com/200/1e1e1e/ffffff?text=Notebook+Gamer",
    verifiedStore: true,
    stores: [
      { name: "Gamer Store", price: 3999.90, deliveryDays: 3, safetyScore: "9.9/10" },
      { name: "Megabyte", price: 4200.00, deliveryDays: 5, safetyScore: "9.1/10" }
    ]
  },
  {
    id: 3,
    title: "Fone de Ouvido Bluetooth Noise Cancelling",
    category: "Eletrônicos",
    image: "https://via.placeholder.com/200/1e1e1e/ffffff?text=Fone+Bluetooth",
    verifiedStore: true,
    stores: [
      { name: "AudioPro", price: 299.00, deliveryDays: 1, safetyScore: "9.7/10" },
      { name: "Som & Cia", price: 349.90, deliveryDays: 3, safetyScore: "8.9/10" }
    ]
  },
  {
    id: 4,
    title: "Tênis Esportivo Running Pro",
    category: "Moda",
    image: "https://via.placeholder.com/200/1e1e1e/ffffff?text=Tenis+Running",
    verifiedStore: false,
    stores: [
      { name: "Calçados Online", price: 189.90, deliveryDays: 5, safetyScore: "8.5/10" },
      { name: "Atleta Shop", price: 210.00, deliveryDays: 2, safetyScore: "9.4/10" }
    ]
  },
  {
    id: 5,
    title: "Cadeira Ergonômica Escritório Premium",
    category: "Casa",
    image: "https://via.placeholder.com/200/1e1e1e/ffffff?text=Cadeira+Ergo",
    verifiedStore: true,
    stores: [
      { name: "Móveis Direct", price: 750.00, deliveryDays: 6, safetyScore: "9.6/10" },
      { name: "Conforto House", price: 789.00, deliveryDays: 4, safetyScore: "9.3/10" }
    ]
  },
  {
    id: 6,
    title: "Console Video Game Next-Gen 1TB",
    category: "Jogos",
    image: "https://via.placeholder.com/200/1e1e1e/ffffff?text=Console+1TB",
    verifiedStore: true,
    stores: [
      { name: "Game Central", price: 3499.00, deliveryDays: 2, safetyScore: "9.9/10" },
      { name: "World Games", price: 3650.00, deliveryDays: 4, safetyScore: "9.0/10" }
    ]
  }
];

// Estado global da aplicação
let cart = [];
let selectedCategory = 'all';

// Elementos DOM
const productGrid = document.getElementById('productGrid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resultsCount = document.getElementById('resultsCount');
const sortSelect = document.getElementById('sortSelect');
const verifiedOnlyCheck = document.getElementById('verifiedOnlyCheck');
const categoryButtons = document.querySelectorAll('.cat-btn');

// Cart DOM
const openCartBtn = document.getElementById('openCartBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartBadge = document.getElementById('cartBadge');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');

// Modal DOM
const compareModal = document.getElementById('compareModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalProductName = document.getElementById('modalProductName');
const modalStoreList = document.getElementById('modalStoreList');

// Função de Inicialização
function init() {
  renderProducts();
  setupEventListeners();
}

// Obter menor preço de um produto
function getLowestPrice(product) {
  return Math.min(...product.stores.map(s => s.price));
}

// Renderizar Produtos
function renderProducts() {
  const searchTerm = searchInput.value.toLowerCase();
  const verifiedOnly = verifiedOnlyCheck.checked;
  const sortBy = sortSelect.value;

  // Filtragem
  let filtered = productsData.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm);
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesVerified = !verifiedOnly || p.verifiedStore;
    return matchesSearch && matchesCategory && matchesVerified;
  });

  // Ordenação
  filtered.sort((a, b) => {
    const priceA = getLowestPrice(a);
    const priceB = getLowestPrice(b);
    if (sortBy === 'price-asc') return priceA - priceB;
    if (sortBy === 'price-desc') return priceB - priceA;
    if (sortBy === 'safety') return b.stores[0].safetyScore.localeCompare(a.stores[0].safetyScore);
    return 0;
  });

  resultsCount.textContent = `${filtered.length} itens`;
  productGrid.innerHTML = '';

  if (filtered.length === 0) {
    productGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px 0;">Nenhum produto seguro encontrado para sua busca.</p>`;
    return;
  }

  filtered.forEach(product => {
    const lowestPrice = getLowestPrice(product);

    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="card-img-wrapper">
        <span class="badge-guarantee">
          <i class="fa-solid fa-shield-check"></i> Entrega Assegurada
        </span>
        <img src="${product.image}" alt="${product.title}">
      </div>
      <div class="card-content">
        <span class="card-category">${product.category}</span>
        <h3 class="card-title">${product.title}</h3>
        <div class="price-info">
          <span class="lowest-price-label">A partir do menor preço:</span>
          <div class="price-val">R$ ${lowestPrice.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
        </div>
        <div class="card-actions">
          <button class="btn-compare" onclick="openCompareModal(${product.id})">
            <i class="fa-solid fa-code-compare"></i> Comparar Lojas
          </button>
          <button class="btn-add-cart" onclick="addToCart(${product.id})">
            <i class="fa-solid fa-cart-plus"></i>
          </button>
        </div>
      </div>
    `;
    productGrid.appendChild(card);
  });
}

// Modal de Comparação de Lojas
window.openCompareModal = function(productId) {
  const product = productsData.find(p => p.id === productId);
  if (!product) return;

  modalProductName.textContent = product.title;
  modalStoreList.innerHTML = '';

  const sortedStores = [...product.stores].sort((a, b) => a.price - b.price);

  sortedStores.forEach((store, index) => {
    const isBest = index === 0;
    const storeRow = document.createElement('div');
    storeRow.className = `store-option ${isBest ? 'best-price' : ''}`;
    storeRow.innerHTML = `
      <div>
        <div class="store-name">
          ${store.name} 
          ${isBest ? '<span class="store-badge">MENOR PREÇO</span>' : ''}
        </div>
        <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">
          Entrega em ${store.deliveryDays} dias úteis • Segurança: ${store.safetyScore}
        </div>
      </div>
      <div style="text-align: right;">
        <div style="font-weight: 700; font-size: 1.1rem;">R$ ${store.price.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
        <button class="btn-compare" style="margin-top: 4px; padding: 4px 10px;" onclick="addStoreToCart(${product.id}, '${store.name}', ${store.price})">
          Selecionar
        </button>
      </div>
    `;
    modalStoreList.appendChild(storeRow);
  });

  compareModal.classList.add('active');
};

// Funções do Carrinho
window.addToCart = function(productId) {
  const product = productsData.find(p => p.id === productId);
  const lowestPrice = getLowestPrice(product);
  const bestStore = product.stores.find(s => s.price === lowestPrice);

  addStoreToCart(productId, bestStore.name, lowestPrice);
};

window.addStoreToCart = function(productId, storeName, price) {
  const product = productsData.find(p => p.id === productId);
  
  const existingItem = cart.find(item => item.id === productId && item.store === storeName);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      image: product.image,
      store: storeName,
      price: price,
      quantity: 1
    });
  }

  compareModal.classList.remove('active');
  updateCartUI();
  toggleCart(true);
};

window.removeFromCart = function(index) {
  cart.splice(index, 1);
  updateCartUI();
};

function updateCartUI() {
  cartBadge.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
  cartItemsContainer.innerHTML = '';

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p style="text-align: center; color: var(--text-muted); margin-top: 40px;">Seu carrinho seguro está vazio.</p>`;
    checkoutBtn.disabled = true;
    cartTotal.textContent = 'R$ 0,00';
    return;
  }

  let total = 0;

  cart.forEach((item, idx) => {
    total += item.price * item.quantity;
    const cartItemEl = document.createElement('div');
    cartItemEl.className = 'cart-item';
    cartItemEl.innerHTML = `
      <img src="${item.image}" alt="${item.title}" class="cart-item-img">
      <div class="cart-item-details">
        <div class="cart-item-title">${item.title}</div>
        <div style="font-size: 0.75rem; color: var(--text-muted);">Loja: ${item.store} (Qtd: ${item.quantity})</div>
        <div class="cart-item-price">R$ ${(item.price * item.quantity).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
        <button class="cart-item-remove" onclick="removeFromCart(${idx})">
          <i class="fa-solid fa-trash"></i> Remover
        </button>
      </div>
    `;
    cartItemsContainer.appendChild(cartItemEl);
  });

  cartTotal.textContent = `R$ ${total.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
  checkoutBtn.disabled = false;
}

function toggleCart(open) {
  if (open) {
    cartDrawer.classList.add('active');
    cartOverlay.classList.add('active');
  } else {
    cartDrawer.classList.remove('active');
    cartOverlay.classList.remove('active');
  }
}

// Configuração de Event Listeners
function setupEventListeners() {
  searchInput.addEventListener('input', renderProducts);
  searchBtn.addEventListener('click', renderProducts);
  sortSelect.addEventListener('change', renderProducts);
  verifiedOnlyCheck.addEventListener('change', renderProducts);

  categoryButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      categoryButtons.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      selectedCategory = e.target.getAttribute('data-cat');
      renderProducts();
    });
  });

  openCartBtn.addEventListener('click', () => toggleCart(true));
  closeCartBtn.addEventListener('click', () => toggleCart(false));
  cartOverlay.addEventListener('click', () => toggleCart(false));
  closeModalBtn.addEventListener('click', () => compareModal.classList.remove('active'));

  checkoutBtn.addEventListener('click', () => {
    alert("Compra realizada com Sucesso! Seu pedido possui garantia total de entrega rastreada.");
    cart = [];
    updateCartUI();
    toggleCart(false);
  });
}

// Iniciar a aplicação
document.addEventListener('DOMContentLoaded', init);