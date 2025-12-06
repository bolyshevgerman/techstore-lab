// script.js для интернет-магазина TechStore - обновленная версия
// Лабораторная работа по SEO

// ==================== Глобальные переменные ====================
const CART_KEY = 'techstore_cart';
const PRODUCTS = [
    {
        id: 1,
        name: 'iPhone 15 Pro',
        price: 89990,
        category: 'smartphones',
        image: 'https://avatars.mds.yandex.net/get-marketpic/12591091/pic47209876819a94ae18176ac038ea8f47/orig',
        description: 'Самый мощный iPhone с процессором A17 Pro'
    },
    {
        id: 2,
        name: 'MacBook Air M2',
        price: 99990,
        category: 'laptops',
        image: 'https://img.tehnomaks.ru/img/prod/full/783c514e777447e4e7c29e29035e9d37616cac3f.jpg',
        description: 'Ультратонкий и мощный ноутбук'
    },
    {
        id: 3,
        name: 'AirPods Pro 2',
        price: 24990,
        category: 'headphones',
        image: 'https://avatars.mds.yandex.net/get-mpic/1554397/2a00000191ddf02b105288dc731601ef5c21/9hq',
        description: 'Лучшее шумоподавление'
    }
];

// ==================== Функции для корзины ====================
class CartManager {
    constructor() {
        this.cart = this.loadCart();
    }

    // Загрузка корзины из localStorage
    loadCart() {
        const cartJson = localStorage.getItem(CART_KEY);
        return cartJson ? JSON.parse(cartJson) : [];
    }

    // Сохранение корзины в localStorage
    saveCart() {
        localStorage.setItem(CART_KEY, JSON.stringify(this.cart));
    }

