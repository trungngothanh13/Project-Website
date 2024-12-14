// Shows ordered items
// Takes in getOrderedItemsRoutes.js

document.addEventListener('DOMContentLoaded', async () => {
  const user_id = localStorage.getItem('user_id');
  if (!user_id) {
    alert('You must be logged in');
    return;
  }

  try {
    const response = await fetch(`/api/orderedItems?customer_id=${user_id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch items');
    }
    const items = await response.json();
    
    const tableBody = document.querySelector('.checkout-items tbody');
    tableBody.innerHTML = '';

    items.forEach(item => {
      let itemName = `Item #${item.item_id} (${item.item_type})`;
      let itemImage = '../assets/default_item.png';

      // Determine the display name and image
      if (item.item_type === 'Drink' && item.DrinkName) {
        itemName = item.DrinkName;
        if (item.DrinkImageLink) itemImage = item.DrinkImageLink;
      } else if (item.item_type === 'Food' && item.FoodName) {
        itemName = item.FoodName;
        if (item.FoodImageLink) itemImage = item.FoodImageLink;
      } else if (item.item_type === 'Top_up' && item.TopUpName) {
        itemName = item.TopUpName;
        if (item.TopUpImageLink) itemImage = item.TopUpImageLink;
      } else if (item.item_type === 'Games_Top_up' && item.GameTopUpName) {
        itemName = item.GameTopUpName;
        if (item.GameTopUpImageLink) itemImage = item.GameTopUpImageLink;
      }

      const isPending = item.status === 'Pending';

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>
          <div class="item-info">
            <img src="${itemImage}" alt="${itemName}">
            <span>${itemName}</span>
          </div>
        </td>
        <td>${item.price_per_item}d</td>
        <td><input type="number" min="1" value="${item.quantity}" data-detail-id="${item.detail_id}" ${isPending ? 'disabled' : ''}></td>
        <td>${item.total_price}d</td>
        <td>${isPending ? '' : `<i class='bx bx-trash' data-detail-id='${item.detail_id}'></i>`}</td>
      `;
      tableBody.appendChild(row);
    });

    // Add event listener for trash buttons
    document.querySelectorAll('.bx-trash').forEach(button => {
      button.addEventListener('click', async (event) => {
        const detail_id = event.target.getAttribute('data-detail-id');
        if (!detail_id) return;

        if (!confirm('Are you sure you want to delete this item?')) return;

        try {
          const deleteResponse = await fetch(`/api/cart/${detail_id}`, {
            method: 'DELETE',
          });

          const deleteData = await deleteResponse.json();
          if (deleteResponse.ok) {
            alert(deleteData.message);

            // Refresh the items list
            event.target.closest('tr').remove();

            // Optionally, recalculate totals
            const remainingItems = Array.from(document.querySelectorAll('.checkout-items tbody tr'));
            let subtotal = 0;

            remainingItems.forEach(row => {
              const totalCell = row.querySelector('td:nth-of-type(4)').textContent.replace('d', '');
              subtotal += parseFloat(totalCell) || 0;
            });

            const tax = subtotal * 0.1;
            const grandTotal = subtotal + tax;

            // Update totals in the order summary
            const summaryItems = document.querySelectorAll('.summary-item span:nth-of-type(2)');
            summaryItems[0].textContent = `${subtotal}d`; // Subtotal
            summaryItems[1].textContent = `${tax}d`; // Tax
            document.querySelector('.summary-item.total span:nth-of-type(2)').textContent = `${grandTotal}d`; // Total
          } else {
            alert(deleteData.message || 'Failed to delete the item.');
          }
        } catch (error) {
          console.error('Error deleting item:', error);
          alert('An error occurred while deleting the item.');
        }
      });
    });

    // Calculate totals
    const subtotal = items.reduce((acc, item) => acc + item.total_price, 0);
    const tax = subtotal * 0.1;
    const grandTotal = subtotal + tax;
    // Update summary:
    const summaryItems = document.querySelectorAll('.summary-item span:nth-of-type(2)');
    summaryItems[0].textContent = `${subtotal}d`; // Subtotal
    summaryItems[1].textContent = `${tax}d`; // Tax
    document.querySelector('.summary-item.total span:nth-of-type(2)').textContent = `${grandTotal}d`; // Total
  } catch (error) {
    console.error('Error loading items:', error);
  }
});
