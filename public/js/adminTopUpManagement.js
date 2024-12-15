document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('.product-list table tbody');
    const addButton = document.querySelector('.add-button');

    // Fetch and populate the top_up table
    async function fetchTopUps() {
        try {
            const response = await fetch('/api/topups');
            const topUps = await response.json();

            // Clear the table
            tableBody.innerHTML = '';

            // Populate the table
            topUps.forEach(topUp => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${topUp.id}</td>
                    <td>${topUp.name}</td>
                    <td>${topUp.price.toLocaleString('vi-VN')} VND</td>
                    <td>${topUp.ImageLink}</td>
                    <td>
                        <button class="edit-button" data-id="${topUp.id}">Edit</button>
                        <button class="delete-button" data-id="${topUp.id}">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            // Attach event listeners for edit and delete buttons
            attachEventListeners();
        } catch (error) {
            console.error('Error fetching top-ups:', error);
        }
    }

    // Add a new top_up (Frontend only, confirmed via backend)
    function addNewTopUpRow() {
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

            // Send the new top_up data to the backend
            try {
                const response = await fetch('/api/topups', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, price, ImageLink })
                });

                if (response.ok) {
                    alert('Top-up added successfully!');
                    fetchTopUps(); // Refresh the table
                } else {
                    const error = await response.json();
                    alert('Error adding top-up: ' + error.message);
                }
            } catch (error) {
                console.error('Error adding top-up:', error);
            }
        });

        cancelButton.addEventListener('click', () => {
            row.remove();
        });
    }

    // Delete a top-up
    async function deleteTopUp(topUpId) {
        if (!confirm('Are you sure you want to delete this top-up?')) return;

        try {
            const response = await fetch(`/api/topups/${topUpId}`, { method: 'DELETE' });

            if (response.ok) {
                alert('Top-up deleted successfully!');
                fetchTopUps(); // Refresh the table
            } else {
                const error = await response.json();
                alert('Error deleting top-up: ' + error.message);
            }
        } catch (error) {
            console.error('Error deleting top-up:', error);
        }
    }

    // Edit a top_up
    function editTopUpRow(row, topUpId) {
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
                const response = await fetch(`/api/topups/${topUpId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, price, ImageLink })
                });

                if (response.ok) {
                    alert('Top-up updated successfully!');
                    fetchTopUps(); // Refresh the table
                } else {
                    const error = await response.json();
                    alert('Error updating top-up: ' + error.message);
                }
            } catch (error) {
                console.error('Error updating top-up:', error);
            }
        });

        cancelButton.addEventListener('click', () => {
            nameCell.textContent = originalName;
            priceCell.textContent = `${parseFloat(originalPrice).toLocaleString('vi-VN')} VND`;
            imageLinkCell.textContent = originalImageLink;
            actionCell.innerHTML = `
                <button class="edit-button" data-id="${topUpId}">Edit</button>
                <button class="delete-button" data-id="${topUpId}">Delete</button>
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
                const topUpId = button.dataset.id;
                editTopUpRow(row, topUpId);
            });
        });

        deleteButtons.forEach(button => {
            button.addEventListener('click', () => {
                const topUpId = button.dataset.id;
                deleteTopUp(topUpId);
            });
        });
    }

    // Event listener for add button
    addButton.addEventListener('click', addNewTopUpRow);

    // Initial fetch of top_up
    fetchTopUps();
});