    // Добавление товара в корзину
    addToCart(productId, quantity = 1) {
        const product = PRODUCTS.find(p => p.id === productId);
        if (!product) {
            console.error('Товар не найден');
            return false;
        }

        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                id: productId,
                name: product.name,
                price: product.price,
                quantity: quantity,
                image: product.image
            });
        }

        this.saveCart();
        this.updateCartCount();
        return true;
    }

    // Удаление товара из корзины
    removeFromCart(productId) {
        // Находим элемент корзины для анимации
        const cartItem = document.querySelector(`.cart-item[data-id="${productId}"]`);
        
        if (cartItem) {
            // Добавляем анимацию исчезновения
            cartItem.style.transition = 'all 0.3s ease';
            cartItem.style.opacity = '0';
            cartItem.style.transform = 'translateX(100px)';
            cartItem.style.maxHeight = '0';
            cartItem.style.padding = '0';
            cartItem.style.margin = '0';
            cartItem.style.overflow = 'hidden';
            
            // Удаляем из массива после анимации
            setTimeout(() => {
                this.cart = this.cart.filter(item => item.id !== productId);
                this.saveCart();
                this.updateCartCount();
                this.displayCart(); // Перерисовываем корзину
                
                // Показываем уведомление
                const product = PRODUCTS.find(p => p.id === productId);
                if (product) {
                    showNotification(`"${product.name}" удален из корзины`, 'info');
                }
            }, 300);
        } else {
            // Если элемент не найден в DOM, просто удаляем из массива
            this.cart = this.cart.filter(item => item.id !== productId);
            this.saveCart();
            this.updateCartCount();
            this.displayCart();
        }
    }

    // Очистка корзины с анимацией
    clearCart() {
        const cartItems = document.querySelectorAll('.cart-item');
        
        if (cartItems.length > 0) {
            // Анимация исчезновения всех элементов
            cartItems.forEach((item, index) => {
                item.style.transition = 'all 0.3s ease';
                item.style.opacity = '0';
                item.style.transform = `translateX(${100 + (index * 20)}px)`;
                item.style.maxHeight = '0';
                item.style.padding = '0';
                item.style.margin = '0';
                item.style.overflow = 'hidden';
            });
            
            // Очищаем массив после анимации
            setTimeout(() => {
                this.cart = [];
                this.saveCart();
                this.updateCartCount();
                this.displayCart();
                showNotification('Корзина очищена', 'info');
            }, 500);
        } else {
            this.cart = [];
            this.saveCart();
            this.updateCartCount();
            this.displayCart();
        }
    }

    // Получение общей суммы корзины
    getTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Обновление счетчика товаров в корзине в шапке сайта
    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'inline-flex' : 'none';
            
            // Анимация обновления счетчика
            cartCount.style.transform = 'scale(1.2)';
            setTimeout(() => {
                cartCount.style.transform = 'scale(1)';
            }, 200);
        }
    }

    // Отображение корзины
    displayCart() {
        const cartContainer = document.getElementById('cart-items');
        if (!cartContainer) return;

        if (this.cart.length === 0) {
            cartContainer.innerHTML = `
                <div class="empty-cart">
                    <p>🛒 Корзина пуста</p>
                    <p>Добавьте товары из каталога</p>
                </div>
            `;
            return;
        }

        let html = '<div class="cart-items-list">';
        this.cart.forEach((item, index) => {
            html += `
                <div class="cart-item" data-id="${item.id}" style="animation: slideIn 0.3s ease ${index * 0.1}s both;">
                    <img src="${item.image}" alt="${item.name}" width="60" height="60" 
                         onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"60\" height=\"60\" viewBox=\"0 0 24 24\"><rect width=\"24\" height=\"24\" fill=\"%23f0f0f0\"/><text x=\"12\" y=\"12\" text-anchor=\"middle\" dy=\".3em\" font-size=\"8\">${item.name.charAt(0)}</text></svg>'">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <div class="cart-item-details">
                            <span class="cart-item-price">${item.price.toLocaleString()} ₽</span>
                            <div class="cart-item-quantity">
                                <button class="quantity-btn minus" onclick="cartManager.updateQuantity(${item.id}, -1)">−</button>
                                <span class="quantity">${item.quantity}</span>
                                <button class="quantity-btn plus" onclick="cartManager.updateQuantity(${item.id}, 1)">+</button>
                            </div>
                            <span class="cart-item-total">${(item.price * item.quantity).toLocaleString()} ₽</span>
                        </div>
                    </div>
                    <button class="remove-from-cart-btn" onclick="cartManager.removeFromCart(${item.id})" title="Удалить">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M18 6L6 18M6 6l12 12" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                </div>
            `;
        });
        
        html += `
            <div class="cart-summary">
                <div class="cart-total">
                    <span>Итого:</span>
                    <strong>${this.getTotal().toLocaleString()} ₽</strong>
                </div>
                <div class="cart-actions">
                    <button onclick="cartManager.clearCart()" class="btn btn-clear">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                        </svg>
                        Очистить корзину
                    </button>
                    <button onclick="checkout()" class="btn btn-checkout">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                        Оформить заказ
                    </button>
                </div>
            </div>
        `;

        cartContainer.innerHTML = html;
    }

    // Обновление количества товара
    updateQuantity(productId, change) {
        const item = this.cart.find(item => item.id === productId);
        if (!item) return;

        const newQuantity = item.quantity + change;
        if (newQuantity < 1) {
            this.removeFromCart(productId);
            return;
        }

        item.quantity = newQuantity;
        this.saveCart();
        this.updateCartCount();
        this.displayCart();
        
        // Анимация обновления количества
        const quantityElement = document.querySelector(`.cart-item[data-id="${productId}"] .quantity`);
        if (quantityElement) {
            quantityElement.style.transform = 'scale(1.3)';
            setTimeout(() => {
                quantityElement.style.transform = 'scale(1)';
            }, 200);
        }
    }
}

// Создаем глобальный экземпляр менеджера корзины
const cartManager = new CartManager();

// ==================== Основные функции магазина ====================

