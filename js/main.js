document.addEventListener("DOMContentLoaded", () => {
    const sliderImages = document.querySelectorAll(".slide");
    const nextBtn = document.querySelector(".slider-btn-next");
    const prevBtn = document.querySelector(".slider-btn-prev");
    const productContainer = document.getElementById("products-container");
    const searchInput = document.getElementById("search-input");
    const categorySelect = document.getElementById("category-select");

    let currentSlide = 0;
    let allProducts = [];

    // ===== SLIDER LOGIC =====
    if (sliderImages.length > 0) {
        function showSlide(index) {
            sliderImages.forEach(slide => slide.classList.remove("active"));
            sliderImages[index].classList.add("active");
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % sliderImages.length;
            showSlide(currentSlide);
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + sliderImages.length) % sliderImages.length;
            showSlide(currentSlide);
        }

        let sliderInterval = setInterval(nextSlide, 4000);

        function resetSliderInterval() {
            clearInterval(sliderInterval);
            sliderInterval = setInterval(nextSlide, 4000);
        }

        nextBtn?.addEventListener("click", () => {
            nextSlide();
            resetSliderInterval();
        });

        prevBtn?.addEventListener("click", () => {
            prevSlide();
            resetSliderInterval();
        });

        showSlide(currentSlide);
    }

    // ===== DISPLAY PRODUCTS =====
    function displayProducts(products) {
        if (!productContainer) return;

        productContainer.innerHTML = "";

        if (products.length === 0) {
            productContainer.innerHTML = "<p>No products found.</p>";
            return;
        }

        products.forEach(product => {
            const card = document.createElement("div");
            card.className = "product-card";
            card.innerHTML = `
        <a href="product.html?id=${product.id}" class="card-link">
          <img src="${product.image}" alt="${product.title}">
          <h3>${product.title}</h3>
          <p>$${product.price}</p>
        </a>
        <button class="add-to-cart" data-id="${product.id}"><i class="fas fa-shopping-cart"></i> Add to Cart</button>
      `;
            productContainer.appendChild(card);
        });

        const cartButtons = document.querySelectorAll(".add-to-cart");
        cartButtons.forEach(button => {
            button.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();

                const productId = parseInt(button.getAttribute("data-id"));
                const product = allProducts.find(p => p.id === productId);

                if (product) {
                    addToCart(product, 1);
                    showToast(`"${product.title}" added to cart!`);
                }
            });
        });
    }

    function addToCart(product, quantity = 1) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ ...product, quantity });
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
    }

    function showToast(message) {
        const toast = document.createElement("div");
        toast.textContent = message;
        toast.className = "cart-toast";
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        const cartCount = document.getElementById("cart-count");
        if (cartCount) {
            cartCount.textContent = count;
        }
    }

    function loadProducts() {
        fetch("https://fakestoreapi.com/products")
            .then(res => res.json())
            .then(data => {
                allProducts = data;
                displayProducts(allProducts);
            })
            .catch(err => {
                console.error("Error loading products:", err);
                if (productContainer) productContainer.innerHTML = "<p>Failed to load products.</p>";
            });
    }
    const scrollTopBtn = document.getElementById("scrollTopBtn");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            scrollTopBtn.style.display = "block";
        } else {
            scrollTopBtn.style.display = "none";
        }
    });

    scrollTopBtn.addEventListener("click", (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
    function loadCategories() {
        fetch("https://fakestoreapi.com/products/categories")
            .then(res => res.json())
            .then(categories => {
                categories.forEach(category => {
                    const option = document.createElement("option");
                    option.value = category;
                    option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
                    categorySelect?.appendChild(option);
                });
            })
            .catch(err => console.error("Failed to load categories:", err));
    }

    searchInput?.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        const filtered = allProducts.filter(p => p.title.toLowerCase().includes(query));
        displayProducts(filtered);
    });

    categorySelect?.addEventListener("change", () => {
        const selected = categorySelect.value;
        if (selected === "") {
            displayProducts(allProducts);
        } else {
            const filtered = allProducts.filter(p => p.category === selected);
            displayProducts(filtered);
        }
    });

    loadProducts();
    loadCategories();
    updateCartCount();
});