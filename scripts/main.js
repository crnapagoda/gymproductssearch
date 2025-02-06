import { createClient } from '@supabase/supabase-js';

document.addEventListener('DOMContentLoaded', async function () {
  const supabaseUrl = 'https://cbpmcmajjwlejlmqpnra.supabase.co';
  const supabaseKey = process.env.SUPABASE_KEY;
  if (!supabaseKey) {
    console.error('Supabase key is missing');
    return;
  }
  const supabase = createClient(supabaseUrl, supabaseKey);

  const searchInput = document.getElementById('search');
  const categorySelect = document.getElementById('category');
  const priceRangeSelect = document.getElementById('price-range');
  const sortSelect = document.getElementById('sort');
  const productsContainer = document.getElementById('products');
  const addProductButton = document.getElementById('addProductButton');
  const addProductModal = document.getElementById('addProductModal');
  const addProductForm = document.getElementById('addProductForm');
  const editProductModal = document.getElementById('editProductModal');
  const editProductForm = document.getElementById('editProductForm');
  const settingsButton = document.getElementById('settingsButton');
  const settingsModal = document.getElementById('settingsModal');
  const addCategoryForm = document.getElementById('addCategoryForm');
  const categoriesList = document.getElementById('categoriesList');
  const closeModalButtons = document.querySelectorAll('.close');
  const loginButton = document.getElementById('loginButton');
  const logoutButton = document.getElementById('logoutButton');

  let user = null;

  async function checkAuth() {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    user = currentUser;
    updateUI();
  }

  function updateUI() {
    if (user) {
      loginButton.style.display = 'none';
      settingsButton.style.display = 'block';
      addProductButton.style.display = 'block';
      logoutButton.style.display = 'block';
      document.querySelectorAll('.edit-button, .delete-button').forEach(button => {
        button.style.display = 'block';
      });
    } else {
      loginButton.style.display = 'block';
      settingsButton.style.display = 'none';
      addProductButton.style.display = 'none';
      logoutButton.style.display = 'none';
      document.querySelectorAll('.edit-button, .delete-button').forEach(button => {
        button.style.display = 'none';
      });
    }
  }

  loginButton.addEventListener('click', async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: prompt('Email:'),
      password: prompt('Password:')
    });

    if (error) {
      alert('Login failed: ' + error.message);
    } else {
      await checkAuth();
    }
  });

  logoutButton.addEventListener('click', async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert('Logout failed: ' + error.message);
    } else {
      user = null;
      updateUI();
      settingsModal.style.display = 'none';
    }
  });

  settingsButton.addEventListener('click', function () {
    settingsModal.style.display = 'block';
    fetchCategories();
  });

  async function fetchCategories() {
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*');

    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('category');

    if (categoriesError || productsError) {
      console.error('Error fetching categories or products:', categoriesError || productsError);
      return;
    }

    const productCategories = [...new Set(products.map(product => product.category))];
    const allCategories = [...new Set([...categories.map(category => category.name), ...productCategories])];

    renderCategories(categories);
    populateCategoryDropdowns(allCategories);
  }

  function renderCategories(categories) {
    categoriesList.innerHTML = '';
    categories.forEach(function (category) {
      const categoryElement = document.createElement('div');
      categoryElement.className = 'category-item';
      categoryElement.setAttribute('data-id', category.id);

      categoryElement.innerHTML = `
        <span>${category.name}</span>
        <button class="delete-category-button">Obriši</button>
      `;

      categoryElement.querySelector('.delete-category-button').addEventListener('click', async function () {
        await deleteCategory(category.id);
      });

      categoriesList.appendChild(categoryElement);
    });
  }

  function populateCategoryDropdowns(categories) {
    const categoryOptions = categories.map(category => `<option value="${category}">${category}</option>`).join('');
    categorySelect.innerHTML = `<option value="all">Sve kategorije</option>${categoryOptions}`;
    document.getElementById('productCategory').innerHTML = categoryOptions;
    document.getElementById('editProductCategory').innerHTML = categoryOptions;
  }

  async function deleteCategory(categoryId) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId);

    if (error) {
      console.error('Error deleting category:', error);
      return;
    }

    fetchCategories();
  }

  addCategoryForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const categoryName = document.getElementById('categoryName').value;

    const { data, error } = await supabase
      .from('categories')
      .insert([{ name: categoryName }]);

    if (error) {
      console.error('Error adding category:', error);
      return;
    }

    document.getElementById('categoryName').value = '';
    fetchCategories();
  });

  async function fetchProducts() {
    const { data: products, error } = await supabase
      .from('products')
      .select('*');

    if (error) {
      console.error('Error fetching products:', error);
      return;
    }

    renderProducts(products);
  }

  function renderProducts(products) {
    productsContainer.innerHTML = '';
    products.forEach(function (product) {
      const productElement = document.createElement('div');
      productElement.className = 'product';
      productElement.setAttribute('data-id', product.id);
      productElement.setAttribute('data-category', product.category);
      productElement.setAttribute('data-price', product.price);

      productElement.innerHTML = `
        <img src="${product.image_url}" alt="${product.title}">
        <div class="product-details">
          <div class="product-title">${product.title}</div>
          <div class="product-price">${product.price} RSD</div>
          <div class="product-description">${product.description}</div>
        </div>
        <div class="product-buttons">
          <button class="edit-button" style="display: none;">Izmeni</button>
          <button class="delete-button" style="display: none;">Obriši</button>
        </div>
      `;

      productElement.querySelector('.edit-button').addEventListener('click', function (event) {
        event.stopPropagation();
        openEditModal(product);
      });

      productElement.querySelector('.delete-button').addEventListener('click', async function (event) {
        event.stopPropagation();
        await deleteProduct(product.id, product.image_url);
      });

      productElement.addEventListener('click', function () {
        showModal(product);
      });

      productsContainer.appendChild(productElement);
    });

    updateUI();
  }

  function showModal(product) {
    const modal = document.getElementById('productModal');
    const modalContent = document.getElementById('modalProductDetails');

    modalContent.innerHTML = `
      <h2>${product.title}</h2>
      <img src="${product.image_url}" alt="${product.title}" style="max-width: 100%; height: auto;">
      <p><strong>Price:</strong> ${product.price} RSD</p>
      <p>${product.description}</p>
    `;

    modal.style.display = 'block';

    const editButton = modal.querySelector('.edit-button');
    const deleteButton = modal.querySelector('.delete-button');

    editButton.onclick = function () {
      openEditModal(product);
      modal.style.display = 'none';
    };

    deleteButton.onclick = async function () {
      await deleteProduct(product.id, product.image_url);
      modal.style.display = 'none';
    };

    updateUI();
  }

  function filterProducts() {
    const searchText = searchInput.value.toLowerCase();
    const category = categorySelect.value;
    const priceRange = priceRangeSelect.value;
    const products = document.querySelectorAll('.product');

    products.forEach(function (product) {
      const title = product.querySelector('.product-title').textContent.toLowerCase();
      const description = product.querySelector('.product-description').textContent.toLowerCase();
      const productCategory = product.getAttribute('data-category');
      const productPrice = parseInt(product.getAttribute('data-price'));

      const matchesSearch = title.includes(searchText) || description.includes(searchText);
      const matchesCategory = category === 'all' || productCategory === category;
      const matchesPriceRange = priceRange === 'all' || checkPriceRange(productPrice, priceRange);

      if (matchesSearch && matchesCategory && matchesPriceRange) {
        product.style.display = 'flex';
      } else {
        product.style.display = 'none';
      }
    });
  }

  function checkPriceRange(price, range) {
    switch (range) {
      case '0-1000':
        return price >= 0 && price <= 1000;
      case '1000-2000':
        return price > 1000 && price <= 2000;
      case '2000-3000':
        return price > 2000 && price <= 3000;
      case '3000+':
        return price > 3000;
      default:
        return true;
    }
  }

  async function deleteProduct(productId, imageUrl) {
    const imagePath = imageUrl.split('/').pop();

    const { error: imageError } = await supabase.storage
      .from('product-images')
      .remove([`public/${imagePath}`]);

    if (imageError) {
      console.error('Error deleting image:', imageError);
      return;
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      console.error('Error deleting product:', error);
      return;
    }

    await fetchProducts();
  }

  function openEditModal(product) {
    document.getElementById('editProductId').value = product.id;
    document.getElementById('editProductTitle').value = product.title;
    document.getElementById('editProductDescription').value = product.description;
    document.getElementById('editProductPrice').value = product.price;
    document.getElementById('editProductCategory').value = product.category;
    editProductModal.style.display = 'block';
  }

  searchInput.addEventListener('keyup', filterProducts);
  categorySelect.addEventListener('change', filterProducts);
  priceRangeSelect.addEventListener('change', filterProducts);

  sortSelect.addEventListener('change', function (event) {
    const sortValue = event.target.value;
    const productsArray = Array.from(document.querySelectorAll('.product'));

    productsArray.sort(function (a, b) {
      const priceA = parseInt(a.getAttribute('data-price'));
      const priceB = parseInt(b.getAttribute('data-price'));

      if (sortValue === 'price-asc') {
        return priceA - priceB;
      } else if (sortValue === 'price-desc') {
        return priceB - priceA;
      } else {
        return 0;
      }
    });

    productsContainer.innerHTML = '';
    productsArray.forEach(function (product) {
      productsContainer.appendChild(product);
    });
  });

  addProductButton.addEventListener('click', function () {
    addProductModal.style.display = 'block';
  });

  closeModalButtons.forEach(function (button) {
    button.onclick = function () {
      addProductModal.style.display = 'none';
      editProductModal.style.display = 'none';
      document.getElementById('productModal').style.display = 'none';
      settingsModal.style.display = 'none';
    };
  });

  window.onclick = function (event) {
    if (event.target == addProductModal) {
      addProductModal.style.display = 'none';
    }
    if (event.target == editProductModal) {
      editProductModal.style.display = 'none';
    }
    if (event.target == document.getElementById('productModal')) {
      document.getElementById('productModal').style.display = 'none';
    }
    if (event.target == settingsModal) {
      settingsModal.style.display = 'none';
    }
  };

  addProductForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const title = document.getElementById('productTitle').value;
    const description = document.getElementById('productDescription').value;
    const price = document.getElementById('productPrice').value;
    const category = document.getElementById('productCategory').value;
    const imageFile = document.getElementById('productImage').files[0];

    if (!imageFile) {
      alert('Please select an image file.');
      return;
    }

    const { data: imageData, error: imageError } = await supabase.storage
      .from('product-images')
      .upload(`public/${imageFile.name}`, imageFile);

    if (imageError) {
      console.error('Error uploading image:', imageError);
      return;
    }

    const imageUrl = `${supabaseUrl}/storage/v1/object/public/product-images/${imageData.path}`;

    const { data, error } = await supabase
      .from('products')
      .insert([{ title, description, price, category, image_url: imageUrl }]);

    if (error) {
      console.error('Error adding product:', error);
      return;
    }

    addProductModal.style.display = 'none';
    await fetchProducts();
  });

  editProductForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const id = document.getElementById('editProductId').value;
    const title = document.getElementById('editProductTitle').value;
    const description = document.getElementById('editProductDescription').value;
    const price = document.getElementById('editProductPrice').value;
    const category = document.getElementById('editProductCategory').value;
    const imageFile = document.getElementById('editProductImage').files[0];

    let imageUrl = null;
    if (imageFile) {
      const { data: imageData, error: imageError } = await supabase.storage
        .from('product-images')
        .upload(`public/${imageFile.name}`, imageFile);

      if (imageError) {
        console.error('Error uploading image:', imageError);
        return;
      }

      imageUrl = `${supabaseUrl}/storage/v1/object/public/product-images/${imageData.path}`;
    }

    const updateData = { title, description, price, category };
    if (imageUrl) {
      updateData.image_url = imageUrl;
    }

    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating product:', error);
      return;
    }

    editProductModal.style.display = 'none';
    await fetchProducts();
  });

  await checkAuth();
  await fetchCategories();
  await fetchProducts();
});