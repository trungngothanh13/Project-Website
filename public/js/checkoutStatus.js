// Removing buttons and total interface if the customer order is still in Pending state
// Takes in ordersStatusRoutes.js

document.addEventListener('DOMContentLoaded', async () => {
    const user_id = localStorage.getItem('user_id');
    if (!user_id) {
      alert('You must be logged in');
      return;
    }
  
    try {
      // Fetch the order status on page load
      const response = await fetch(`/api/orders/status?customer_id=${user_id}`);
      const data = await response.json();
      
      console.log(data);

      if (data.is_locked === true) {
        // Hide the order summary and proceed button
        const orderSummary = document.querySelector('.order-summary');
        if (orderSummary) {
          orderSummary.style.display = 'none';
        }
      
        const proceedButton = document.querySelector('.checkout-button');
        if (proceedButton) {
          proceedButton.style.display = 'none';
        }
      
        const checkoutContainer = document.querySelector('.checkout-container');
        const lockedMessage = document.createElement('div');
        lockedMessage.style.color = '#fff';
        lockedMessage.style.marginBottom = '20px';
        lockedMessage.textContent = "Your order is locked and pending. You cannot modify it at this time.";
        checkoutContainer.insertBefore(lockedMessage, checkoutContainer.firstChild);
      }
       else {
        // Order is not locked; everything remains visible and editable
      }
    } catch (error) {
      console.error('Error checking order status:', error);
    }
  });
  