document.addEventListener('DOMContentLoaded', () => {
    const productListTable = document.querySelector('.product-list table tbody');
    const addButton = document.querySelector('.add-button');

    // Handle Add Item
    addButton.addEventListener('click', () => {
        // Create a new row with input fields
        const newRow = document.createElement('tr');

        newRow.innerHTML = `
            <td class="auto-id"></td>
            <td><input type="text" class="new-product-name" placeholder="Product Name"></td>
            <td><input type="number" step="1000" class="new-product-price" placeholder="Price (VND)"></td>
            <td><input type="text" class="new-product-image" placeholder="/assets/image_name.png"></td>
            <td>
                <button class="confirm-button">Confirm</button>
                <button class="cancel-button">Cancel</button>
            </td>
        `;

        productListTable.appendChild(newRow);
        updateAutoIDs();

        // Attach event listeners for the new buttons
        const confirmButton = newRow.querySelector('.confirm-button');
        const cancelButton = newRow.querySelector('.cancel-button');

        confirmButton.addEventListener('click', () => {
            confirmNewItem(newRow);
        });

        cancelButton.addEventListener('click', () => {
            newRow.remove();
            updateAutoIDs();
        });
    });

    // Handle Delete Item
    productListTable.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-button')) {
            const row = event.target.closest('tr');
            row.remove();
            updateAutoIDs();
        }
    });

    // Placeholder for Edit button (no functionality yet)
    productListTable.addEventListener('click', (event) => {
        if (event.target.classList.contains('edit-button')) {
            // Future implementation for editing existing items
            console.log('Edit button clicked (not implemented yet).');
        }
    });

    function confirmNewItem(row) {
        const nameInput = row.querySelector('.new-product-name');
        const priceInput = row.querySelector('.new-product-price');
        const imageInput = row.querySelector('.new-product-image');

        const productName = nameInput.value.trim();
        const productPrice = parseInt(priceInput.value.trim(), 10);
        const productImage = imageInput.value.trim();

        // Basic validation
        if (!productName || isNaN(productPrice) || !productImage) {
            alert('Please fill out all fields correctly before confirming.');
            return;
        }

        // Replace input fields with static text
        row.innerHTML = `
            <td class="auto-id"></td>
            <td>${productName}</td>
            <td>${productPrice.toLocaleString('vi-VN')} VND</td>
            <td>${productImage}</td>
            <td>
                <button class="edit-button">Edit</button>
                <button class="delete-button">Delete</button>
            </td>
        `;

        updateAutoIDs();
    }

    function updateAutoIDs() {
        // Automatically update the first column with IDs based on current position
        const rows = productListTable.querySelectorAll('tr');
        rows.forEach((row, index) => {
            const idCell = row.querySelector('.auto-id');
            if (idCell) {
                idCell.textContent = index + 1; // 1-based indexing
            }
        });
    }

    // Initial ID update if there are existing rows
    updateAutoIDs();
});
