// ===============================
// LOAD SAVED DATA
// ===============================

let transactions =
    JSON.parse(localStorage.getItem("transactions")) || [];

let budget =
    Number(localStorage.getItem("budget")) || 0;

let expenseChart;


// ===============================
// LOAD APPLICATION
// ===============================

displayAllTransactions();

updateAllSummary();

updateBudgetStatus();

createExpenseChart();

updateMonthlySummary();


// ===============================
// ADD TRANSACTION
// ===============================

function addTransaction() {

    let description =
        document.getElementById("description").value;

    let amount =
        document.getElementById("amount").value;

    let type =
        document.getElementById("type").value;

    let category =
        document.getElementById("category").value;

    let date =
        document.getElementById("date").value;


    // Check required fields

    if (
        description === "" ||
        amount === "" ||
        date === ""
    ) {

        alert("Please fill all the fields");

        return;
    }


    // Expense must have a category

    if (
        type === "expense" &&
        category === ""
    ) {

        alert("Please select a category");

        return;
    }


    // Create transaction

    let transaction = {

        id: Date.now(),

        description: description,

        amount: Number(amount),

        type: type,

        category: type === "expense"
            ? category
            : "",

        date: date
    };


    // Add transaction to array

    transactions.push(transaction);


    // Save to localStorage

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );


    // Update everything

    displayAllTransactions();

    updateAllSummary();

    updateBudgetStatus();

    createExpenseChart();

    updateMonthlySummary();


    // Clear form

    document.getElementById("description").value = "";

    document.getElementById("amount").value = "";

    document.getElementById("category").value = "";

    document.getElementById("date").value = "";

}


// ===============================
// DISPLAY TRANSACTIONS
// ===============================

function displayAllTransactions() {

    let list = document.getElementById("transactionList");

    let searchText =
        document.getElementById("search").value.toLowerCase();

    list.innerHTML = "";

    transactions.forEach(function(transaction) {

        let searchData =
            (
                transaction.description +
                " " +
                transaction.category +
                " " +
                transaction.date +
                " " +
                transaction.type
            ).toLowerCase();


        if (!searchData.includes(searchText)) {
            return;
        }


        let li = document.createElement("li");

        let isExpense = transaction.type === "expense";

        let categoryText = transaction.category
            ? transaction.category + " | "
            : "";


        li.innerHTML = `

            <span class="transaction-info">

                <strong>
                    ${transaction.description}
                </strong>

                <small>
                    ${categoryText}${transaction.date}
                </small>

            </span>


            <span class="transaction-right">

                <strong class="${isExpense ? "expense-amount" : "income-amount"}">

                    ${isExpense ? "-" : "+"}₹${transaction.amount}

                </strong>


                <button
                    class="delete-btn"
                    onclick="deleteTransaction(${transaction.id})"
                >
                    Delete
                </button>

            </span>

        `;


        li.className = isExpense
            ? "expense-transaction"
            : "income-transaction";


        list.appendChild(li);

    });

}
// ===============================
// UPDATE SUMMARY
// ===============================

function updateAllSummary() {

    let totalIncome = 0;

    let totalExpense = 0;


    transactions.forEach(function(transaction) {

        if (transaction.type === "income") {

            totalIncome += transaction.amount;

        } else {

            totalExpense += transaction.amount;

        }

    });


    document.getElementById("income").innerText =
        "₹" + totalIncome;


    document.getElementById("expense").innerText =
        "₹" + totalExpense;


    document.getElementById("balance").innerText =
        "₹" + (totalIncome - totalExpense);

}


// ===============================
// DELETE TRANSACTION
// ===============================

function deleteTransaction(id) {

    let confirmDelete =
        confirm(
            "Are you sure you want to delete this transaction?"
        );


    if (!confirmDelete) {

        return;

    }


    transactions =
        transactions.filter(function(transaction) {

            return transaction.id !== id;

        });


    // Save updated list

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );


    // Update everything

    displayAllTransactions();

    updateAllSummary();

    updateBudgetStatus();

    createExpenseChart();

   updateMonthlySummary();

}


// ===============================
// SAVE BUDGET
// ===============================

function saveBudget() {

    let budgetInput =
        document.getElementById("budget").value;


    if (budgetInput === "") {

        alert("Please enter a budget");

        return;

    }


    budget =
        Number(budgetInput);


    if (budget <= 0) {

        alert("Budget must be greater than 0");

        return;

    }


    // Save budget

    localStorage.setItem(
        "budget",
        budget
    );


    // Clear input

    document.getElementById("budget").value = "";


    // Update budget status

    updateBudgetStatus();

}


// ===============================
// UPDATE BUDGET STATUS
// ===============================

function updateBudgetStatus() {

    let status =
        document.getElementById("budgetStatus");


    if (budget <= 0) {

        status.innerText =
            "Budget: ₹0";

        status.style.color = "#222";

        return;

    }


    let totalExpense = 0;


    transactions.forEach(function(transaction) {

        if (transaction.type === "expense") {

            totalExpense += transaction.amount;

        }

    });


    let remaining =
        budget - totalExpense;


    if (remaining >= 0) {

        status.innerText =
            "Budget: ₹" +
            budget +
            " | Remaining: ₹" +
            remaining;

        status.style.color = "green";

    } else {

        status.innerText =
            "Budget Exceeded by ₹" +
            Math.abs(remaining);

        status.style.color = "red";

    }

}


// ===============================
// CREATE EXPENSE CHART
// ===============================

function createExpenseChart() {

    let categories = {

        Food: 0,

        Shopping: 0,

        Transport: 0,

        Bills: 0,

        Entertainment: 0,

        Other: 0

    };


    // Calculate category totals

    transactions.forEach(function(transaction) {

        if (
            transaction.type === "expense" &&
            categories.hasOwnProperty(transaction.category)
        ) {

            categories[transaction.category] +=
                transaction.amount;

        }

    });


    let chartData =
        Object.values(categories);


    let chartLabels =
        Object.keys(categories);


    // Remove old chart

    if (expenseChart) {

        expenseChart.destroy();

    }


    // Create new chart

    expenseChart = new Chart(

        document.getElementById("expenseChart"),

        {

            type: "pie",


            data: {

                labels: chartLabels,


                datasets: [

                    {

                        data: chartData

                    }

                ]

            },


            options: {

                responsive: true,

                maintainAspectRatio: false

            }

        }

    );

}

function updateMonthlySummary() {

    let selectedMonth =
        Number(document.getElementById("monthSelect").value);

    let selectedYear =
        Number(document.getElementById("yearSelect").value);


    let monthlyIncome = 0;

    let monthlyExpense = 0;

    let monthlyTransactions = 0;


    transactions.forEach(function(transaction) {

        let transactionDate =
            new Date(transaction.date);


        if (
            transactionDate.getMonth() === selectedMonth &&
            transactionDate.getFullYear() === selectedYear
        ) {

            monthlyTransactions++;


            if (transaction.type === "income") {

                monthlyIncome += transaction.amount;

            } else {

                monthlyExpense += transaction.amount;

            }

        }

    });


    document.getElementById("monthlyIncome").innerText =
        "₹" + monthlyIncome;


    document.getElementById("monthlyExpense").innerText =
        "₹" + monthlyExpense;


    document.getElementById("monthlyTransactions").innerText =
        monthlyTransactions;

}