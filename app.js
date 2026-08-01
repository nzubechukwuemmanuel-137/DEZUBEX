/* ========================================
   DEZUBBEX - HOMEPAGE JAVASCRIPT
======================================== */

/* ========================================
   SELECT HTML ELEMENTS
======================================== */

const productGrid = document.getElementById("product-grid");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("error-message");

const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");

const cartCount = document.getElementById("cart-count");

const menuBtn = document.getElementById("menu-btn");
const mobileNav = document.getElementById("mobile-nav");

const categoryButtons = document.querySelectorAll(".category-card");

/* ========================================
   API URL
======================================== */

const API_URL = "https://fakestoreapi.com/products";

/* ========================================
   STORE PRODUCTS
======================================== */

let allProducts = [];

/* ========================================
   FETCH PRODUCTS FROM API
======================================== */

async function fetchProducts() {
  try {
    loading.style.display = "block";
    errorMessage.style.display = "none";

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Failed to fetch products.");
    }

    const data = await response.json();

    allProducts = data;

    // FakeStore has ~20 products → show all
    displayProducts(allProducts);
  } catch (error) {
    console.error(error);

    loading.style.display = "none";

    errorMessage.textContent =
      "Unable to load products. Please check your internet connection and try again.";

    errorMessage.style.display = "block";
  }
}

/* ========================================
   DISPLAY PRODUCTS
======================================== */

function displayProducts(products) {
  productGrid.innerHTML = "";
  loading.style.display = "none";

  if (products.length === 0) {
    productGrid.innerHTML = `
      <p class="no-products">No products found.</p>
    `;
    return;
  }

  products.forEach((product) => {
    const productCard = document.createElement("article");
    productCard.classList.add("product-card");

    const img =
      product.image || "https://via.placeholder.com/300x300?text=No+Image";

    productCard.innerHTML = `
      <img
        src="${img}"
        alt="${product.title}"
        class="product-image"
        loading="lazy"
        onerror="this.src='https://via.placeholder.com/300x300?text=No+Image'"
      >

      <div class="product-info">

        <p class="product-category">
          ${product.category}
        </p>

        <h3 class="product-title">
          ${product.title}
        </h3>

        <p class="product-price">
          $${product.price}
        </p>

        <div class="product-buttons">

          <button
            class="view-product-btn"
            onclick="viewProduct(${product.id})"
          >
            View Product
          </button>

          <button
            class="add-cart-btn"
            onclick="addToCart(${product.id})"
          >
            Add to Cart
          </button>

        </div>

      </div>
    `;

    productGrid.appendChild(productCard);
  });
}

/* ========================================
   VIEW PRODUCT
======================================== */

function viewProduct(productId) {
  localStorage.setItem("selectedProductId", productId);
  window.location.href = "product.html";
}

/* ========================================
   ADD PRODUCT TO CART
======================================== */

function addToCart(productId) {
  const product = allProducts.find((item) => item.id === productId);

  if (!product) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existingProduct = cart.find((item) => item.id === productId);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail:
        product.image || "https://via.placeholder.com/300x300?text=No+Image",
      quantity: 1,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  updateCartCount();

  // ✅ NO POPUP — smooth feedback instead
  showMessage(`${product.title} added to cart`);
}

/* ========================================
   UPDATE CART COUNT
======================================== */

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  cartCount.textContent = totalItems;
}

/* ========================================
   SEARCH PRODUCTS
======================================== */

function searchProducts() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  if (searchTerm === "") {
    displayProducts(allProducts);
    return;
  }

  const filteredProducts = allProducts.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm),
  );

  displayProducts(filteredProducts);
}

/* ========================================
   SEARCH EVENTS
======================================== */

searchBtn.addEventListener("click", searchProducts);

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    searchProducts();
  }
});

searchInput.addEventListener("input", searchProducts);

/* ========================================
   CATEGORY FILTER
======================================== */

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.category;

    const filteredProducts = allProducts.filter(
      (product) => product.category.toLowerCase() === category.toLowerCase(),
    );

    displayProducts(filteredProducts);

    document.getElementById("products").scrollIntoView({
      behavior: "smooth",
    });
  });
});

/* ========================================
   MOBILE MENU
======================================== */

menuBtn.addEventListener("click", (event) => {
  event.stopPropagation();

  mobileNav.classList.toggle("show");

  menuBtn.setAttribute("aria-expanded", mobileNav.classList.contains("show"));
});

/* ========================================
   CLOSE MOBILE MENU WHEN LINK CLICKED
======================================== */

const mobileLinks = mobileNav.querySelectorAll("a");

mobileLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mobileNav.classList.remove("show");
    menuBtn.setAttribute("aria-expanded", "false");
  });
});

/* ========================================
   CLOSE MENU WHEN CLICKING OUTSIDE
======================================== */

document.addEventListener("click", (event) => {
  if (!mobileNav.contains(event.target) && !menuBtn.contains(event.target)) {
    mobileNav.classList.remove("show");
    menuBtn.setAttribute("aria-expanded", "false");
  }
});
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
    document.body.appendChild(message);
  }

  message.textContent = text;
  message.style.opacity = "1";

  setTimeout(() => {
    message.style.opacity = "0";
  }, 2000);
}

/* ========================================
   INIT APP
======================================== */

updateCartCount();
fetchProducts();
