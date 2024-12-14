// This is logic for finalize orders and then lock the checkout page when
// pressing Proceed to Payment button, takes in finalizeRoutes.js

document.addEventListener('DOMContentLoaded', () => {
    const user_id = localStorage.getItem('user_id');
    if (!user_id) {
      alert('You must be logged in to proceed to payment.');
      return;
    }
  
    const proceedButton = document.querySelector('.checkout-button');
    if (proceedButton) {
      proceedButton.addEventListener('click', async () => {
        try {
          const response = await fetch('/api/orders/finalize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ customer_id: user_id })
          });
  
          const data = await response.json();
          if (response.ok) {
            // Order finalized successfully
            alert(data.message);
  
            // Remove or hide the order-summary box since order is now locked
            const orderSummary = document.querySelector('.order-summary');
            if (orderSummary) {
              orderSummary.style.display = 'none';
            }
  
            // Disable all quantity inputs and remove add/remove actions
            const quantityInputs = document.querySelectorAll('.checkout-items input[type="number"]');
            quantityInputs.forEach(input => input.disabled = true);
  
            // Show a message that the order is locked and pending
            const checkoutContainer = document.querySelector('.checkout-container');
            const lockedMessage = document.createElement('div');
            lockedMessage.style.color = '#fff';
            lockedMessage.style.marginBottom = '20px';
            lockedMessage.textContent = "Your order is now pending. Please wait until it is served.";
            checkoutContainer.insertBefore(lockedMessage, checkoutContainer.firstChild);
  
          } else {
            // Something went wrong (e.g., pending items not all in 'In-cart' or order is already locked)
            alert(data.message);
          }
        } catch (error) {
          console.error('Error finalizing order:', error);
          alert('An error occurred while finalizing the order.');
        }
      });
    }
  });
  