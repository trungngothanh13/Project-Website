document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('.product-list table tbody');
    const addButton = document.querySelector('.add-button');

    // Fetch and populate the drinks table
    async function fetchDrinks() {
        try {
            const response = await fetch('/api/drinks');
            const drinks = await response.json();

            // Clear the table
            tableBody.innerHTML = '';

            // Populate the table
            drinks.forEach(drink => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${drink.id}</td>
                    <td>${drink.name}</td>
                    <td>${drink.price.toLocaleString('vi-VN')} VND</td>
                    <td>${drink.ImageLink}</td>
                    <td>
                        <button class="edit-button" data-id="${drink.id}">Edit</button>
                        <button class="delete-button" data-id="${drink.id}">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            // Attach event listeners for edit and delete buttons
            attachEventListeners();
        } catch (error) {
            console.error('Error fetching drinks:', error);
        }
    }

    // Add a new drink (Frontend only, confirmed via backend)
    function addNewDrinkRow() {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>New</td>
            <td><input type="text" placeholder="Name" class="new-name"></td>
            <td><input type="number" placeholder="Price" class="new-price"></td>
            <td><input type="text" placeholder="Image Link" class="new-image-link"></td>
            <td>
                <button class="confirm-button">Confirm</button>
                <button class="cancel-button">Cancel</button>
            </td>
        `;
        tableBody.appendChild(row);

        // Attach event listeners for confirm and cancel buttons
        const confirmButton = row.querySelector('.confirm-button');
        const cancelButton = row.querySelector('.cancel-button');

        confirmButton.addEventListener('click', async () => {
            const name = row.querySelector('.new-name').value;
            const price = row.querySelector('.new-price').value;
            const ImageLink = row.querySelector('.new-image-link').value;

            if (!name || !price || !ImageLink) {
                alert('All fields are required.');
                return;
            }

            // Send the new drink data to the backend
            try {
                const response = await fetch('/api/drinks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, price, ImageLink })
                });

                if (response.ok) {
                    alert('Drink added successfully!');
                    fetchDrinks(); // Refresh the table
                } else {
                    const error = await response.json();
                    alert('Error adding drink: ' + error.message);
                }
            } catch (error) {
                console.error('Error adding drink:', error);
            }
        });

        cancelButton.addEventListener('click', () => {
            row.remove();
        });
    }

    // Delete a drink
    async function deleteDrink(drinkId) {
        if (!confirm('Are you sure you want to delete this drink?')) return;

        try {
            const response = await fetch(`/api/drinks/${drinkId}`, { method: 'DELETE' });

            if (response.ok) {
                alert('Drink deleted successfully!');
                fetchDrinks(); // Refresh the table
            } else {
                const error = await response.json();
                alert('Error deleting drink: ' + error.message);
            }
        } catch (error) {
            console.error('Error deleting drink:', error);
        }
    }

    // Edit a drink
    function editDrinkRow(row, drinkId) {
        const nameCell = row.children[1];
        const priceCell = row.children[2];
        const imageLinkCell = row.children[3];
        const actionCell = row.children[4];

        const originalName = nameCell.textContent;
        const originalPrice = priceCell.textContent.replace(' VND', '').replace(',', '');
        const originalImageLink = imageLinkCell.textContent;

        // Replace cells with input fields
        nameCell.innerHTML = `<input type="text" class="edit-name" value="${originalName}">`;
        priceCell.innerHTML = `<input type="number" class="edit-price" value="${originalPrice}">`;
        imageLinkCell.innerHTML = `<input type="text" class="edit-image-link" value="${originalImageLink}">`;

        // Replace action buttons
        actionCell.innerHTML = `
            <button class="save-button">Save</button>
            <button class="cancel-button">Cancel</button>
        `;

        const saveButton = actionCell.querySelector('.save-button');
        const cancelButton = actionCell.querySelector('.cancel-button');

        saveButton.addEventListener('click', async () => {
            const name = nameCell.querySelector('.edit-name').value;
            const price = priceCell.querySelector('.edit-price').value;
            const ImageLink = imageLinkCell.querySelector('.edit-image-link').value;

            if (!name || !price || !ImageLink) {
                alert('All fields are required.');
                return;
            }

            // Send updated data to the backend
            try {
                const response = await fetch(`/api/drinks/${drinkId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, price, ImageLink })
                });

                if (response.ok) {
                    alert('Drink updated successfully!');
                    fetchDrinks(); // Refresh the table
                } else {
                    const error = await response.json();
                    alert('Error updating drink: ' + error.message);
                }
            } catch (error) {
                console.error('Error updating drink:', error);
            }
        });

        cancelButton.addEventListener('click', () => {
            nameCell.textContent = originalName;
            priceCell.textContent = `${parseFloat(originalPrice).toLocaleString('vi-VN')} VND`;
            imageLinkCell.textContent = originalImageLink;
            actionCell.innerHTML = `
                <button class="edit-button" data-id="${drinkId}">Edit</button>
                <button class="delete-button" data-id="${drinkId}">Delete</button>
            `;
            attachEventListeners();
        });
    }

    // Attach event listeners to buttons
    function attachEventListeners() {
        const editButtons = document.querySelectorAll('.edit-button');
        const deleteButtons = document.querySelectorAll('.delete-button');

        editButtons.forEach(button => {
            button.addEventListener('click', () => {
                const row = button.closest('tr');
                const drinkId = button.dataset.id;
                editDrinkRow(row, drinkId);
            });
        });

        deleteButtons.forEach(button => {
            button.addEventListener('click', () => {
                const drinkId = button.dataset.id;
                deleteDrink(drinkId);
            });
        });
    }

    // Event listener for add button
    addButton.addEventListener('click', addNewDrinkRow);

    // Initial fetch of drinks
    fetchDrinks();
});
