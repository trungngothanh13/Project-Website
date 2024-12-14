document.addEventListener('DOMContentLoaded', () => {
    const ordersTable = document.getElementById('orders-table');

    // Fetch pending orders
    async function fetchPendingOrders() {
        try {
            const response = await fetch('/api/adminOrderControl/pending');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

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

            attachEventListeners();
        } catch (error) {
            console.error('Error fetching pending orders:', error);
        }
    }

    // Handle status update
    async function updateOrderStatus(detailId) {
        try {
            const response = await fetch('/api/adminOrderControl/update-status', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ detail_id: detailId, new_status: 'Served' })
            });

            if (response.ok) {
                // Refresh pending orders after successful update
                fetchPendingOrders();
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

    // Attach event listeners to status buttons
    function attachEventListeners() {
        const statusButtons = document.querySelectorAll('.status-btn');
        statusButtons.forEach(button => {
            button.addEventListener('click', () => {
                const detailId = button.dataset.detailId;
                updateOrderStatus(detailId);
            });
        });
    }

    // Initial fetch of pending orders
    fetchPendingOrders();
});