// Инициализация магазина
function initStore() {
    console.log('TechStore инициализирован');
    
    // Обновляем счетчик корзины
    cartManager.updateCartCount();
    
    // Добавляем обработчики событий
    setupEventListeners();
    
    // Добавляем стили
    addCartStyles();
}

// Оформление заказа
function checkout() {
    if (cartManager.cart.length === 0) {
        showNotification('Корзина пуста! Добавьте товары перед оформлением заказа.', 'error');
        return;
    }
    
    const total = cartManager.getTotal();
    const itemCount = cartManager.cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Создаем модальное окно подтверждения
    const modalHtml = `
        <div id="checkout-modal" class="checkout-modal">
            <div class="checkout-modal-content">
                <h2>Подтверждение заказа</h2>
                <p>Вы оформляете заказ на <strong>${itemCount}</strong> товар(ов) на сумму:</p>
                <p class="checkout-total">${total.toLocaleString()} ₽</p>
                <div class="checkout-form">
                    <input type="text" id="checkout-name" placeholder="Ваше имя" required>
                    <input type="tel" id="checkout-phone" placeholder="Телефон" required>
                    <input type="email" id="checkout-email" placeholder="Email" required>
                </div>
                <div class="checkout-actions">
                    <button onclick="closeCheckoutModal()" class="btn btn-cancel">Отмена</button>
                    <button onclick="confirmOrder()" class="btn btn-confirm">Подтвердить заказ</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Анимация появления
    setTimeout(() => {
        document.getElementById('checkout-modal').style.opacity = '1';
        document.getElementById('checkout-name').focus();
    }, 10);
}

// Подтверждение заказа
function confirmOrder() {
    const name = document.getElementById('checkout-name').value.trim();
    const phone = document.getElementById('checkout-phone').value.trim();
    const email = document.getElementById('checkout-email').value.trim();
    
    if (!name || !phone || !email) {
        showNotification('Заполните все поля формы!', 'error');
        return;
    }
    
    // В реальном проекте здесь была бы отправка данных на сервер
    const orderData = {
        items: cartManager.cart,
        total: cartManager.getTotal(),
        customer: { name, phone, email },
        date: new Date().toISOString(),
        orderId: 'ORD-' + Date.now()
    };
    
    console.log('Заказ оформлен:', orderData);
    
    // Сохраняем историю заказов
    const orders = JSON.parse(localStorage.getItem('techstore_orders') || '[]');
    orders.push(orderData);
    localStorage.setItem('techstore_orders', JSON.stringify(orders));
    
    // Показываем подтверждение
    showNotification(`Заказ #${orderData.orderId} успешно оформлен! С вами свяжется менеджер.`, 'success');
    
    // Закрываем модальные окна
    closeCheckoutModal();
    closeCartModal();
    
    // Очищаем корзину с задержкой
    setTimeout(() => {
        cartManager.clearCart();
    }, 2000);
}

// Закрытие модального окна оформления заказа
function closeCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => modal.remove(), 300);
    }
}

// Закрытие модального окна корзины
function closeCartModal() {
    const modal = document.getElementById('cart-modal');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
            modal.style.opacity = '1';
        }, 300);
    }
}

// ==================== Вспомогательные функции ====================

