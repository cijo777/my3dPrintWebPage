// Get categories from localStorage or use default
function getCategories() {
    const stored = localStorage.getItem('luxeStoreCategories');
    if (stored) {
        return JSON.parse(stored);
    }
    
    // Default categories
    return [
        { slug: 'decor', name: 'Home Decor', icon: '🎨' },
        { slug: 'accessories', name: 'Accessories', icon: '💍' },
        { slug: 'functional', name: 'Functional Items', icon: '🔧' }
    ];
}

// Get products from localStorage or use default
function getProducts() {
    const stored = localStorage.getItem('luxeStoreProducts');
    if (stored) {
        return JSON.parse(stored);
    }
    
    // Default 3D Printed Products (Prices in Indian Rupees)
    const defaultProducts = [
        {
            id: 1,
            name: "Geometric Plant Pot",
            category: "decor",
            price: 599,
            description: "Modern geometric design planter for succulents",
            icon: "🪴",
            images: [
                "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400",
                "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400",
                "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400"
            ]
        },
        {
            id: 2,
            name: "Custom Phone Stand",
            category: "functional",
            price: 399,
            description: "Adjustable phone holder for desk or bedside",
            icon: "📱",
            images: [
                "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400",
                "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400"
            ]
        },
        {
            id: 3,
            name: "Decorative Wall Art",
            category: "decor",
            price: 1299,
            description: "3D printed geometric wall decoration",
            icon: "🎨",
            images: [
                "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400",
                "https://images.unsplash.com/photo-1582561833985-d8e8e6c2e5e0?w=400",
                "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400"
            ]
        },
        {
            id: 4,
            name: "Keychain Collection",
            category: "accessories",
            price: 199,
            description: "Personalized 3D printed keychains",
            icon: "🔑",
            images: [
                "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400"
            ]
        },
        {
            id: 5,
            name: "Desk Organizer",
            category: "functional",
            price: 799,
            description: "Multi-compartment organizer for office supplies",
            icon: "📎",
            images: [
                "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=400",
                "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=400"
            ]
        },
        {
            id: 6,
            name: "Miniature Figurines",
            category: "decor",
            price: 499,
            description: "Custom designed collectible figurines",
            icon: "🎭",
            images: [
                "https://images.unsplash.com/photo-1601814933824-fd0b574dd592?w=400",
                "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"
            ]
        },
        {
            id: 7,
            name: "Cable Management Clips",
            category: "functional",
            price: 299,
            description: "Set of 10 cable organizer clips",
            icon: "🔌",
            images: [
                "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"
            ]
        },
        {
            id: 8,
            name: "Custom Jewelry",
            category: "accessories",
            price: 899,
            description: "Unique 3D printed earrings and pendants",
            icon: "💍",
            images: [
                "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400",
                "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400"
            ]
        },
        {
            id: 9,
            name: "Coaster Set",
            category: "functional",
            price: 449,
            description: "Set of 4 geometric pattern coasters",
            icon: "☕",
            images: [
                "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400"
            ]
        }
    ];
    
    // Save default products to localStorage
    localStorage.setItem('luxeStoreProducts', JSON.stringify(defaultProducts));
    return defaultProducts;
}

let products = getProducts();
let categories = getCategories();

// Cart State
let cart = [];
let currentFilter = 'all';

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    products = getProducts(); // Reload products from localStorage
    categories = getCategories(); // Reload categories from localStorage
    renderFilterButtons(); // Dynamically create filter buttons
    renderProducts(products);
    setupNavigation();
    setupContactForm();
    loadCartFromStorage();
});

// Render Filter Buttons Dynamically
function renderFilterButtons() {
    const filterContainer = document.querySelector('.filter-buttons');
    if (!filterContainer) return;
    
    // Create "All" button
    let buttonsHTML = '<button class="filter-btn active" data-filter="all">All</button>';
    
    // Create buttons for each category
    categories.forEach(cat => {
        buttonsHTML += `<button class="filter-btn" data-filter="${cat.slug}">${cat.name}</button>`;
    });
    
    filterContainer.innerHTML = buttonsHTML;
    
    // Setup click handlers
    setupFilterButtons();
}

