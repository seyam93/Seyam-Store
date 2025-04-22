// utils.js

// Update cart item count badge in navbar
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCount = document.getElementById("cart-count");
    if (cartCount) {
        cartCount.textContent = count;
    }
}

// Get cart items as array
function getCartItems() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

// Save updated cart to localStorage
function saveCartItems(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Add product to cart (with quantity)
function addToCart(product, quantity = 1) {
    const cart = getCartItems();
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({ ...product, quantity });
    }

    saveCartItems(cart);
    updateCartCount();
}

// Show a temporary toast message
function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "cart-toast";
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Run updateCartCount on load if badge exists
document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
});
