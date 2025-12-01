const apiUrl = "http://3.134.94.155:3000/products";

// =======================
// LISTAR PRODUTOS
// =======================
async function fetchProducts() {
  const response = await fetch(apiUrl);
  const products = await response.json();

  const productList = document.getElementById("products");
  productList.innerHTML = "";

  products.forEach(product => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${product.name} - $${product.price}
      <button onclick="deleteProduct(${product.id})">Delete</button>
      <button onclick="updateProductPrompt(${product.id}, '${product.name}', ${product.price})">Update</button>
    `;
    productList.appendChild(li);
  });
}

// =======================
// ADICIONAR PRODUTO
// =======================
document.getElementById("add-product-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;

  await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, price })
  });

  document.getElementById("add-product-form").reset();
  fetchProducts();
});

// =======================
// DELETAR PRODUTO
// =======================
async function deleteProduct(id) {
  await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
  fetchProducts();
}

// =======================
// ATUALIZAR PRODUTO
// =======================
async function updateProduct(id, name, price) {
  await fetch(`${apiUrl}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, price })
  });

  fetchProducts();
}

// Abre prompt para editar
function updateProductPrompt(id, oldName, oldPrice) {
  const name = prompt("Novo nome:", oldName);
  const price = prompt("Novo preço:", oldPrice);

  if (name && price) {
    updateProduct(id, name, price);
  }
}

