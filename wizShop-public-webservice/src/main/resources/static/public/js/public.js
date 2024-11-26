// public.js

let selectedSize = null;
let cart = [];
let totalAmount = 0;

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('filterButton').addEventListener('click', function() {
        const filterOptions = document.getElementById('filterOptions');
        if (filterOptions.style.display === 'none' || filterOptions.style.display === '') {
            filterOptions.style.display = 'block';
        } else {
            filterOptions.style.display = 'none';
        }
    });
    
    loadCart();
});

function loadCart() {
    cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    let total = 0;

    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = ''; 

    cart.forEach((item, index) => {
        const subPrice = item.quantity * item.productPrice;

        // Create a container for each item with quantity controls and remove button
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
            <div class="cart-item-details">
                <img src="${item.productImageUrl}" alt="${item.productName}" class="cart-item-image">
                <div>
                    <p>${item.productName}</p>
                    <p>Size: ${item.size}</p>
                    <p>Price: $${item.productPrice.toFixed(2)}</p>
                    <p>Sub-price: $${subPrice.toFixed(2)}</p>
                    
                    <div class="quantity-controls">
                        <button onclick="updateQuantity(${index}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${index}, 1)">+</button>
                    </div>
                    
                    <button onclick="removeFromCart(${index})" class="remove-item-btn">Remove</button>
                </div>
            </div>
        `;

        cartItems.appendChild(itemElement);
        total += subPrice;
    });

    document.getElementById('cartTotal').innerText = `$${total.toFixed(2)}`;

    // Show or hide the "Proceed to Checkout" button based on cart content
    const proceedToCheckoutButton = document.getElementById('proceedToCheckoutButton');
    proceedToCheckoutButton.style.display = cart.length > 0 ? 'block' : 'none';

    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.toggle('show-cart', cart.length > 0);
}



// Function to update quantity with validation
function updateQuantity(index, change) {
    const item = cart[index];
    const newQuantity = item.quantity + change;

    // Validate the new quantity
    if (newQuantity <= 0) {
        // If quantity is 0 or below, remove item from cart
        removeFromCart(index);
    } else if (newQuantity > item.availableQuantity) {
        // Show alert if trying to add more than available stock
        alert(`Only ${item.availableQuantity} items available for this size.`);
    } else {
        // Update quantity if within the valid range
        item.quantity = newQuantity;
        sessionStorage.setItem('cart', JSON.stringify(cart));
        loadCart(); // Refresh cart display
    }
}

// Function to remove an item from the cart
function removeFromCart(index) {
    cart.splice(index, 1); // Remove item at the given index
    sessionStorage.setItem('cart', JSON.stringify(cart));
    loadCart(); // Refresh cart display
}

function openViewModal(productCard) {
    const productId = productCard.getAttribute('data-product-id'); 
    const productDescription = productCard.dataset.productDescription;
    const productPrice = productCard.dataset.productPrice;
    const productImageUrl = productCard.dataset.productImageUrl;
    const productColour = productCard.dataset.productColour;
    const productGender = productCard.dataset.productGender;
    const productCategory = productCard.dataset.productCategory;
    const sizeQuantities = productCard.dataset.productSizeQuantities.split(';');

    document.getElementById('viewModal').dataset.productId = productId;    
    const productName = productCard.dataset.productName;
    document.getElementById('viewProductName').innerText = productName;
    document.getElementById('viewProductDescription').innerText = productDescription;
    document.getElementById('viewProductPrice').innerText = `$${parseFloat(productPrice).toFixed(2)}`;
    document.getElementById('viewProductColour').innerText = productColour;
    document.getElementById('viewProductGender').innerText = productGender;
    document.getElementById('viewProductCategory').innerText = productCategory;
    document.getElementById('viewProductImage').src = productImageUrl;

    const sizeQuantitiesContainer = document.getElementById('viewProductSizeQuantities');
    sizeQuantitiesContainer.innerHTML = ''; 
    selectedSize = null; 

    sizeQuantities.forEach(sizeQuantity => {
        const [size, quantity] = sizeQuantity.split(':');
        if (size && quantity) {
            const sizeButton = document.createElement('button');
            const qty = parseInt(quantity, 10);

            if (qty > 0) {
                sizeButton.textContent = `${size} (Available: ${qty})`;
                sizeButton.disabled = false; 
                sizeButton.dataset.availableQuantity = qty;
            } else {
                sizeButton.textContent = `${size} (Unavailable)`;
                sizeButton.disabled = true;
            }

            sizeButton.addEventListener('click', function() {
                selectSize(sizeButton, size);
            });

            sizeQuantitiesContainer.appendChild(sizeButton);
        }
    });

    document.getElementById('productQuantity').value = 1;
    document.getElementById('viewModal').style.display = 'block';
}

function selectSize(button, size) {
    const allButtons = document.querySelectorAll('.size-options button');
    allButtons.forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected'); 
    selectedSize = size; 
}

function closeViewModal() {
    document.getElementById('viewModal').style.display = 'none';
    selectedSize = null;
    document.getElementById('productQuantity').value = 1;
}
function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartSidebar = document.getElementById('cartSidebar');

    cartItems.innerHTML = ''; 

    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `\
            <p>${item.name} (Size: ${item.size}) - ${item.quantity} x $${item.price.toFixed(2)}</p>\
        `;
        cartItems.appendChild(itemElement);
    });

    totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = totalAmount.toFixed(2);
    
    if (cart.length > 0) {
        cartSidebar.classList.add('show-cart');
    } else {
        cartSidebar.classList.remove('show-cart');
    }
}

function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.toggle('show-cart');
}

function addToCart() {
    const productId = document.getElementById('viewModal').dataset.productId;
    const productName = document.getElementById('viewProductName').innerText;
    const productPrice = parseFloat(document.getElementById('viewProductPrice').innerText.replace('$', ''));
    const productImageUrl = document.getElementById('viewProductImage').src;
    const productColour = document.getElementById('viewProductColour').innerText;
    const productGender = document.getElementById('viewProductGender').innerText;
    const productCategory = document.getElementById('viewProductCategory').innerText;
    const quantity = parseInt(document.getElementById('productQuantity').value, 10);

    // Ensure selectedSize is set from the selected button
    const selectedSizeButton = document.querySelector('#viewProductSizeQuantities button.selected');
    if (!selectedSizeButton) {
        alert('Please select a size.');
        return;
    }

    selectedSize = selectedSizeButton.textContent.split(' ')[0];
    const availableQuantity = parseInt(selectedSizeButton.dataset.availableQuantity, 10);

    if (quantity > availableQuantity) {
        alert(`Cannot add more than available quantity (${availableQuantity}).`);
        return;
    }

    // Check if the item with the same productId and size already exists in the cart
    const existingItemIndex = cart.findIndex(
        item => item.productId === productId && item.size === selectedSize
    );

    if (existingItemIndex > -1) {
        // Update the quantity of the existing item
        cart[existingItemIndex].quantity += quantity;

        // Ensure quantity does not exceed the available quantity
        if (cart[existingItemIndex].quantity > availableQuantity) {
            cart[existingItemIndex].quantity = availableQuantity; // Cap to available quantity
            alert(`Only ${availableQuantity} items available for this size.`);
        }
    } else {
        // Add a new item to the cart if it does not exist
        cart.push({
            productId,
            productName,
            productPrice,
            productImageUrl,
            productColour,
            productGender,
            productCategory,
            size: selectedSize,
            quantity,
            availableQuantity,
        });
    }

    // Save the updated cart to sessionStorage and refresh the cart display
    sessionStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    closeViewModal();
}


function displayCart() {
    const cartItems = document.getElementById('cartItems');
    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    let total = 0;

    cartItems.innerHTML = '';
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.innerHTML = `
            <p>${item.productName} - ${item.size} (x${item.quantity})</p>
        `;
        cartItems.appendChild(itemElement);
        total += parseInt(item.quantity); 
    });

    document.getElementById('cartTotal').innerText = total;
}

function proceedToCheckout() {
    window.location.href = '/shop/checkout';
}
