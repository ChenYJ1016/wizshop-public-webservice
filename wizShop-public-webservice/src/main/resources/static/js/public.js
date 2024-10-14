// public.js

let selectedSize = null;

function openViewModal(productCard) {
    const productName = productCard.getAttribute('data-product-name');
    const productDescription = productCard.getAttribute('data-product-description');
    const productPrice = productCard.getAttribute('data-product-price');
    const productColour = productCard.getAttribute('data-product-colour');
    const productGender = productCard.getAttribute('data-product-gender');
    const productCategory = productCard.getAttribute('data-product-category');
	const sizeQuantities = productCard.getAttribute('data-product-size-quantities').split(';').map(sq => sq.trim());

    // Populate the modal with product details
    document.getElementById('viewProductName').textContent = productName;
    document.getElementById('viewProductDescription').textContent = productDescription;
    document.getElementById('viewProductPrice').textContent = productPrice;
    document.getElementById('viewProductColour').textContent = productColour;
    document.getElementById('viewProductGender').textContent = productGender;
    document.getElementById('viewProductCategory').textContent = productCategory;

    // Create size buttons
    const sizeQuantitiesContainer = document.getElementById('viewProductSizeQuantities');
    sizeQuantitiesContainer.innerHTML = ''; // Clear previous sizes
    selectedSize = null; // Reset selected size

    sizeQuantities.forEach(sizeQuantity => {
        const [size, quantity] = sizeQuantity.split(':');
        if (size && quantity) {
            const sizeButton = document.createElement('button');
            sizeButton.textContent = `Size: ${size} (Available: ${quantity})`;
            sizeButton.addEventListener('click', function() {
                selectSize(sizeButton, size);
            });
            sizeQuantitiesContainer.appendChild(sizeButton);
        }
    });

    // Show the modal
    document.getElementById('viewModal').style.display = 'block';
}

function selectSize(button, size) {
    const allButtons = document.querySelectorAll('.size-options button');
    allButtons.forEach(btn => btn.classList.remove('selected')); // Remove 'selected' from other buttons
    button.classList.add('selected'); // Add 'selected' to clicked button
    selectedSize = size; // Store selected size
}

function addToCart() {
    const quantity = document.getElementById('productQuantity').value;

    if (!selectedSize) {
        alert('Please select a size before adding to cart!');
        return;
    }

    if (quantity <= 0) {
        alert('Please enter a valid quantity!');
        return;
    }

    // Add the product to the cart (example logic)
    const cartItem = {
        productName: document.getElementById('viewProductName').textContent,
        productSize: selectedSize,
        productQuantity: quantity,
        productPrice: document.getElementById('viewProductPrice').textContent
    };

    console.log('Item added to cart:', cartItem);
    alert('Product added to cart!');

    // Close the modal after adding to cart
    closeViewModal();
}

function closeViewModal() {
    document.getElementById('viewModal').style.display = 'none';
}