// Render Products
function renderProducts(productsToRender) {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';

    productsToRender.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Create Product Card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    // Create image gallery HTML
    const hasImages = product.images && product.images.length > 0;
    let imageGalleryHTML = '';
    
    if (hasImages) {
        imageGalleryHTML = `
            <div class="product-image-gallery" onclick="openLightbox(event, ${product.id})">
                <img src="${product.images[0]}" alt="${product.name}" class="gallery-main-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="gallery-icon-fallback" style="display:none;">${product.icon}</div>
                ${product.images.length > 1 ? `
                    <div class="gallery-indicators">
                        ${product.images.map((_, index) => `
                            <span class="indicator ${index === 0 ? 'active' : ''}" data-index="${index}"></span>
                        `).join('')}
                    </div>
                    <button class="gallery-nav prev" onclick="event.stopPropagation(); changeImage(event, ${product.id}, -1)">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="gallery-nav next" onclick="event.stopPropagation(); changeImage(event, ${product.id}, 1)">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                ` : ''}
            </div>
        `;
    } else {
        imageGalleryHTML = `<div class="product-image">${product.icon}</div>`;
    }
    
    // Get category name from slug
    const category = categories.find(c => c.slug === product.category);
    const categoryName = category ? category.name : product.category;
    
    card.dataset.productId = product.id;
    card.innerHTML = `
        ${imageGalleryHTML}
        <div class="product-info">
            <div class="product-category">${categoryName}</div>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-footer">
                <span class="product-price">₹${product.price.toLocaleString('en-IN')}</span>
                <div class="card-cart-control" id="cart-control-${product.id}">
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Add
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add click handlers for indicators if images exist
    if (hasImages && product.images.length > 1) {
        setTimeout(() => {
            const indicators = card.querySelectorAll('.indicator');
            indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', (e) => {
                    e.stopPropagation();
                    setImage(card, product.id, index);
                });
            });
        }, 0);
    }
    
    return card;
}

// Change image in gallery
function changeImage(event, productId, direction) {
    event.stopPropagation();
    const product = products.find(p => p.id === productId);
    if (!product || !product.images || product.images.length <= 1) return;
    
    const card = event.target.closest('.product-card');
    const img = card.querySelector('.gallery-main-image');
    const indicators = card.querySelectorAll('.indicator');
    
    let currentIndex = 0;
    indicators.forEach((ind, idx) => {
        if (ind.classList.contains('active')) currentIndex = idx;
    });
    
    let newIndex = currentIndex + direction;
    if (newIndex < 0) newIndex = product.images.length - 1;
    if (newIndex >= product.images.length) newIndex = 0;
    
    setImage(card, productId, newIndex);
}

// Set specific image
function setImage(card, productId, index) {
    const product = products.find(p => p.id === productId);
    if (!product || !product.images) return;
    
    const img = card.querySelector('.gallery-main-image');
    const indicators = card.querySelectorAll('.indicator');
    
    img.src = product.images[index];
    indicators.forEach((ind, idx) => {
        ind.classList.toggle('active', idx === index);
    });
}

// Filter Products
function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter products
            const filter = button.getAttribute('data-filter');
            currentFilter = filter;
            
            products = getProducts(); // Reload products
            categories = getCategories(); // Reload categories
            if (filter === 'all') {
                renderProducts(products);
            } else {
                const filtered = products.filter(p => p.category === filter);
                renderProducts(filtered);
            }
        });
    });
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCart();
    saveCartToStorage();
    updateCardCartControl(productId);
    showNotification('Product added to cart!');
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    saveCartToStorage();
    updateCardCartControl(productId);
}

// Update Quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
            saveCartToStorage();
            updateCardCartControl(productId);
        }
    }
}

// Update the cart control widget on the product card
function updateCardCartControl(productId) {
    const control = document.getElementById(`cart-control-${productId}`);
    if (!control) return;
    const item = cart.find(i => i.id === productId);
    if (!item || item.quantity === 0) {
        control.innerHTML = `
            <button class="add-to-cart-btn" onclick="addToCart(${productId})">
                <i class="fas fa-cart-plus"></i> Add
            </button>`;
    } else {
        control.innerHTML = `
            <div class="card-qty-control">
                <button class="card-qty-btn" onclick="updateQuantity(${productId}, -1)">−</button>
                <span class="card-qty-count">${item.quantity}</span>
                <button class="card-qty-btn" onclick="updateQuantity(${productId}, 1)">+</button>
            </div>`;
    }
}

// Refresh all card controls (called after loading cart from storage)
function refreshAllCardControls() {
    cart.forEach(item => updateCardCartControl(item.id));
}

// Update Cart Display
function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.querySelector('.cart-count');
    const cartTotal = document.getElementById('cartTotal');
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `₹${total.toLocaleString('en-IN')}`;
    
    // Render cart items
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">${item.icon}</div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }
}

// Toggle Cart Sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
}

// Local Storage Functions
function saveCartToStorage() {
    localStorage.setItem('luxeStoreCart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('luxeStoreCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
        refreshAllCardControls();
    }
}

// Navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Smooth scroll to section
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Update active nav on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Contact Form
function setupContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const message = contactForm.querySelector('textarea').value;
        
        // Simulate form submission
        console.log('Form submitted:', { name, email, message });
        
        showNotification('Message sent successfully!');
        contactForm.reset();
    });
}

// Notification System
function showNotification(message) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--success-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Search Functionality (Basic)
const searchBtn = document.querySelector('.search-btn');
searchBtn.addEventListener('click', () => {
    const searchTerm = prompt('Search for products:');
    if (searchTerm) {
        const filtered = products.filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        if (filtered.length > 0) {
            renderProducts(filtered);
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        } else {
            showNotification('No products found!');
        }
    }
});

// Made with Bob

// ==================== LIGHTBOX ====================
let lightboxProductId = null;
let lightboxIndex = 0;

function openLightbox(event, productId) {
    event.stopPropagation();
    const product = products.find(p => p.id === productId);
    if (!product || !product.images || product.images.length === 0) return;

    // Detect which image is currently shown in the card
    const card = event.currentTarget;
    const mainImg = card.querySelector('.gallery-main-image');
    const currentSrc = mainImg ? mainImg.src : product.images[0];
    const startIndex = product.images.findIndex(url => url === currentSrc) || 0;

    lightboxProductId = productId;
    lightboxIndex = startIndex >= 0 ? startIndex : 0;

    renderLightbox(product);
    document.getElementById('lightbox').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function renderLightbox(product) {
    const img = document.getElementById('lightboxImg');
    const indicators = document.getElementById('lightboxIndicators');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');

    img.src = product.images[lightboxIndex];
    img.alt = product.name;

    // Reset magnifier on image change
    resetMagnifier();

    // Indicators
    if (product.images.length > 1) {
        indicators.innerHTML = product.images.map((_, i) =>
            `<span class="lb-dot ${i === lightboxIndex ? 'active' : ''}" onclick="lightboxGoTo(${i})"></span>`
        ).join('');
        indicators.style.display = 'flex';
    } else {
        indicators.innerHTML = '';
        indicators.style.display = 'none';
    }

    // Nav buttons
    prevBtn.disabled = product.images.length <= 1;
    nextBtn.disabled = product.images.length <= 1;
    prevBtn.style.visibility = product.images.length > 1 ? 'visible' : 'hidden';
    nextBtn.style.visibility = product.images.length > 1 ? 'visible' : 'hidden';

    // Setup magnifier after image loads
    img.onload = () => setupMagnifier(img);
    if (img.complete) setupMagnifier(img);
}

function lightboxNav(event, direction) {
    event.stopPropagation();
    const product = products.find(p => p.id === lightboxProductId);
    if (!product) return;
    lightboxIndex = (lightboxIndex + direction + product.images.length) % product.images.length;
    renderLightbox(product);
}

function lightboxGoTo(index) {
    const product = products.find(p => p.id === lightboxProductId);
    if (!product) return;
    lightboxIndex = index;
    renderLightbox(product);
}

function closeLightbox(event) {
    if (event && event.target !== document.getElementById('lightbox') && !event.target.classList.contains('lightbox-close')) {
        return;
    }
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = '';
    resetMagnifier();
    lightboxProductId = null;
}

// Close on ESC key (extend existing keydown listener)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const lb = document.getElementById('lightbox');
        if (lb && lb.classList.contains('active')) {
            lb.classList.remove('active');
            document.body.style.overflow = '';
            resetMagnifier();
        }
    }
    if (e.key === 'ArrowRight' && lightboxProductId) lightboxNav({ stopPropagation: () => {} }, 1);
    if (e.key === 'ArrowLeft' && lightboxProductId) lightboxNav({ stopPropagation: () => {} }, -1);
});

// ==================== MAGNIFIER ====================
const MAGNIFY = 3.9; // zoom level (3 * 1.3)
const LENS_SIZE = 130; // px radius (100 * 1.3)

function setupMagnifier(img) {
    const wrap = document.getElementById('lightboxImgWrap');
    const lens = document.getElementById('magnifierLens');
    const glass = document.getElementById('magnifierGlass');

    // Set magnifier glass background to the same image
    glass.style.backgroundImage = `url('${img.src}')`;

    wrap.onmousemove = (e) => moveMagnifier(e, img, lens, glass);
    wrap.onmouseleave = () => {
        lens.style.display = 'none';
        glass.style.display = 'none';
    };
    wrap.onmouseenter = () => {
        lens.style.display = 'block';
        glass.style.display = 'block';
    };
}

function moveMagnifier(e, img, lens, glass) {
    const imgRect = img.getBoundingClientRect();
    const wrap = document.getElementById('lightboxImgWrap');
    const wrapRect = wrap.getBoundingClientRect();

    // Cursor position relative to the image
    let x = e.clientX - imgRect.left;
    let y = e.clientY - imgRect.top;

    // Clamp so lens stays within image bounds
    const halfLens = LENS_SIZE / 2;
    x = Math.max(halfLens, Math.min(x, imgRect.width - halfLens));
    y = Math.max(halfLens, Math.min(y, imgRect.height - halfLens));

    // Position lens circle relative to the wrap
    const lensLeft = (e.clientX - wrapRect.left) - halfLens;
    const lensTop  = (e.clientY - wrapRect.top)  - halfLens;
    lens.style.left = `${lensLeft}px`;
    lens.style.top  = `${lensTop}px`;
    lens.style.display = 'block';

    // Background position for the glass — maps cursor % on image to zoomed bg position
    const bgX = ((x / imgRect.width) * 100).toFixed(2);
    const bgY = ((y / imgRect.height) * 100).toFixed(2);
    glass.style.backgroundPosition = `${bgX}% ${bgY}%`;
    glass.style.backgroundSize = `${MAGNIFY * 100}%`;
    glass.style.display = 'block';
}

function resetMagnifier() {
    const wrap = document.getElementById('lightboxImgWrap');
    const lens = document.getElementById('magnifierLens');
    const glass = document.getElementById('magnifierGlass');
    if (wrap) { wrap.onmousemove = null; wrap.onmouseleave = null; wrap.onmouseenter = null; }
    if (lens) lens.style.display = 'none';
    if (glass) { glass.style.display = 'none'; glass.style.backgroundImage = ''; }
}
