document.addEventListener("DOMContentLoaded", () => {
    const productForm = document.getElementById("product-form");
    const inventoryTable = document.getElementById("inventory-table");
    const salesTable = document.getElementById("sales-table");
  
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const sales = JSON.parse(localStorage.getItem("sales")) || [];
  
    const saveProducts = () => localStorage.setItem("products", JSON.stringify(products));
    const saveSales = () => localStorage.setItem("sales", JSON.stringify(sales));
  
    const renderInventory = () => {
      inventoryTable.innerHTML = "";
      products.forEach((product, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${product.name}</td>
          <td>${product.category}</td>
          <td>R$ ${product.price.toFixed(2)}</td>
          <td>${product.quantity}</td>
          <td>
            <button class="sell" data-index="${index}">Vender</button>
            <button class="delete" data-index="${index}">Excluir</button>
          </td>
        `;
        inventoryTable.appendChild(row);
      });
    };
  
    const renderSales = () => {
      salesTable.innerHTML = "";
      sales.forEach(sale => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${sale.productName}</td>
          <td>${sale.quantity}</td>
          <td>R$ ${sale.total.toFixed(2)}</td>
          <td>${sale.date}</td>
        `;
        salesTable.appendChild(row);
      });
    };
  
    productForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = productForm.name.value;
      const category = productForm.category.value;
      const price = parseFloat(productForm.price.value);
      const quantity = parseInt(productForm.quantity.value);
  
      products.push({ name, category, price, quantity });
      saveProducts();
      renderInventory();
      productForm.reset();
    });
  
    inventoryTable.addEventListener("click", (e) => {
      const index = e.target.dataset.index;
      if (e.target.classList.contains("sell")) {
        const quantity = parseInt(prompt("Quantidade a vender:"));
        if (!quantity || quantity <= 0 || quantity > products[index].quantity) {
          alert("Quantidade inválida.");
          return;
        }
  
        const product = products[index];
        product.quantity -= quantity;
        sales.push({
          productName: product.name,
          quantity,
          total: quantity * product.price,
          date: new Date().toLocaleString()
        });
  
        if (product.quantity === 0) {
          alert(`O produto "${product.name}" está sem estoque!`);
        }
  
        saveProducts();
        saveSales();
        renderInventory();
        renderSales();
      }
  
      if (e.target.classList.contains("delete")) {
        products.splice(index, 1);
        saveProducts();
        renderInventory();
      }
    });
  
    renderInventory();
    renderSales();
  });
  