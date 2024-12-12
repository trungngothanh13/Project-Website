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

// Fetch foods data and display it
async function fetchFoods() {
    try {
        const response = await fetch('/api/foods'); // Your backend endpoint for foods
        if (!response.ok) {
            throw new Error('Failed to fetch foods');
        }

        const data = await response.json();
        console.log(data);

        const productList = document.querySelector('.product-list');
        productList.innerHTML = ''; // Clear any existing HTML if present

        data.forEach(drink => {
            const productItem = document.createElement('div');
            productItem.classList.add('product-item');

            const img = document.createElement('img');
            img.src = drink.ImageLink;  // Use the ImageLink from the fetched data
            img.alt = drink.name;       // Alt text based on the drink's name

            const title = document.createElement('h3');
            title.textContent = drink.name;

            const price = document.createElement('p');
            // Format the price if needed:
            price.textContent = drink.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

            const button = document.createElement('button');
            button.textContent = "Add to Cart";
            button.addEventListener('click', () => {
                console.log(`Adding ${drink.name} to cart`);
            });

            productItem.appendChild(img);
            productItem.appendChild(title);
            productItem.appendChild(price);
            productItem.appendChild(button);

            productList.appendChild(productItem);
        });
    } catch (error) {
        console.error('Error fetching foods:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchFoods);
