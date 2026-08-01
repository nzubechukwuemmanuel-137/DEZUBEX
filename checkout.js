/* ========================================
   DEZUBBEX CHECKOUT JAVASCRIPT
======================================== */

const checkoutItems = document.getElementById("checkout-items");
const subtotal = document.getElementById("subtotal");
const total = document.getElementById("total");
const checkoutForm = document.getElementById("checkout-form");
const checkbox = document.getElementById("different-shipping");

const shippingSection = document.getElementById("shipping-section");
checkbox.addEventListener("change", () => {
  shippingSection.style.display = checkbox.checked ? "block" : "none";
});

// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* ========================================
   TOAST MESSAGE (NO ALERT POPUPS)
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
   DISPLAY ORDER SUMMARY
======================================== */

function displayCheckout() {
  checkoutItems.innerHTML = "";

  if (cart.length === 0) {
    checkoutItems.innerHTML = `<p>Your cart is empty.</p>`;

    subtotal.textContent = "$0.00";
    total.textContent = "$0.00";

    return;
  }

  let grandTotal = 0;

  cart.forEach((item) => {
    const quantity = item.quantity || 1;
    const itemTotal = item.price * quantity;

    grandTotal += itemTotal;

    checkoutItems.innerHTML += `
      <div class="checkout-item">

        <img src="${item.thumbnail}" alt="${item.title}">

        <div class="checkout-info">
          <h4>${item.title}</h4>
          <p>$${item.price.toFixed(2)} × ${quantity}</p>
        </div>

        <strong>$${itemTotal.toFixed(2)}</strong>

      </div>
    `;
  });

  subtotal.textContent = `$${grandTotal.toFixed(2)}`;
  total.textContent = `$${grandTotal.toFixed(2)}`;
}

displayCheckout();

/* ========================================
   PLACE ORDER (NO ALERT)
======================================== */

checkoutForm.addEventListener("submit", function (e) {
  e.preventDefault();

  if (cart.length === 0) {
    showMessage("Your cart is empty.");
    return;
  }

  showMessage("🎉 Order placed successfully!");

  // Clear cart
  localStorage.removeItem("cart");
  cart = [];

  setTimeout(() => {
    window.location.href = "index.html";
  }, 1500);
});
