/* ========================================
   SELECT ELEMENTS
======================================== */

const loading = document.getElementById("loading");
const errorMessage = document.getElementById("error-message");

const productContainer = document.getElementById("product-container");

const productCategory = document.getElementById("product-category");
const productImage = document.getElementById("product-image");
const productTitle = document.getElementById("product-title");
const productPrice = document.getElementById("product-price");
const productDescription = document.getElementById("product-description");

const addCartBtn = document.getElementById("add-cart-btn");
const cartCount = document.getElementById("cart-count");

const menuBtn = document.getElementById("menu-btn");
const mobileNav = document.getElementById("mobile-nav");

/* ========================================
   API (FAKESTORE)
======================================== */

const API_URL = "https://fakestoreapi.com/products";

/* ========================================
   GET PRODUCT ID
======================================== */

const productId = localStorage.getItem("selectedProductId");

/* ========================================
   CURRENT PRODUCT
======================================== */

let currentProduct = null;

/* ========================================
   LOAD PRODUCT
======================================== */

async function loadProduct() {
  if (!productId) {
    errorMessage.style.display = "block";
    errorMessage.textContent = "No product selected.";

    loading.style.display = "none";
    productContainer.style.display = "none";
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${productId}`);

    if (!response.ok) {
      throw new Error("Unable to load product.");
    }

    const product = await response.json();

    currentProduct = product;

    /* ===== FIXED FOR FAKESTORE ===== */

    productImage.src =
      product.image || "https://via.placeholder.com/500x500?text=No+Image";

    productImage.onerror = function () {
      this.src = "https://via.placeholder.com/500x500?text=No+Image";
    };

    productCategory.textContent = product.category || "Unknown";

    productTitle.textContent = product.title || "No title";

    productPrice.textContent = `$${product.price ?? 0}`;

    productDescription.textContent =
      product.description || "No description available.";

    /* ===== SHOW PRODUCT ===== */

    loading.style.display = "none";
    productContainer.style.display = "grid";
  } catch (error) {
    console.error(error);

    loading.style.display = "none";

    errorMessage.style.display = "block";
    errorMessage.textContent = "Unable to load product.";
  }
}

/* ========================================
   ADD TO CART
======================================== */

if (addCartBtn) {
  addCartBtn.addEventListener("click", () => {
    if (!currentProduct) return;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find((item) => item.id === currentProduct.id);

    if (existing) {
      existing.quantity++;
    } else {
      cart.push({
        id: currentProduct.id,
        title: currentProduct.title,
        price: currentProduct.price,
        thumbnail: currentProduct.image || "https://via.placeholder.com/300",
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

    /* UX IMPROVEMENT */
    addCartBtn.textContent = "Added!";
    setTimeout(() => {
      addCartBtn.textContent = "Add to Cart";
    }, 1500);

    // Optional toast (same as homepage)
    showMessage(`${currentProduct.title} added to cart`);
  });
}

/* ========================================
   CART COUNT
======================================== */

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const total = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cartCount) {
    cartCount.textContent = total;
  }
}

/* ========================================
   MOBILE MENU
======================================== */

if (menuBtn && mobileNav) {
  menuBtn.addEventListener("click", () => {
    mobileNav.classList.toggle("show");
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("show");
    });
  });
}
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
   START
======================================== */

updateCartCount();
loadProduct();