// Показать уведомление
function showNotification(message, type = 'info') {
    // Удаляем старое уведомление, если есть
    const oldNotification = document.querySelector('.notification');
    if (oldNotification) {
        oldNotification.style.opacity = '0';
        setTimeout(() => oldNotification.remove(), 300);
    }
    
    // Создаем новое уведомление
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-icon">
            ${type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️'}
        </div>
        <span class="notification-text">${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Автоматическое удаление через 4 секунды
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 4000);
}

// ==================== Обработчики событий ====================
function setupEventListeners() {
    // Обработчик для всех кнопок "Добавить в корзину"
    document.addEventListener('click', function(e) {
        const addToCartBtn = e.target.closest('.add-to-cart');
        if (addToCartBtn) {
            e.preventDefault();
            
            const productId = parseInt(addToCartBtn.dataset.id);
            const productName = addToCartBtn.dataset.name || 'Товар';
            
            // Анимация кнопки
            addToCartBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                addToCartBtn.style.transform = 'scale(1)';
            }, 200);
            
            // Добавляем в корзину
            cartManager.addToCart(productId);
            showNotification(`"${productName}" добавлен в корзину!`, 'success');
        }
    });
    
    // Модальное окно корзины
    const cartModal = document.getElementById('cart-modal');
    const openCartBtn = document.getElementById('open-cart');
    const closeCartBtn = document.querySelector('.close-cart');
    
    if (openCartBtn) {
        openCartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            cartManager.displayCart();
            cartModal.style.display = 'block';
            setTimeout(() => {
                cartModal.style.opacity = '1';
            }, 10);
        });
    }
    
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', function() {
            closeCartModal();
        });
    }
    
    // Закрытие модального окна при клике вне его
    if (cartModal) {
        window.addEventListener('click', function(e) {
            if (e.target === cartModal) {
                closeCartModal();
            }
        });
    }
    
    // Закрытие при нажатии ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeCartModal();
            closeCheckoutModal();
        }
    });
}

