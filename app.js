// Seleção de elementos
const productList = document.querySelector('#products');
const addProductForm = document.querySelector('#add-product-form');
const updateProductForm = document.querySelector('#update-product-form'); // Se quiser usar formulário separado
const updateProductId = document.querySelector('#update-id');
const updateProductName = document.querySelector('#update-name');
const updateProductPrice = document.querySelector('#update-price');
const updateProductDescription = document.querySelector('#update-description');

const consultProductForm = document.querySelector('#consult-product-form');
const consultResult = document.querySelector('#consult-result');

// ======================
// Função para buscar todos os produtos
// ======================
async function fetchProducts() {
  try {
    const response = await fetch('http://localhost:3000/products');
    const products = await response.json();

    productList.innerHTML = '';

    products.forEach(product => {
      const li = document.createElement('li');
      li.innerHTML = `ID: ${product.id} - ${product.name} - $${product.price} - ${product.description}`;

      // Botão Delete
      const deleteButton = document.createElement('button');
      deleteButton.innerHTML = 'Delete';
      deleteButton.addEventListener('click', async () => {
        await deleteProduct(product.id);
        await fetchProducts();
      });
      li.appendChild(deleteButton);

      // Botão Update
      const updateButton = document.createElement('button');
      updateButton.innerHTML = 'Update';
      updateButton.addEventListener('click', () => {
        // Preenche os campos do formulário de update
        updateProductId.value = product.id;
        updateProductName.value = product.name;
        updateProductPrice.value = product.price;
        updateProductDescription.value = product.description;
      });
      li.appendChild(updateButton);

      productList.appendChild(li);
    });
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
  }
}

// ======================
// Adicionar produto
// ======================
addProductForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const name = addProductForm.elements['name'].value;
  const price = addProductForm.elements['price'].value;
  const description = addProductForm.elements['description'].value;

  await addProduct(name, price, description);
  addProductForm.reset();
  await fetchProducts();
});

async function addProduct(name, price, description) {
  try {
    const response = await fetch('http://localhost:3000/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, price, description })
    });

    if (!response.ok) {
      console.error('Falha ao adicionar produto');
    }
  } catch (error) {
    console.error('Erro ao adicionar produto:', error);
  }
}

// ======================
// Atualizar produto
// ======================
if (updateProductForm) {
  updateProductForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const id = updateProductId.value;
    const name = updateProductName.value;
    const price = updateProductPrice.value;
    const description = updateProductDescription.value;

    await updateProduct(id, name, price, description);
    updateProductForm.reset();
    await fetchProducts();
  });
}

async function updateProduct(id, name, price, description) {
  try {
    const response = await fetch(`http://localhost:3000/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, price, description })
    });

    if (!response.ok) {
      console.error('Falha ao atualizar produto');
    }
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
  }
}

// ======================
// Deletar produto
// ======================
async function deleteProduct(id) {
  try {
    const response = await fetch(`http://localhost:3000/products/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      console.error('Falha ao deletar produto');
    }
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
  }
}

// ======================
// Consultar produto por ID
// ======================
consultProductForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const id = consultProductForm.elements['id'].value;
  await fetchProductById(id);
});

async function fetchProductById(id) {
  try {
    const response = await fetch(`http://localhost:3000/products/${id}`);

    if (!response.ok) {
      consultResult.innerHTML = `<li>Produto com ID ${id} não encontrado.</li>`;
      return;
    }

    const product = await response.json();
    consultResult.innerHTML = `<li>ID: ${product.id} - ${product.name} - $${product.price} - ${product.description}</li>`;
  } catch (error) {
    console.error('Erro ao consultar produto:', error);
    consultResult.innerHTML = `<li>Erro ao consultar produto.</li>`;
  }
}

// ======================
// Inicializa lista ao carregar página
// ======================
fetchProducts();
