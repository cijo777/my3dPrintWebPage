// Admin credentials (in production, use proper authentication)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// Get products from localStorage or use default
function getProducts() {
    const stored = localStorage.getItem('luxeStoreProducts');
    if (stored) {
        return JSON.parse(stored);
    }
    
    // Default 3D Printed Products
    return [
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
}

// Save products to localStorage
function saveProducts(products) {
    localStorage.setItem('luxeStoreProducts', JSON.stringify(products));
}

// Initialize products in localStorage if not exists
if (!localStorage.getItem('luxeStoreProducts')) {
    saveProducts(getProducts());
}

let products = getProducts();
let currentEditId = null;
let deleteProductId = null;

// Login functionality
document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        localStorage.setItem('adminLoggedIn', 'true');
        showAdminPanel();
        showNotification('Login successful!', 'success');
    } else {
        showNotification('Invalid credentials!', 'error');
    }
});

// Check if already logged in
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('adminLoggedIn') === 'true') {
        showAdminPanel();
    }
});

// Show admin panel
function showAdminPanel() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('adminContainer').style.display = 'flex';
    loadDashboard();
    setupNavigation();
    updateProductCategoryDropdown();
}

// Logout
function logout() {
    localStorage.removeItem('adminLoggedIn');
    location.reload();
}

// Setup navigation
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item[data-section]');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.getAttribute('data-section');
            showSection(section);
            
            // Update active state
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

// Show section
function showSection(sectionName) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.remove('active'));
    
    const targetSection = document.getElementById(`${sectionName}Section`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update page title
    const titles = {
        'dashboard': 'Dashboard',
        'products': 'Product Management',
        'categories': 'Category Management'
    };
    document.getElementById('pageTitle').textContent = titles[sectionName] || sectionName;
    
    if (sectionName === 'dashboard') {
        loadDashboard();
    } else if (sectionName === 'products') {
        buildProductCatFilterBar();
        loadProducts();
        updateProductCategoryDropdown();
    } else if (sectionName === 'categories') {
        loadCategories();
    }
}

// Build category filter buttons in products section
function buildProductCatFilterBar(activeCategory) {
    const bar = document.getElementById('productCatFilterBar');
    if (!bar) return;
    categories = getCategories();
    let html = `<button class="cat-filter-btn ${!activeCategory ? 'active' : ''}" data-cat="all" onclick="filterProductsByCategory(null)">All</button>`;
    categories.forEach(cat => {
        html += `<button class="cat-filter-btn ${activeCategory === cat.slug ? 'active' : ''}" data-cat="${cat.slug}" onclick="filterProductsByCategory('${cat.slug}')">${cat.icon ? cat.icon + ' ' : ''}${cat.name}</button>`;
    });
    bar.innerHTML = html;
}

// Load dashboard statistics
function loadDashboard() {
    products = getProducts();
    categories = getCategories();
    
    const statsGrid = document.getElementById('statsGrid');
    if (!statsGrid) return;
    
    const totalProducts = products.length;
    
    // Icon colors for stat cards
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#06b6d4', '#ef4444', '#84cc16'];
    
    const totalValue = products.reduce((sum, p) => sum + p.price, 0);

    // Create Total Products card (clickable — shows all products)
    let statsHTML = `
        <div class="stat-card stat-card-clickable" onclick="showSection('products'); filterProductsByCategory(null);" title="View all products">
            <div class="stat-icon" style="background: #6366f1;">
                <i class="fas fa-box"></i>
            </div>
            <div class="stat-info">
                <h3>${totalProducts}</h3>
                <p>Total Products</p>
                <span class="stat-value">₹${totalValue.toLocaleString('en-IN')}</span>
            </div>
            <div class="stat-card-arrow"><i class="fas fa-chevron-right"></i></div>
        </div>
    `;
    
    // Create a card for each category (clickable — filters products by category)
    categories.forEach((cat, index) => {
        const catProducts = products.filter(p => p.category === cat.slug);
        const count = catProducts.length;
        const catValue = catProducts.reduce((sum, p) => sum + p.price, 0);
        const color = colors[(index + 1) % colors.length];
        const icon = cat.icon || '📦';
        
        statsHTML += `
            <div class="stat-card stat-card-clickable" onclick="showSection('products'); filterProductsByCategory('${cat.slug}');" title="View ${cat.name} products">
                <div class="stat-icon" style="background: ${color};">
                    <span style="font-size: 1.5rem;">${icon}</span>
                </div>
                <div class="stat-info">
                    <h3>${count}</h3>
                    <p>${cat.name}</p>
                    <span class="stat-value">₹${catValue.toLocaleString('en-IN')}</span>
                </div>
                <div class="stat-card-arrow"><i class="fas fa-chevron-right"></i></div>
            </div>
        `;
    });
    
    statsGrid.innerHTML = statsHTML;
}