// ==================== CSS стили ====================
function addCartStyles() {
    const styles = `
        /* Стили для корзины */
        .cart-count {
            background: #ff4444;
            color: white;
            border-radius: 50%;
            width: 22px;
            height: 22px;
            font-size: 12px;
            display: none;
            align-items: center;
            justify-content: center;
            margin-left: 5px;
            vertical-align: top;
            transition: transform 0.2s ease;
        }
        
        /* Элемент корзины */
        .cart-item {
            display: flex;
            align-items: center;
            padding: 15px;
            border-bottom: 1px solid #eee;
            gap: 15px;
            transition: all 0.3s ease;
            animation: slideIn 0.3s ease;
            opacity: 1;
            transform: translateX(0);
            max-height: 100px;
            overflow: hidden;
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(-20px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        .cart-item img {
            border-radius: 8px;
            object-fit: cover;
            border: 1px solid #eee;
        }
        
        .cart-item-info {
            flex-grow: 1;
        }
        
        .cart-item-info h4 {
            margin: 0 0 8px 0;
            font-size: 16px;
            color: #333;
        }
        
        .cart-item-details {
            display: flex;
            align-items: center;
            gap: 15px;
            flex-wrap: wrap;
        }
        
        .cart-item-price {
            color: #666;
            font-size: 14px;
        }
        
        .cart-item-total {
            font-weight: bold;
            color: #d32f2f;
        }
        
        .cart-item-quantity {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .quantity-btn {
            width: 28px;
            height: 28px;
            border: 1px solid #ddd;
            background: white;
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            transition: all 0.2s;
        }
        
        .quantity-btn:hover {
            background: #f5f5f5;
            border-color: #0071e3;
        }
        
        .quantity {
            min-width: 30px;
            text-align: center;
            font-weight: bold;
            transition: transform 0.2s;
        }
        
        /* Кнопка удаления */
        .remove-from-cart-btn {
            background: none;
            border: none;
            color: #999;
            cursor: pointer;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }
        
        .remove-from-cart-btn:hover {
            background: #ffebee;
            color: #f44336;
            transform: rotate(90deg);
        }
        
        /* Итоговая сумма */
        .cart-summary {
            padding: 20px 0;
        }
        
        .cart-total {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 18px;
        }
        
        .cart-total strong {
            color: #d32f2f;
            font-size: 24px;
        }
        
        /* Кнопки действий */
        .cart-actions {
            display: flex;
            gap: 10px;
            justify-content: space-between;
        }
        
        .btn {
            padding: 12px 20px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: all 0.2s;
        }
        
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .btn:active {
            transform: translateY(0);
        }
        
        .btn-clear {
            background: #f5f5f5;
            color: #666;
            border: 1px solid #ddd;
        }
        
        .btn-clear:hover {
            background: #eee;
            color: #333;
        }
        
        .btn-checkout {
            background: linear-gradient(135deg, #1d2671, #c33764);
            color: white;
            flex-grow: 1;
        }
        
        .btn-checkout:hover {
            background: linear-gradient(135deg, #17235c, #a82c55);
        }
        
        .btn-secondary {
            background: #666;
            color: white;
        }
        
        .btn-secondary:hover {
            background: #555;
        }
        
        .empty-cart {
            text-align: center;
            padding: 40px 20px;
            color: #666;
        }
        
        .empty-cart p:first-child {
            font-size: 24px;
            margin-bottom: 10px;
        }
        
        /* Модальное окно корзины */
        .cart-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .cart-modal-content {
            background: white;
            margin: 50px auto;
            padding: 25px;
            width: 95%;
            max-width: 500px;
            border-radius: 12px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            transform: translateY(-20px);
            animation: modalSlideIn 0.3s ease forwards;
        }
        
        @keyframes modalSlideIn {
            to {
                transform: translateY(0);
            }
        }
        
        .cart-modal-content h2 {
            margin: 0 0 20px 0;
            color: #333;
        }
        
        .close-cart {
            position: absolute;
            top: 15px;
            right: 20px;
            font-size: 32px;
            cursor: pointer;
            color: #999;
            background: none;
            border: none;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.2s;
        }
        
        .close-cart:hover {
            color: #333;
            background: #f5f5f5;
        }
        
        /* Уведомления */
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.15);
            z-index: 1001;
            display: flex;
            align-items: center;
            gap: 12px;
            max-width: 400px;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s ease;
            border-left: 4px solid #2196F3;
        }
        
        .notification-success {
            border-left-color: #4CAF50;
        }
        
        .notification-error {
            border-left-color: #f44336;
        }
        
        .notification-icon {
            font-size: 20px;
        }
        
        .notification-text {
            flex-grow: 1;
            font-size: 14px;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: #999;
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            line-height: 1;
        }
        
        .notification-close:hover {
            color: #333;
        }
        
        /* Модальное окно оформления заказа */
        .checkout-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 1002;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .checkout-modal-content {
            background: white;
            padding: 30px;
            border-radius: 12px;
            width: 95%;
            max-width: 400px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            transform: translateY(-20px);
            animation: modalSlideIn 0.3s ease forwards;
        }
        
        .checkout-modal h2 {
            margin: 0 0 20px 0;
            text-align: center;
        }
        
        .checkout-total {
            font-size: 32px;
            font-weight: bold;
            color: #d32f2f;
            text-align: center;
            margin: 20px 0;
        }
        
        .checkout-form {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin: 20px 0;
        }
        
        .checkout-form input {
            padding: 12px 15px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
            transition: border-color 0.2s;
        }
        
        .checkout-form input:focus {
            outline: none;
            border-color: #0071e3;
            box-shadow: 0 0 0 2px rgba(0,113,227,0.2);
        }
        
        .checkout-actions {
            display: flex;
            gap: 10px;
            margin-top: 20px;
        }
        
        .btn-cancel {
            background: #f5f5f5;
            color: #666;
            border: 1px solid #ddd;
            flex: 1;
        }
        
        .btn-confirm {
            background: linear-gradient(135deg, #1d2671, #c33764);
            color: white;
            flex: 2;
        }
        
        /* Анимации */
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .product {
            animation: fadeIn 0.5s ease;
        }
    `;
    
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
}

// ==================== Инициализация при загрузке ====================
document.addEventListener('DOMContentLoaded', function() {
    // Инициализируем магазин
    initStore();
    
    console.log('TechStore JavaScript загружен');
    console.log('Товаров в базе:', PRODUCTS.length);
    console.log('Товаров в корзине:', cartManager.cart.length);
});

// ==================== Экспорт для использования в консоли ====================
window.cartManager = cartManager;
window.showNotification = showNotification;
window.checkout = checkout;
window.closeCheckoutModal = closeCheckoutModal;
window.closeCartModal = closeCartModal;
