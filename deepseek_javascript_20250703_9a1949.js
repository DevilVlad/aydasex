const tg = window.Telegram.WebApp;
tg.expand();

const API_URL = "https://script.google.com/macros/s/ВАШ_SCRIPT_ID/exec";
let cart = {};

// Загрузка товаров
async function loadProducts() {
  const response = await fetch(API_URL);
  const products = await response.json();
  
  const container = document.getElementById('products');
  container.innerHTML = products.map(product => `
    <div class="product">
      <img src="${product.image || 'https://via.placeholder.com/150'}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.price} ₽</p>
      <button onclick="addToCart(${product.id})">В корзину</button>
    </div>
  `).join('');
}

// Добавление в корзину
function addToCart(productId) {
  if (!cart[productId]) cart[productId] = 0;
  cart[productId] += 1;
  tg.HapticFeedback.impactOccurred('light');
  tg.showAlert(`Товар добавлен!`);
  updateCartButton();
}

// Обновление кнопки корзины
function updateCartButton() {
  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  
  if (totalItems > 0) {
    tg.MainButton.setText(`Корзина (${totalItems})`);
    tg.MainButton.show();
  } else {
    tg.MainButton.hide();
  }
}

// Отправка заказа
tg.MainButton.onClick(() => {
  tg.sendData(JSON.stringify({
    user: tg.initDataUnsafe.user,
    cart: cart
  }));
});

// Инициализация
tg.MainButton.setText("Корзина");
loadProducts();