// Filter products table by category slug (null = all)
function filterProductsByCategory(categorySlug) {
    buildProductCatFilterBar(categorySlug);
    loadProducts(categorySlug);
}

// Load products table
function loadProducts(filterCategory = null) {
    products = getProducts();
    categories = getCategories();
    const tbody = document.getElementById('productsTableBody');
    
    const filtered = filterCategory ? products.filter(p => p.category === filterCategory) : products;
    
    if (filtered.length === 0) {
        const msg = filterCategory
            ? `No products found in this category.`
            : `No products found. Add your first product!`;
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 2rem;">${msg}</td></tr>`;
        return;
    }
    
    tbody.innerHTML = filtered.map(product => {
        const imageCount = product.images ? product.images.length : 0;
        const imageCountBadge = imageCount > 0
            ? `<span class="image-count-badge" onclick="showImagePreview(${product.id})">${imageCount} <i class="fas fa-image"></i></span>`
            : `<span class="image-count-badge no-images" onclick="showImagePreview(${product.id})">0 <i class="fas fa-image"></i></span>`;
        
        return `
            <tr>
                <td>${product.id}</td>
                <td><span class="product-icon">${product.icon}</span></td>
                <td>${product.name}</td>
                <td>
                    <span class="product-category category-${product.category}">
                        ${product.category}
                    </span>
                </td>
                <td>₹${product.price.toLocaleString('en-IN')}</td>
                <td>${imageCountBadge}</td>
                <td>${product.description}</td>
                <td>
                    <div class="action-buttons-cell">
                        <button class="icon-btn edit" onclick="editProduct(${product.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="icon-btn delete" onclick="deleteProduct(${product.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Browse for image file
function browseImage(button) {
    const row = button.closest('.image-input-row');
    const fileInput = row.querySelector('.image-file-input');
    fileInput.click();
}

// Handle image file upload
function handleImageUpload(fileInput) {
    const file = fileInput.files[0];
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
        showNotification('Please select an image file', 'error');
        return;
    }
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
        showNotification('Image size should be less than 2MB', 'error');
        return;
    }
    
    // Convert to base64
    const reader = new FileReader();
    reader.onload = function(e) {
        const row = fileInput.closest('.image-input-row');
        const urlInput = row.querySelector('.image-url-input');
        urlInput.value = e.target.result;
        showNotification('Image uploaded successfully!', 'success');
    };
    reader.onerror = function() {
        showNotification('Error reading image file', 'error');
    };
    reader.readAsDataURL(file);
}

// Add image input field
function addImageInput() {
    const container = document.getElementById('imageInputs');
    const newRow = document.createElement('div');
    newRow.className = 'image-input-row';
    newRow.innerHTML = `
        <input type="url" class="image-url-input" placeholder="https://example.com/image.jpg or upload file">
        <button type="button" class="btn-icon btn-browse" onclick="browseImage(this)" title="Browse">
            <i class="fas fa-folder-open"></i>
        </button>
        <button type="button" class="btn-icon btn-remove" onclick="removeImageInput(this)" title="Remove">
            <i class="fas fa-times"></i>
        </button>
        <input type="file" class="image-file-input" accept="image/*" style="display: none;" onchange="handleImageUpload(this)">
    `;
    container.appendChild(newRow);
}

// Remove image input field
function removeImageInput(button) {
    const container = document.getElementById('imageInputs');
    if (container.children.length > 1) {
        button.parentElement.remove();
    } else {
        showNotification('At least one image field is required', 'error');
    }
}

// Get images from form
function getImagesFromForm() {
    const inputs = document.querySelectorAll('.image-url-input');
    const images = [];
    inputs.forEach(input => {
        const url = input.value.trim();
        if (url) {
            images.push(url);
        }
    });
    return images;
}

// Load images into form
function loadImagesIntoForm(images) {
    const container = document.getElementById('imageInputs');
    container.innerHTML = '';
    
    if (!images || images.length === 0) {
        // Add one empty field
        container.innerHTML = `
            <div class="image-input-row">
                <input type="url" class="image-url-input" placeholder="https://example.com/image.jpg or upload file">
                <button type="button" class="btn-icon btn-browse" onclick="browseImage(this)" title="Browse">
                    <i class="fas fa-folder-open"></i>
                </button>
                <button type="button" class="btn-icon btn-remove" onclick="removeImageInput(this)" title="Remove">
                    <i class="fas fa-times"></i>
                </button>
                <input type="file" class="image-file-input" accept="image/*" style="display: none;" onchange="handleImageUpload(this)">
            </div>
        `;
    } else {
        images.forEach(url => {
            const row = document.createElement('div');
            row.className = 'image-input-row';
            row.innerHTML = `
                <input type="url" class="image-url-input" value="${url}" placeholder="https://example.com/image.jpg or upload file">
                <button type="button" class="btn-icon btn-browse" onclick="browseImage(this)" title="Browse">
                    <i class="fas fa-folder-open"></i>
                </button>
                <button type="button" class="btn-icon btn-remove" onclick="removeImageInput(this)" title="Remove">
                    <i class="fas fa-times"></i>
                </button>
                <input type="file" class="image-file-input" accept="image/*" style="display: none;" onchange="handleImageUpload(this)">
            `;
            container.appendChild(row);
        });
    }
}

// Open add product modal
function openAddProductModal() {
    currentEditId = null;
    document.getElementById('modalTitle').textContent = 'Add New Product';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    loadImagesIntoForm([]);
    document.getElementById('productModal').classList.add('active');
}

// Close product modal
function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
    document.getElementById('productForm').reset();
    currentEditId = null;
}

// Edit product
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    currentEditId = id;
    document.getElementById('modalTitle').textContent = 'Edit Product';
    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productIcon').value = product.icon;
    document.getElementById('productDescription').value = product.description;
    loadImagesIntoForm(product.images || []);
    
    document.getElementById('productModal').classList.add('active');
}

// Delete product
function deleteProduct(id) {
    deleteProductId = id;
    document.getElementById('deleteModal').classList.add('active');
}

// Close delete modal
function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('active');
    deleteProductId = null;
}

// Confirm delete
function confirmDelete() {
    if (deleteProductId) {
        products = products.filter(p => p.id !== deleteProductId);
        saveProducts(products);
        loadProducts();
        loadDashboard();
        closeDeleteModal();
        showNotification('Product deleted successfully!', 'success');
    }
}

// Handle product form submission
document.getElementById('productForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('productName').value.trim();
    const category = document.getElementById('productCategory').value;
    const price = parseInt(document.getElementById('productPrice').value);
    const icon = document.getElementById('productIcon').value.trim();
    const description = document.getElementById('productDescription').value.trim();
    const images = getImagesFromForm();
    
    if (!name || !category || !price || !icon || !description) {
        showNotification('Please fill all required fields!', 'error');
        return;
    }
    
    if (currentEditId) {
        // Update existing product
        const index = products.findIndex(p => p.id === currentEditId);
        if (index !== -1) {
            products[index] = {
                ...products[index],
                name,
                category,
                price,
                icon,
                description,
                images
            };
            showNotification('Product updated successfully!', 'success');
        }
    } else {
        // Add new product
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push({
            id: newId,
            name,
            category,
            price,
            icon,
            description,
            images
        });
        showNotification('Product added successfully!', 'success');
    }
    
    saveProducts(products);
    loadProducts();
    loadDashboard();
    closeProductModal();
});

// Notification system
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type === 'error' ? 'error' : ''}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Close modals on outside click
document.getElementById('productModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'productModal') {
        closeProductModal();
    }
});

document.getElementById('deleteModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'deleteModal') {
        closeDeleteModal();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // ESC to close modals
    if (e.key === 'Escape') {
        closeProductModal();
        closeDeleteModal();
    }
});

// Made with Bob

// Show image preview modal
function showImagePreview(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('imagePreviewModal');
    const title = document.getElementById('imagePreviewTitle');
    const grid = document.getElementById('imagePreviewGrid');
    const noImagesMsg = document.getElementById('noImagesMessage');
    
    title.textContent = `${product.name} - Images`;
    
    if (!product.images || product.images.length === 0) {
        grid.style.display = 'none';
        noImagesMsg.style.display = 'block';
    } else {
        grid.style.display = 'grid';
        noImagesMsg.style.display = 'none';
        
        grid.innerHTML = product.images.map((imageUrl, index) => `
            <div class="preview-image-item" onclick="window.open('${imageUrl}', '_blank')">
                <img src="${imageUrl}" alt="${product.name} - Image ${index + 1}" 
                     onerror="this.parentElement.innerHTML='<div style=\\'padding:2rem;text-align:center;background:#f3f4f6;height:200px;display:flex;align-items:center;justify-content:center;\\'><i class=\\'fas fa-exclamation-triangle\\' style=\\'font-size:2rem;color:#ef4444;\\'></i></div>'">
                <div class="preview-image-number">#${index + 1}</div>
            </div>
        `).join('');
    }
    
    modal.classList.add('active');
}

// Close image preview modal
function closeImagePreview() {
    document.getElementById('imagePreviewModal').classList.remove('active');
}

// Close modal on outside click
document.getElementById('imagePreviewModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'imagePreviewModal') {
        closeImagePreview();
    }
});

// Show image preview modal
function showImagePreview(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('imagePreviewModal');
    const title = document.getElementById('imagePreviewTitle');
    const grid = document.getElementById('imagePreviewGrid');
    const noImagesMsg = document.getElementById('noImagesMessage');
    
    title.textContent = `${product.name} - Images`;
    
    if (!product.images || product.images.length === 0) {
        grid.style.display = 'none';
        noImagesMsg.style.display = 'block';
    } else {
        grid.style.display = 'grid';
        noImagesMsg.style.display = 'none';
        
        grid.innerHTML = product.images.map((imageUrl, index) => `
            <div class="preview-image-item">
                <img src="${imageUrl}" alt="${product.name} - Image ${index + 1}" 
                     onclick="window.open('${imageUrl}', '_blank')"
                     onerror="this.parentElement.innerHTML='<div style=\\'padding:2rem;text-align:center;background:#f3f4f6;height:200px;display:flex;align-items:center;justify-content:center;\\'><i class=\\'fas fa-exclamation-triangle\\' style=\\'font-size:2rem;color:#ef4444;\\'></i></div>'">
                <div class="preview-image-number">#${index + 1}</div>
                <button class="preview-delete-btn" onclick="event.stopPropagation(); deleteProductImage(${productId}, ${index})" title="Delete Image">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }
    
    modal.classList.add('active');
}

// Delete product image
function deleteProductImage(productId, imageIndex) {
    const product = products.find(p => p.id === productId);
    if (!product || !product.images) return;
    
    if (confirm('Are you sure you want to delete this image?')) {
        product.images.splice(imageIndex, 1);
        saveProducts(products);
        loadProducts();
        loadDashboard();
        showImagePreview(productId); // Refresh the preview
        showNotification('Image deleted successfully!', 'success');
    }
}

// Category Management
// Generate slug from category name
function generateSlug(name) {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

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

function saveCategories(categories) {
    localStorage.setItem('luxeStoreCategories', JSON.stringify(categories));
}

let categories = getCategories();
let currentEditCategorySlug = null;

// Load categories list
function loadCategories() {
    categories = getCategories();
    const list = document.getElementById('categoriesList');
    
    if (!list) return;
    
    if (categories.length === 0) {
        list.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--text-color);">No categories found. Add your first category!</p>';
        return;
    }
    
    list.innerHTML = categories.map(cat => `
        <div class="category-item">
            <div class="category-item-info">
                ${cat.icon ? `<span class="category-item-icon">${cat.icon}</span>` : ''}
                <div class="category-item-details">
                    <h4>${cat.name}</h4>
                    <span class="category-item-slug">${cat.slug}</span>
                </div>
            </div>
            <div class="category-item-actions">
                <button class="icon-btn edit" onclick="editCategory('${cat.slug}')" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="icon-btn delete" onclick="deleteCategory('${cat.slug}')" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Open add category modal
function openAddCategoryModal() {
    currentEditCategorySlug = null;
    document.getElementById('categoryModalTitle').textContent = 'Add New Category';
    document.getElementById('categoryForm').reset();
    document.getElementById('categoryOldSlug').value = '';
    document.getElementById('categoryModal').classList.add('active');
}

// Close category modal
function closeCategoryModal() {
    document.getElementById('categoryModal').classList.remove('active');
    document.getElementById('categoryForm').reset();
    currentEditCategorySlug = null;
}

// Edit category
function editCategory(slug) {
    const category = categories.find(c => c.slug === slug);
    if (!category) return;
    
    currentEditCategorySlug = slug;
    document.getElementById('categoryModalTitle').textContent = 'Edit Category';
    document.getElementById('categoryOldSlug').value = slug;
    document.getElementById('categoryName').value = category.name;
    document.getElementById('categoryIcon').value = category.icon || '';
    
    document.getElementById('categoryModal').classList.add('active');
}

// Delete category
function deleteCategory(slug) {
    // Check if any products use this category
    const productsUsingCategory = products.filter(p => p.category === slug);
    
    if (productsUsingCategory.length > 0) {
        showNotification(`Cannot delete category. ${productsUsingCategory.length} product(s) are using it.`, 'error');
        return;
    }
    
    if (confirm(`Are you sure you want to delete the category "${slug}"?`)) {
        categories = categories.filter(c => c.slug !== slug);
        saveCategories(categories);
        loadCategories();
        showNotification('Category deleted successfully!', 'success');
    }
}

// Handle category form submission
document.getElementById('categoryForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('categoryName').value.trim();
    const icon = document.getElementById('categoryIcon').value.trim();
    const oldSlug = document.getElementById('categoryOldSlug').value;
    
    if (!name) {
        showNotification('Please enter a category name!', 'error');
        return;
    }
    
    // Auto-generate slug from name
    const slug = generateSlug(name);
    
    if (!slug) {
        showNotification('Category name must contain at least one valid character!', 'error');
        return;
    }
    
    if (currentEditCategorySlug) {
        // Update existing category
        const index = categories.findIndex(c => c.slug === oldSlug);
        if (index !== -1) {
            // Check if new slug conflicts with another category
            const existingCategory = categories.find(c => c.slug === slug && c.slug !== oldSlug);
            if (existingCategory) {
                showNotification('A category with this name already exists!', 'error');
                return;
            }
            
            // If slug changed, update all products using old slug
            if (oldSlug !== slug) {
                products.forEach(p => {
                    if (p.category === oldSlug) {
                        p.category = slug;
                    }
                });
                saveProducts(products);
            }
            
            categories[index] = { slug, name, icon };
            showNotification('Category updated successfully!', 'success');
        }
    } else {
        // Add new category
        if (categories.find(c => c.slug === slug)) {
            showNotification('A category with this name already exists!', 'error');
            return;
        }
        
        categories.push({ slug, name, icon });
        showNotification('Category added successfully!', 'success');
    }
    
    saveCategories(categories);
    loadCategories();
    updateProductCategoryDropdown();
    closeCategoryModal();
});

// Update product category dropdown
function updateProductCategoryDropdown() {
    const select = document.getElementById('productCategory');
    if (!select) return;
    
    const currentValue = select.value;
    categories = getCategories();
    
    select.innerHTML = '<option value="">Select Category</option>' +
        categories.map(cat => `<option value="${cat.slug}">${cat.name}</option>`).join('');
    
    if (currentValue) {
        select.value = currentValue;
    }
}

// Close modal on outside click
document.getElementById('categoryModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'categoryModal') {
        closeCategoryModal();
    }
});
