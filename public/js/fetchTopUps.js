// This function shows the corresponding info box and image when dots are clicked
function showInfo(infoId) {
    const infoElements = ["info1", "info2", "info3"];
    const imageElements = ["image1", "image2", "image3"];

    // Hide all
    infoElements.forEach(id => {
        document.getElementById(id).style.display = "none";
    });
    imageElements.forEach(id => {
        document.getElementById(id).style.display = "none";
    });

    // Show the selected
    const index = infoElements.indexOf(infoId);
    if (index >= 0) {
        document.getElementById(infoElements[index]).style.display = "block";
        document.getElementById(imageElements[index]).style.display = "block";
    }
}

// Fetch top-up data and display it
async function fetchTopUps() {
    const response = await fetch('/api/topups');
    const data = await response.json();
    console.log(data);
    try {
        const response = await fetch('/api/topups'); // Adjust the endpoint as needed
        if (!response.ok) {
            throw new Error('Failed to fetch top-ups');
        }
        const data = await response.json();

        const productList = document.querySelector('.product-list');
        productList.innerHTML = ''; // Clear any existing HTML if present

        data.forEach(topUp => {
            const productItem = document.createElement('div');
            productItem.classList.add('product-item');

            const img = document.createElement('img');
            img.src = topUp.ImageLink;  // Use the ImageLink from the fetched data
            img.alt = topUp.name; // Set alt text to the name

            const title = document.createElement('h3');
            title.textContent = topUp.name;

            const price = document.createElement('p');
            // Format price if needed, here as Vietnamese currency example:
            price.textContent = topUp.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

            const button = document.createElement('button');
            button.textContent = "Add to Cart";
            button.addEventListener('click', async () => {
                console.log(`Adding ${topUp.name} to cart`);

                const user_id = localStorage.getItem('user_id');
                if (!user_id) {
                    alert('You must be logged in to add items to the cart.');
                    return;
                }

                // Prepare request to add item to cart as 'Top_up'
                const addToCartResponse = await fetch('/api/cart', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        customer_id: user_id,
                        item_id: topUp.id,
                        item_type: 'Top_up',
                        quantity: 1
                    })
                });

                if (addToCartResponse.ok) {
                    const result = await addToCartResponse.json();
                    console.log(result);
                    alert(`Added ${topUp.name} to your cart successfully!`);
                } else {
                    const errorData = await addToCartResponse.json();
                    console.error('Error adding to cart:', errorData);
                    alert('Failed to add to cart.');
                }
            });

            productItem.appendChild(img);
            productItem.appendChild(title);
            productItem.appendChild(price);
            productItem.appendChild(button);

            productList.appendChild(productItem);
        });
    } catch (error) {
        console.error('Error fetching top-ups:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchTopUps);