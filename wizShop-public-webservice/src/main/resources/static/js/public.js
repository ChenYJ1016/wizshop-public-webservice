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
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        const subPrice = item.quantity * item.productPrice; 

        itemElement.innerHTML = `
            <div class="cart-item-details">
                <img src="${item.productImageUrl}" alt="${item.productName}" class="cart-item-image">
                <div>
                    <p>${item.productName}</p>
                    <p>Size: ${item.size} x ${item.quantity}</p>
                    <p>Price: $${parseFloat(item.productPrice).toFixed(2)}</p>
                    <p>Sub-price: $${subPrice.toFixed(2)}</p>
                </div>
            </div>
        `;
        cartItems.appendChild(itemElement);

        // Add separator after each cart item
        const separator = document.createElement('div');
        separator.classList.add('cart-item-separator');
        cartItems.appendChild(separator);

        total += subPrice; 
    });

    document.getElementById('cartTotal').innerText = `$${total.toFixed(2)}`;
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.toggle('show-cart', cart.length > 0);
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

    // Reset quantity input when opening modal
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
    // Reset selected size and quantity when closing modal
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
    
    if (!selectedSize) {
        alert('Please select a size.');
        return;
    }

    // Check if the item already exists in the cart based on productId and selected size
    const existingItemIndex = cart.findIndex(item => item.productId === productId && item.size === selectedSize);

    if (existingItemIndex > -1) {
        // If the item exists, update the quantity
        cart[existingItemIndex].quantity += quantity;
    } else {
        // If the item doesn't exist, add a new one
        cart.push({
            productId: productId,
            productName: productName,
            productPrice: productPrice,
            productImageUrl: productImageUrl,
            productColour: productColour,
            productGender: productGender,
            productCategory: productCategory,
            size: selectedSize,
            quantity: quantity
        });
    }

    // Save the updated cart to session storage
    sessionStorage.setItem('cart', JSON.stringify(cart));

    // Refresh the cart display
    loadCart();

    // Close the modal
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
    window.location.href = '/checkout';
}
