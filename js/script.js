const tbody = document.querySelector("tbody");
const descItem = document.querySelector("#desc");
const amount = document.querySelector("#amount");
const type = document.querySelector("#type");
const btnNew = document.querySelector("#btnNew");

const incomes = document.querySelector(".incomes");
const expenses = document.querySelector(".expenses");
const total = document.querySelector(".total");

let items = [];

// Event listener para o botão de inclusão de novo item
btnNew.addEventListener("click", addItem);

// Função para adicionar um novo item
function addItem() {
  if (isFormValid()) {
    items.push({
      desc: descItem.value,
      amount: Math.abs(amount.value).toFixed(2),
      type: type.value,
    });

    updateLocalStorage();
    loadItems();

    clearForm();
  } else {
    alert("Preencha todos os campos!");
  }
}

// Verifica se os campos do formulário estão preenchidos
function isFormValid() {
  return descItem.value !== "" && amount.value !== "" && type.value !== "";
}

// Limpa os campos do formulário
function clearForm() {
  descItem.value = "";
  amount.value = "";
}

// Remove um item da lista pelo índice
function deleteItem(index) {
  items.splice(index, 1);
  updateLocalStorage();
  loadItems();
}

// Insere um item na tabela
function insertItem(item, index) {
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${item.desc}</td>
    <td>R$ ${item.amount}</td>
    <td class="columnType">
      ${item.type === "Entrada" 
        ? '<i class="bx bx-plus-circle"></i>' 
        : '<i class="bx bx-minus-circle"></i>'}
    </td>
    <td class="columnAction">
      <button onclick="deleteItem(${index})"><i class="bx bx-trash"></i></button>
    </td>
  `;

  tbody.appendChild(tr);
}

// Carrega os itens do localStorage e os exibe
function loadItems() {
  items = getItemsFromLocalStorage();
  tbody.innerHTML = "";
  
  items.forEach((item, index) => {
    insertItem(item, index);
  });

  updateTotals();
}

// Atualiza os totais de entradas, saídas e saldo
function updateTotals() {
  const totalIncomes = calculateTotal("Entrada").toFixed(2);
  const totalExpenses = calculateTotal("Saída").toFixed(2);
  const totalItems = (totalIncomes - totalExpenses).toFixed(2);

  incomes.innerHTML = totalIncomes;
  expenses.innerHTML = totalExpenses;
  total.innerHTML = totalItems;
}

// Calcula o total baseado no tipo (Entrada ou Saída)
function calculateTotal(type) {
  return items
    .filter(item => item.type === type)
    .reduce((acc, item) => acc + Number(item.amount), 0);
}

// Recupera os itens do localStorage
const getItemsFromLocalStorage = () => JSON.parse(localStorage.getItem("db_items")) || [];

// Atualiza os itens no localStorage
const updateLocalStorage = () => {
  localStorage.setItem("db_items", JSON.stringify(items));
};

// Carrega os itens ao iniciar
loadItems();