document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('.product-list table tbody');
    const addButton = document.querySelector('.add-button');

    // Fetch and populate the game top-ups table
    async function fetchGameTopUps() {
        try {
            const response = await fetch('/api/game-topups');
            const gameTopUps = await response.json();

            console.log('Fetched Game Top-Ups:', gameTopUps);

            // Clear the table
            tableBody.innerHTML = '';

            // Populate the table
            gameTopUps.forEach(gameTopUps => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${gameTopUps.id}</td>
                    <td>${gameTopUps.option_name}</td>
                    <td>${gameTopUps.price.toLocaleString('vi-VN')} VND</td>
                    <td>${gameTopUps.ImageLink}</td>
                    <td>
                        <button class="edit-button" data-id="${gameTopUps.id}">Edit</button>
                        <button class="delete-button" data-id="${gameTopUps.id}">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            // Attach event listeners for edit and delete buttons
            attachEventListeners();
        } catch (error) {
            console.error('Error fetching Game top-ups:', error);
        }
    }

    // Add a new game top-up (Frontend only, confirmed via backend)
    function addNewGameTopUpRow() {
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

            // Send the new game top-up data to the backend
            try {
                const response = await fetch('/api/game-topups', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, price, ImageLink })
                });

                if (response.ok) {
                    alert('Game top-up added successfully!');
                    fetchGameTopUps(); // Refresh the table
                } else {
                    const error = await response.json();
                    alert('Error adding game top-up: ' + error.message);
                }
            } catch (error) {
                console.error('Error adding game top-up:', error);
            }
        });

        cancelButton.addEventListener('click', () => {
            row.remove();
        });
    }

    // Delete a game top-up
    async function deleteGameTopUp(gameTopUpId) {
        if (!confirm('Are you sure you want to delete this game top-up?')) return;

        try {
            const response = await fetch(`/api/game-topups/${gameTopUpId}`, { method: 'DELETE' });

            if (response.ok) {
                alert('Game top-up deleted successfully!');
                fetchGameTopUps(); // Refresh the table
            } else {
                const error = await response.json();
                alert('Error deleting game top-up: ' + error.message);
            }
        } catch (error) {
            console.error('Error deleting game top-up:', error);
        }
    }

    // Edit a game top-up
    function editGameTopUpRow(row, gameTopUpId) {
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
                const response = await fetch(`/api/game-topups/${gameTopUpId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, price, ImageLink })
                });

                if (response.ok) {
                    alert('Game top-up updated successfully!');
                    fetchGameTopUps(); // Refresh the table
                } else {
                    const error = await response.json();
                    alert('Error updating game top-up: ' + error.message);
                }
            } catch (error) {
                console.error('Error updating game top-up:', error);
            }
        });

        cancelButton.addEventListener('click', () => {
            nameCell.textContent = originalName;
            priceCell.textContent = `${parseFloat(originalPrice).toLocaleString('vi-VN')} VND`;
            imageLinkCell.textContent = originalImageLink;
            actionCell.innerHTML = `
                <button class="edit-button" data-id="${gameTopUpId}">Edit</button>
                <button class="delete-button" data-id="${gameTopUpId}">Delete</button>
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
                const gameTopUpId = button.dataset.id;
                editGameTopUpRow(row, gameTopUpId);
            });
        });

        deleteButtons.forEach(button => {
            button.addEventListener('click', () => {
                const gameTopUpId = button.dataset.id;
                deleteGameTopUp(gameTopUpId);
            });
        });
    }

    // Event listener for add button
    addButton.addEventListener('click', addNewGameTopUpRow);

    // Initial fetch of game top-ups
    fetchGameTopUps();
});
