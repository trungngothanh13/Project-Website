document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('.product-list table tbody');
    const addButton = document.querySelector('.add-button');

    // Fetch and populate the user table
    async function fetchUsers() {
        try {
            const response = await fetch('/api/manageCustomer');
            const users = await response.json();

            // Clear the table
            tableBody.innerHTML = '';

            // Populate the table
            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.password}</td>
                    <td>${user.full_name}</td>
                    <td>
                        <button class="edit-button" data-id="${user.id}">Edit</button>
                        <button class="delete-button" data-id="${user.id}">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            attachEventListeners();
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }

    // Add a new user row
    function addNewUserRow() {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>New</td>
            <td><input type="text" placeholder="Username" class="new-username"></td>
            <td><input type="password" placeholder="Password" class="new-password"></td>
            <td><input type="text" placeholder="Full Name" class="new-full-name"></td>
            <td>
                <button class="confirm-button">Confirm</button>
                <button class="cancel-button">Cancel</button>
            </td>
        `;
        tableBody.appendChild(row);

        const confirmButton = row.querySelector('.confirm-button');
        const cancelButton = row.querySelector('.cancel-button');

        confirmButton.addEventListener('click', async () => {
            const username = row.querySelector('.new-username').value;
            const password = row.querySelector('.new-password').value;
            const full_name = row.querySelector('.new-full-name').value;

            if (!username || !password || !full_name) {
                alert('All fields are required.');
                return;
            }

            // Send the new user data to the backend
            try {
                const response = await fetch('/api/manageCustomer', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password, full_name }),
                });

                if (response.ok) {
                    alert('User added successfully!');
                    fetchUsers(); // Refresh the table
                } else {
                    const error = await response.json();
                    alert('Error adding user: ' + error.message);
                }
            } catch (error) {
                console.error('Error adding user:', error);
            }
        });

        cancelButton.addEventListener('click', () => {
            row.remove();
        });
    }

    // Delete a user
    async function deleteUser(userId) {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            const response = await fetch(`/api/manageCustomer/${userId}`, { method: 'DELETE' });

            if (response.ok) {
                alert('User deleted successfully!');
                fetchUsers(); // Refresh the table
            } else {
                const error = await response.json();
                alert('Error deleting user: ' + error.message);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    }

    // Edit a user row
    function editUserRow(row, userId) {
        const usernameCell = row.children[1];
        const passwordCell = row.children[2];
        const fullNameCell = row.children[3];
        const actionCell = row.children[4];

        const originalUsername = usernameCell.textContent;
        const originalPassword = passwordCell.textContent;
        const originalFullName = fullNameCell.textContent;

        // Replace cells with input fields
        usernameCell.innerHTML = `<input type="text" class="edit-username" value="${originalUsername}">`;
        passwordCell.innerHTML = `<input type="password" class="edit-password" value="${originalPassword}">`;
        fullNameCell.innerHTML = `<input type="text" class="edit-full-name" value="${originalFullName}">`;

        // Replace action buttons
        actionCell.innerHTML = `
            <button class="save-button">Save</button>
            <button class="cancel-button">Cancel</button>
        `;

        const saveButton = actionCell.querySelector('.save-button');
        const cancelButton = actionCell.querySelector('.cancel-button');

        saveButton.addEventListener('click', async () => {
            const username = usernameCell.querySelector('.edit-username').value;
            const password = passwordCell.querySelector('.edit-password').value;
            const full_name = fullNameCell.querySelector('.edit-full-name').value;

            if (!username || !password || !full_name) {
                alert('All fields are required.');
                return;
            }

            // Send updated data to the backend
            try {
                const response = await fetch(`/api/manageCustomer/${userId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password, full_name }),
                });

                if (response.ok) {
                    alert('User updated successfully!');
                    fetchUsers(); // Refresh the table
                } else {
                    const error = await response.json();
                    alert('Error updating user: ' + error.message);
                }
            } catch (error) {
                console.error('Error updating user:', error);
            }
        });

        cancelButton.addEventListener('click', () => {
            usernameCell.textContent = originalUsername;
            passwordCell.textContent = originalPassword;
            fullNameCell.textContent = originalFullName;
            actionCell.innerHTML = `
                <button class="edit-button" data-id="${userId}">Edit</button>
                <button class="delete-button" data-id="${userId}">Delete</button>
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
                const userId = button.dataset.id;
                editUserRow(row, userId);
            });
        });

        deleteButtons.forEach(button => {
            button.addEventListener('click', () => {
                const userId = button.dataset.id;
                deleteUser(userId);
            });
        });
    }

    // Event listener for add button
    addButton.addEventListener('click', addNewUserRow);

    // Initial fetch of users
    fetchUsers();
});
