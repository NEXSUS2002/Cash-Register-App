document.addEventListener("DOMContentLoaded", () => {
    // Get HTML elements by their IDs and store them in variables
    const itemPriceInput = document.getElementById("item-price");
    const cashInput = document.getElementById("cash");
    const purchaseBtn = document.getElementById("purchase-btn");
    const clearBtn = document.getElementById("clear-btn");
    const priceDisplay = document.getElementById("price");
    const changeDisplay = document.getElementById("change");
    const changeDueDiv = document.getElementById("change-due");
    const cashInDrawerDiv = document.getElementById("cash-in-drawer");
    const cashInDrawerTable = document.getElementById("cash-in-drawer-table").querySelector('tbody');

    const themeToggle = document.getElementById("theme-toggle");

    // Initial cash in drawer with various denominations and counts
    let cashInDrawer = {
        '1000': 5,
        '500': 10,
        '200': 5,
        '100': 20,
        '50': 30
    }; 

    // Toggle theme between light and dark mode
    themeToggle.addEventListener("change", () => {
        if (themeToggle.checked) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    });

    // Handle the purchase process when the purchase button is clicked
    purchaseBtn.addEventListener("click", () => {
        let itemPrice = parseFloat(itemPriceInput.value);
        const cashProvided = parseFloat(cashInput.value);
        let errorMessage = "";

        // Validate input values
        if (isNaN(itemPrice) || isNaN(cashProvided)) {
            errorMessage = "<b>Enter valid numbers for both item price and cash provided.</b>";
            handleErrors(errorMessage);
            return;
        }

        // Calculate required change
        let changeRequired = cashProvided - itemPrice;
        if (cashProvided < itemPrice) {
            errorMessage = `<b>INSUFFICIENT AMOUNT:</b> You need to provide an additional ₦${Math.round(itemPrice - cashProvided)} to complete the purchase.`;
            handleErrors(errorMessage);
            return;
        } else if (!calculateChange(changeRequired, cashInDrawer)) {
            errorMessage = `<b>INSUFFICIENT CHANGE:</b> Please provide exact change if possible or wait while we arrange for the correct change.`;
            handleErrors(errorMessage);
            return;
        } else {
            // Display calculated change and update cash in drawer
            let changeInDrawer = calculateChange(changeRequired, cashInDrawer);
            changeDueDiv.textContent = `Your change is ₦${Math.round(changeRequired)}. Thank you for shopping with us!`;
            changeDisplay.textContent = formatChange(changeInDrawer);
            updateCashInDrawer(changeRequired, cashInDrawer);
            displayCashInDrawer();
            changeDisplay.classList.add("show");
            changeDueDiv.classList.add("show");
        }
    });

    clearBtn.addEventListener("click", () => {
        // This function handles clearing the input fields and messages
        itemPriceInput.value = "";
        cashInput.value = "";
        changeDueDiv.textContent = "";
        changeDisplay.textContent = "";
        priceDisplay.textContent = "";
        changeDisplay.classList.remove("show");
        changeDueDiv.classList.remove("show");
    });

    // Display error messages
    function handleErrors(message) {
        changeDueDiv.innerHTML = message;
        changeDisplay.textContent = "";
        changeDisplay.classList.remove("show");
        changeDueDiv.classList.add("show");
    }

    // Calculate the change to be given from the cash drawer
    function calculateChange(amount, drawer) {
        let change = {};
        let remaining = amount;
        const denominations = [1000, 500, 200, 100, 50];
        for (let denom of denominations) {
            if (remaining >= denom && drawer[denom] > 0) {
                let count = Math.min(Math.floor(remaining / denom), drawer[denom]);
                change[denom] = count;
                remaining -= count * denom;
            }
        }
        return remaining <= 0 ? change : null; // Ensure remaining is zero or negative
    }

    // Format the change object into a readable string
    function formatChange(change) {
        let formatted = "Change given is: ";
        for (let denom in change) {
            formatted += `₦${denom} x ${change[denom]}, `;
        }
        return formatted.slice(0, -2);
    }

    // Update the cash in drawer after giving the change
    function updateCashInDrawer(amount, drawer) {
        const denominations = [1000, 500, 200, 100, 50];
        for (let denom of denominations) {
            while (amount >= denom && drawer[denom] > 0) {
                let count = Math.min(Math.floor(amount / denom), drawer[denom]);
                drawer[denom] -= count;
                amount -= count * denom;
            }
        }
    }

    // Display the current state of the cash drawer in a table
    function displayCashInDrawer() {
        cashInDrawerTable.innerHTML = ""; // Clear existing rows
        for (let denom in cashInDrawer) {
            let row = cashInDrawerTable.insertRow();
            let cell1 = row.insertCell(0);
            let cell2 = row.insertCell(1);
            cell1.textContent = `₦${denom}`;
            cell2.textContent = cashInDrawer[denom];
        }
    }

    // Initial display of the cash drawer when the page loads
    displayCashInDrawer();
});