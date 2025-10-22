// Simple Cart System for Muskan Medicare - Matches cart.html expectations
class Cart {
    constructor() {
        this.cartKey = 'cartItems';
        this.items = [];
        this.init();
    }

    init() {
        console.log('🚀 Simple Cart system initializing...');
        this.loadCart();
        this.updateCartCount();
        this.setupEventListeners();
        
        // Render cart if on cart page
        if (document.getElementById('cartItems')) {
            this.renderCart();
        }
    }

    loadCart() {
        try {
            const saved = localStorage.getItem(this.cartKey);
            this.items = saved ? JSON.parse(saved) : [];
            
            // Clean invalid items
            this.items = this.items.filter(item => 
                item && item.id && item.name && 
                typeof item.price === 'number' && 
                typeof item.quantity === 'number' && 
                item.quantity > 0
            );
            
            console.log('📦 Loaded', this.items.length, 'cart items');
        } catch (error) {
            console.error('❌ Error loading cart:', error);
            this.items = [];
        }
    }

    saveCart() {
        try {
            localStorage.setItem(this.cartKey, JSON.stringify(this.items));
            this.updateCartCount();
            console.log('💾 Cart saved with', this.items.length, 'items');
            
            // Trigger navbar updates
            this.updateAllCartCounts();
        } catch (error) {
            console.error('❌ Error saving cart:', error);
        }
    }

