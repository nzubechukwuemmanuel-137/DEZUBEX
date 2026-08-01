/* ========================================
   DEZUBBEX CART JAVASCRIPT
======================================== */

/* ========================================
   SELECT ELEMENTS
======================================== */

const cartItems = document.getElementById("cart-items");
const emptyCart = document.getElementById("empty-cart");
const totalItems = document.getElementById("total-items");
const subtotal = document.getElementById("subtotal");
const totalPrice = document.getElementById("total-price");
const cartCount = document.getElementById("cart-count");
const menuBtn = document.getElementById("menu-btn");
const mobileNav = document.getElementById("mobile-nav");
const checkoutBtn = document.getElementById("checkout-btn");
const clearCartBtn = document.getElementById("clear-cart-btn");

/* ========================================
   TOAST MESSAGE (NO POPUPS)
======================================== */

function showMessage(text) {
  let message = document.getElementById("toast-message");

  if (!message) {
    message = document.createElement("div");
    message.id = "toast-message";
    message.style.position = "fixed";
    message.style.bottom = "20px";
    message.style.right = "20px";
    message.style.padding = "12px 18px";
    message.style.background = "#222";
    message.style.color = "#fff";
    message.style.borderRadius = "6px";
    message.style.fontSize = "14px";
    message.style.zIndex = "9999";
    message.style.transition = "opacity 0.3s ease";
    document.body.appendChild(message);
  }

  message.textContent = text;
  message.style.opacity = "1";

  setTimeout(() => {
    message.style.opacity = "0";
  }, 2000);
}

/* ========================================
   GET CART
======================================== */

let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* ========================================
   DISPLAY CART
======================================== */

function displayCart() {
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    emptyCart.style.display = "block";
    cartItems.style.display = "none";

    updateSummary();
    return;
  }

  emptyCart.style.display = "none";
  cartItems.style.display = "flex";

  cart.forEach((item) => {
    const quantity = item.quantity || 1;

    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");

    cartItem.innerHTML = `
      <img src="${item.thumbnail}" alt="${item.title}">

      <div class="cart-item-info">
        <h3>${item.title}</h3>

        <p class="cart-item-price">
          $${item.price.toFixed(2)}
        </p>

        <div class="quantity-box">
          <button class="quantity-btn minus-btn">-</button>
          <span class="quantity">${quantity}</span>
          <button class="quantity-btn plus-btn">+</button>
        </div>
      </div>

      <button class="remove-btn" title="Remove Item">🗑️</button>
    `;

    // BUTTON EVENTS (NO INLINE JS)
    cartItem.querySelector(".plus-btn").addEventListener("click", () => {
      changeQuantity(item.id, "plus");
    });

    cartItem.querySelector(".minus-btn").addEventListener("click", () => {
      changeQuantity(item.id, "minus");
    });

    cartItem.querySelector(".remove-btn").addEventListener("click", () => {
      removeItem(item.id);
    });

    cartItems.appendChild(cartItem);
  });

  updateSummary();
}

/* ========================================
   CHANGE QUANTITY
======================================== */

function changeQuantity(id, action) {
  const item = cart.find((product) => product.id === id);
  if (!item) return;

  item.quantity = item.quantity || 1;

  if (action === "plus") item.quantity++;
  if (action === "minus") item.quantity--;

  if (item.quantity <= 0) {
    cart = cart.filter((product) => product.id !== id);
    showMessage("Item removed");
  }

  saveCart();
}

/* ========================================
   REMOVE ITEM (NO CONFIRM POPUP)
======================================== */

function removeItem(id) {
  cart = cart.filter((item) => item.id !== id);
  showMessage("Item removed from cart");

  saveCart();
}

/* ========================================
   CLEAR CART (NO CONFIRM)
======================================== */

function clearCart() {
  if (cart.length === 0) {
    showMessage("Cart is already empty");
    return;
  }

  cart = [];
  showMessage("Cart cleared");

  saveCart();
}

/* ========================================
   SAVE CART
======================================== */

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

/* ========================================
   UPDATE SUMMARY
======================================== */

function updateSummary() {
  const items = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const price = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0,
  );

  totalItems.textContent = items;
  subtotal.textContent = `$${price.toFixed(2)}`;
  totalPrice.textContent = `$${price.toFixed(2)}`;
  cartCount.textContent = items;
}

/* ========================================
   BUTTON EVENTS
======================================== */

if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    window.location.href = "checkout.html";
  });
}

if (clearCartBtn) {
  clearCartBtn.addEventListener("click", clearCart);
}

/* ========================================
   MOBILE MENU
======================================== */

if (menuBtn && mobileNav) {
  menuBtn.addEventListener("click", (event) => {
    event.stopPropagation();

    mobileNav.classList.toggle("show");

    menuBtn.setAttribute("aria-expanded", mobileNav.classList.contains("show"));
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("show");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", (event) => {
    if (!mobileNav.contains(event.target) && !menuBtn.contains(event.target)) {
      mobileNav.classList.remove("show");
      menuBtn.setAttribute("aria-expanded", "false");
    }
  });
}

/* ========================================
   START
======================================== */

displayCart();
