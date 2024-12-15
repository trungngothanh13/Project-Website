document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('.product-list table tbody');
    const addButton = document.querySelector('.add-button');

    // Fetch and populate the foods table
    async function fetchFoods() {
        try {
            const response = await fetch('/api/foods');
            const foods = await response.json();

            // Clear the table
            tableBody.innerHTML = '';

            // Populate the table
            foods.forEach(food => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${food.id}</td>
                    <td>${food.name}</td>
                    <td>${food.price.toLocaleString('vi-VN')} VND</td>
                    <td>${food.ImageLink}</td>
                    <td>
                        <button class="edit-button" data-id="${food.id}">Edit</button>
                        <button class="delete-button" data-id="${food.id}">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            // Attach event listeners for edit and delete buttons
            attachEventListeners();
        } catch (error) {
            console.error('Error fetching foods:', error);
        }
    }

    // Add a new food (Frontend only, confirmed via backend)
    function addNewFoodRow() {
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

            // Send the new food data to the backend
            try {
                const response = await fetch('/api/foods', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, price, ImageLink })
                });

                if (response.ok) {
                    alert('Food added successfully!');
                    fetchFoods(); // Refresh the table
                } else {
                    const error = await response.json();
                    alert('Error adding food: ' + error.message);
                }
            } catch (error) {
                console.error('Error adding food:', error);
            }
        });

        cancelButton.addEventListener('click', () => {
            row.remove();
        });
    }

    // Delete a food
    async function deleteFood(foodId) {
        if (!confirm('Are you sure you want to delete this food?')) return;

        try {
            const response = await fetch(`/api/foods/${foodId}`, { method: 'DELETE' });

            if (response.ok) {
                alert('Food deleted successfully!');
                fetchFoods(); // Refresh the table
            } else {
                const error = await response.json();
                alert('Error deleting food: ' + error.message);
            }
        } catch (error) {
            console.error('Error deleting food:', error);
        }
    }

    // Edit a food
    function editFoodRow(row, foodId) {
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
                const response = await fetch(`/api/foods/${foodId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, price, ImageLink })
                });

                if (response.ok) {
                    alert('Food updated successfully!');
                    fetchFoods(); // Refresh the table
                } else {
                    const error = await response.json();
                    alert('Error updating food: ' + error.message);
                }
            } catch (error) {
                console.error('Error updating food:', error);
            }
        });

        cancelButton.addEventListener('click', () => {
            nameCell.textContent = originalName;
            priceCell.textContent = `${parseFloat(originalPrice).toLocaleString('vi-VN')} VND`;
            imageLinkCell.textContent = originalImageLink;
            actionCell.innerHTML = `
                <button class="edit-button" data-id="${foodId}">Edit</button>
                <button class="delete-button" data-id="${foodId}">Delete</button>
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
                const foodId = button.dataset.id;
                editFoodRow(row, foodId);
            });
        });

        deleteButtons.forEach(button => {
            button.addEventListener('click', () => {
                const foodId = button.dataset.id;
                deleteFood(foodId);
            });
        });
    }

    // Event listener for add button
    addButton.addEventListener('click', addNewFoodRow);

    // Initial fetch of foods
    fetchFoods();
});