    updateAllCartCounts() {
        const count = this.getItemCount();
        
        // Update all possible cart count elements
        const selectors = [
            '#cartCount',
            '#mobileCartCount',
            '.cart-count', 
            '.navbar .badge',
            '.nav-link .badge',
            '#floatingCartCount',
            '.floating-cart-count',
            '[data-cart-count]'
        ];
        
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.textContent = count;
                el.innerText = count;
                el.innerHTML = count;
                el.style.display = count > 0 ? 'inline-block' : 'none';
            });
        });
        
        // Dispatch event for other scripts
        window.dispatchEvent(new CustomEvent('cartUpdated', {
            detail: { count: count, items: this.items }
        }));
        
        window.dispatchEvent(new CustomEvent('cartCountUpdated', {
            detail: { count: count }
        }));
        
        console.log('🔢 Cart count updated to:', count);
    }

    addItem(product, quantity = 1) {
        console.log('Adding item:', product.name, 'quantity:', quantity);
        
        const existingIndex = this.items.findIndex(item => item.id === product.id);
        
        if (existingIndex > -1) {
            this.items[existingIndex].quantity += quantity;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: parseFloat(product.price),
                batch: product.batch || 'N/A',
                quantity: quantity
            });
        }
        
        this.saveCart();
        this.renderCart();
        this.showMessage(`${product.name} added to cart!`, 'success');
    }

    removeItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.saveCart();
        this.renderCart();
        this.showMessage('Item removed from cart', 'info');
    }

    updateQuantity(id, quantity) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(id);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.renderCart();
            }
        }
    }

    updateCartCount() {
        this.updateAllCartCounts();
    }

    renderCart() {
        const cartItemsContainer = document.getElementById('cartItems');
        const emptyMessage = document.getElementById('emptyCartMessage');
        const checkoutBtn = document.getElementById('checkoutBtn');
        
        if (!cartItemsContainer) {
            console.log('Cart items container not found - not on cart page');
            return;
        }

        console.log('Rendering cart with', this.items.length, 'items');

        if (this.items.length === 0) {
            cartItemsContainer.style.display = 'none';
            if (emptyMessage) emptyMessage.style.display = 'block';
            if (checkoutBtn) {
                checkoutBtn.disabled = true;
                console.log('Checkout button disabled - cart is empty');
            }
        } else {
            cartItemsContainer.style.display = 'block';
            if (emptyMessage) emptyMessage.style.display = 'none';
            if (checkoutBtn) {
                checkoutBtn.disabled = false;
                console.log('Checkout button enabled - cart has', this.items.length, 'items');
            }
            
            cartItemsContainer.innerHTML = this.items.map(item => `
                <div class="cart-item d-flex align-items-center mb-2 p-2 border rounded">
                    <div class="flex-grow-1">
                        <h6 class="mb-1 fw-bold">${item.name}</h6>
                        <small class="text-muted">Batch: ${item.batch}</small>
                        <div class="fw-bold text-primary">₹${item.price.toFixed(2)}</div>
                    </div>
                    <div class="d-flex align-items-center me-3">
                        <button class="btn btn-sm btn-outline-secondary me-1" 
                                onclick="window.cart.updateQuantity('${item.id}', ${item.quantity - 1})"
                                style="width: 32px; height: 32px; padding: 0;">-</button>
                        <span class="mx-2 fw-bold">${item.quantity}</span>
                        <button class="btn btn-sm btn-outline-secondary ms-1"
                                onclick="window.cart.updateQuantity('${item.id}', ${item.quantity + 1})"
                                style="width: 32px; height: 32px; padding: 0;">+</button>
                    </div>
                    <div class="me-3 fw-bold">₹${(item.price * item.quantity).toFixed(2)}</div>
                    <button class="btn btn-sm btn-outline-danger"
                            onclick="window.cart.removeItem('${item.id}')"
                            style="width: 32px; height: 32px; padding: 0;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `).join('');
        }
        
        this.updateSummary();
    }

    updateSummary() {
        const subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal >= 2000 ? 0 : 299;
        const total = subtotal + shipping;

        const elements = {
            subtotalAmount: document.getElementById('subtotalAmount'),
            shippingAmount: document.getElementById('shippingAmount'),
            totalAmount: document.getElementById('totalAmount')
        };

        if (elements.subtotalAmount) elements.subtotalAmount.textContent = `₹${subtotal.toFixed(2)}`;
        if (elements.shippingAmount) elements.shippingAmount.textContent = shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`;
        if (elements.totalAmount) elements.totalAmount.textContent = `₹${total.toFixed(2)}`;
    }

    showMessage(message, type = 'success') {
        console.log(`${type.toUpperCase()}: ${message}`);
        
        // Try to show bootstrap toast
        const toastElement = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        
        if (toastElement && toastMessage) {
            toastMessage.textContent = message;
            toastElement.className = `toast show bg-${type === 'success' ? 'success' : 'info'} text-white`;
            
            setTimeout(() => {
                toastElement.classList.add('hide');
            }, 3000);
        }
    }

    setupEventListeners() {
        // Listen for storage changes from other tabs
        window.addEventListener('storage', (e) => {
            if (e.key === this.cartKey) {
                this.loadCart();
                this.renderCart();
            }
        });
    }

    getItems() {
        return [...this.items];
    }

    getItemCount() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    clear() {
        this.items = [];
        this.saveCart();
        this.renderCart();
    }
}

// Global functions for easy integration
function addToCart(product, quantity = 1) {
    if (window.cart) {
        window.cart.addItem(product, quantity);
    } else {
        console.error('Cart not initialized');
    }
}

// Global checkout function
function checkout() {
    console.log('Checkout function called');
    if (window.cart && window.cart.getItemCount() > 0) {
        console.log('Cart has items, proceeding to checkout...');
        window.location.href = 'checkout.html';
    } else {
        console.log('Cart is empty');
        alert('Your cart is empty. Please add some products before checkout.');
    }
}

// Make checkout available globally
window.checkout = checkout;

// Test function to add sample items for debugging
function addTestItem() {
    const testProduct = {
        id: 'test-' + Date.now(),
        name: 'Test Product',
        price: 100,
        batch: 'TEST001'
    };
    addToCart(testProduct, 1);
    console.log('Test item added to cart');
}

// Function to add sample medical items for testing
function addSampleMedicalItems() {
    const sampleItems = [
        {
            id: 'med-001',
            name: 'Paracetamol 500mg (Strip of 10)',
            price: 25.00,
            batch: 'PAR001'
        },
        {
            id: 'med-002', 
            name: 'Vitamin D3 Tablets (30 caps)',
            price: 450.00,
            batch: 'VIT002'
        },
        {
            id: 'med-003',
            name: 'Antiseptic Liquid 100ml',
            price: 120.00,
            batch: 'ANT003'
        }
    ];
    
    sampleItems.forEach(item => {
        addToCart(item, Math.floor(Math.random() * 3) + 1); // Random quantity 1-3
    });
    
    console.log('Sample medical items added to cart');
}

// Make test functions available globally
window.addTestItem = addTestItem;
window.addSampleMedicalItems = addSampleMedicalItems;

// Initialize cart when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Initializing simple cart...');
    window.cart = new Cart();
    console.log('✅ Simple cart initialized successfully');
});

console.log('✅ Simple cart system script loaded');
