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

// Fetch game top-up data and display it
async function fetchGameTopUps() {
    const response = await fetch('/api/game-topups');
    const data = await response.json();
    console.log(data);
    try {
        const response = await fetch('/api/game-topups'); // Adjust the endpoint as needed
        if (!response.ok) {
            throw new Error('Failed to fetch game top-ups');
        }
        const data = await response.json();

        const productList = document.querySelector('.product-list');
        productList.innerHTML = ''; // Clear any existing HTML if present

        data.forEach(topUp => {
            const productItem = document.createElement('div');
            productItem.classList.add('product-item');

            const img = document.createElement('img');
            img.src = topUp.ImageLink;  // Use the ImageLink from the fetched data
            img.alt = topUp.option_name; // Set alt text to the option name

            const title = document.createElement('h3');
            title.textContent = topUp.option_name;

            const price = document.createElement('p');
            // Format price if needed, here as Vietnamese currency example:
            price.textContent = topUp.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

            const button = document.createElement('button');
            button.textContent = "Add to Cart";
            button.addEventListener('click', () => {
                // Handle add to cart logic here
                console.log(`Adding ${topUp.option_name} to cart`);
            });

            productItem.appendChild(img);
            productItem.appendChild(title);
            productItem.appendChild(price);
            productItem.appendChild(button);

            productList.appendChild(productItem);
        });
    } catch (error) {
        console.error('Error fetching game top-ups:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchGameTopUps);