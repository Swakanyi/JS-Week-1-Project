// Defining variables
const incomeDesc = document.getElementById('income-description');
const incomeAmount = document.getElementById('income-amount');
const expenseDesc = document.getElementById('expense-description');
const expenseAmount = document.getElementById('expense-amount');
const expenseCategory = document.getElementById('expense-category');
const transactionHistory = document.getElementById('transaction-history');
const totalIncomeEl = document.getElementById('total-income');
const totalExpensesEl = document.getElementById('total-expenses');
const balanceEl = document.getElementById('balance');


let transactions = [];
let idCounter = 0;

// Add income
function addIncome() {
    const desc = incomeDesc.value.trim();
    const amount = parseFloat(incomeAmount.value);

    if (desc === '' || isNaN(amount) || amount <= 0) {
        alert('Please enter valid income description and amount.');
        return;
    }

    const transaction = {
        id: idCounter++,
        description: desc,
        category: 'Income',
        amount: amount,
        type: 'Income'
    };

    transactions.push(transaction);
    renderTransaction(transaction);
    updateSummary();
    incomeDesc.value = '';
    incomeAmount.value = '';
}

// Add expense
function addExpense() {
    const desc = expenseDesc.value.trim();
    const amount = parseFloat(expenseAmount.value);
    const category = expenseCategory.value;

    if (desc === '' || isNaN(amount) || amount <= 0) {
        alert('Please enter valid expense description and amount.');
        return;
    }

    const transaction = {
        id: idCounter++,
        description: desc,
        category: category,
        amount: amount,
        type: 'Expense'
    };

    transactions.push(transaction);
    renderTransaction(transaction);
    updateSummary();
    expenseDesc.value = '';
    expenseAmount.value = '';
}

// Transactions in the table
function renderTransaction(transaction) {
    const row = document.createElement('tr');
    row.setAttribute('data-id', transaction.id);

    row.innerHTML = `
        <td>${transaction.description}</td>
        <td>${transaction.category}</td>
        <td>${transaction.amount.toFixed(2)}</td>
        <td>${transaction.type}</td>
        <td><button class="delete-btn">Delete</button></td>
    `;
    transactionHistory.appendChild(row);


    //delete handler
    row.querySelector('.delete-btn').addEventListener('click', function () {
        deleteTransaction(transaction.id);
    });

}
saveTransactionsToCookie();

function deleteTransaction(id) {
    // Remove from array
    transactions = transactions.filter(tx => tx.id !== id);

    // Remove from table
    const rowToRemove = transactionHistory.querySelector(`tr[data-id="${id}"]`);
    if (rowToRemove) {
        transactionHistory.removeChild(rowToRemove);
    } 
};
saveTransactionsToCookie();


    //filter function
    function filterTransactions(type) {
    transactionHistory.innerHTML = ''; // Clear current rows

    let filtered = [];

    if (type === 'income') {
        filtered = transactions.filter(tx => tx.type === 'Income');
    } else if (type === 'expense') {
        filtered = transactions.filter(tx => tx.type === 'Expense');
    } else {
        filtered = transactions;
    }

    filtered.forEach(tx => renderTransaction(tx));
}


// Update summary
function updateSummary() {
    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach((tx) => {
        if (tx.type === 'Income') {
            totalIncome += tx.amount;
        } else {
            totalExpenses += tx.amount;
        }
    });

    totalIncomeEl.textContent = totalIncome.toFixed(2);
    totalExpensesEl.textContent = totalExpenses.toFixed(2);
    balanceEl.textContent = (totalIncome - totalExpenses).toFixed(2);
}

// Clear all
function clearAll() {
    transactions = [];
    transactionHistory.innerHTML = '';
    updateSummary();
}


// Save to cookie
function saveTransactionsToCookie() {
    const cookieValue = encodeURIComponent(JSON.stringify(transactions));
    document.cookie = `transactions=${cookieValue}; path=/; max-age=31536000`;
}

// Load from cookie
function loadTransactionsFromCookie() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'transactions') {
            try {
                transactions = JSON.parse(decodeURIComponent(value));
            } catch (e) {
                transactions = [];
            }
        }
    }
}

// On page load
window.addEventListener('DOMContentLoaded', function () {
    loadTransactionsFromCookie();
    transactions.forEach(tx => renderTransaction(tx));
    updateSummary();
});

