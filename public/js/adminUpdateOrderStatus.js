document.addEventListener('DOMContentLoaded', () => {
    const ordersTable = document.getElementById('orders-table');

    // Fetch and populate pending orders
    async function fetchPendingOrders() {
        try {
            const response = await fetch('/api/adminOrderControl/pending');
            const orders = await response.json();

            // Clear the table
            ordersTable.innerHTML = '';

            // Populate the table with pending orders
            orders.forEach(order => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${order.customer_name}</td>
                    <td>${order.item_id}</td>
                    <td>${order.item_type}</td>
                    <td>${new Date(order.order_date).toLocaleDateString()}</td>
                    <td>
                        <span class="status pending">Pending</span>
                        <button class="status-btn" data-detail-id="${order.detail_id}">Mark as Served</button>
                    </td>
                `;
                ordersTable.appendChild(row);
            });

            // Attach click event listeners to buttons
            attachEventListeners();
        } catch (error) {
            console.error('Error fetching pending orders:', error);
        }
    }

    // Update the status of an order to 'Served'
    async function updateOrderStatus(detailId) {
        try {
            const response = await fetch('/api/adminOrderControl/update-status', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ detail_id: detailId, new_status: 'Served' })
            });

            if (response.ok) {
                console.log(`Order with detail_id ${detailId} updated to Served.`);
            } else {
                const error = await response.json();
                console.error('Failed to update order status:', error);
                alert('Failed to update order status.');
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('An error occurred while updating the order status.');
        }
    }

    // Attach event listeners to buttons
    function attachEventListeners() {
        const statusButtons = document.querySelectorAll('.status-btn');
        statusButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const buttonElement = event.target;
                const detailId = buttonElement.dataset.detailId;

                // Update the status visually
                const parentTd = buttonElement.parentElement;
                const statusSpan = parentTd.querySelector('.status');
                statusSpan.textContent = 'Served';
                statusSpan.classList.remove('pending');
                statusSpan.classList.add('served');

                // Remove the button after status update
                buttonElement.remove();

                // Send the status update request to the backend
                updateOrderStatus(detailId);
            });
        });
    }

    // Fetch pending orders on page load
    fetchPendingOrders();
});
