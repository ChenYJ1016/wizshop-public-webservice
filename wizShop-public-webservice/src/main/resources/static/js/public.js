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

// Load cart items from session storage and display them
function loadCart() {
    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    let total = 0;

    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = ''; // Clear the cart items container

    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        const subPrice = item.quantity * item.productPrice; // Calculate sub price
        console.log(item.productPrice + " " + item.quantity);
        

        itemElement.innerHTML = `
            <div class="cart-item-details">
                <img src="${item.productImageUrl}" alt="${item.productName}" class="cart-item-image">
                <div>
                    <p>${item.productName}</p>
                    <p>${item.size} x ${item.quantity}</p>
                    <p>Price: $${parseFloat(item.productPrice).toFixed(2)}</p>
                    <p>Sub-price: $${subPrice.toFixed(2)}</p>
                </div>
            </div>
        `;
        cartItems.appendChild(itemElement);

        total += subPrice; // Update total with sub-price of each item
    });

    document.getElementById('cartTotal').innerText = `Total: $${total.toFixed(2)}`;

    // Show the cart sidebar if there are items in the cart
    const cartSidebar = document.getElementById('cartSidebar');
    if (cart.length > 0) {
        cartSidebar.classList.add('show-cart');
    } else {
        cartSidebar.classList.remove('show-cart');
    }
}


function openViewModal(productCard) {
    
    const productId = productCard.dataset.productId;
    const productName = productCard.dataset.productName;
    const productDescription = productCard.dataset.productDescription;
    const productPrice = productCard.dataset.productPrice;
    const productImageUrl = productCard.dataset.productImageUrl;
    const productColour = productCard.dataset.productColour;
    const productGender = productCard.dataset.productGender;
    const productCategory = productCard.dataset.productCategory;
    const sizeQuantities = productCard.dataset.productSizeQuantities.split(';');

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
            sizeButton.textContent = `Size: ${size} (Available: ${quantity})`;
            sizeButton.addEventListener('click', function() {
                selectSize(sizeButton, size);
            });
            sizeQuantitiesContainer.appendChild(sizeButton);
        }
    });

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
    
    // Show the cart sidebar if there are items in the cart
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

// Store cart items in session storage
// Store cart items in session storage
function addToCart() {
    const productId = document.getElementById('viewModal').dataset.productId;
    const productName = document.getElementById('viewProductName').innerText;
    const productImageUrl = document.querySelector('.modal-content img').src; // Assuming the product image is displayed in the modal
    const productPrice = parseFloat(document.getElementById('viewProductPrice').innerText.replace('$', '')); // Convert price to float
    const size = document.querySelector('.size-options button.selected')?.innerText; // Get selected size
    const quantity = parseInt(document.getElementById('productQuantity').value, 10) || 1; // Get quantity or default to 1

    if (!size) {
        alert("Please select a size!");
        return; 
    }
	console.log("addtocart " + productPrice);
    const cartItem = {
        productId,
        productName,
        productImageUrl,
        size,
        quantity,
        productPrice,
        subTotal: productPrice * quantity // Calculate the subtotal
    };

    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    cart.push(cartItem);
    sessionStorage.setItem('cart', JSON.stringify(cart));

    loadCart();
    closeViewModal();
}

// Display cart items in the sidebar
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
        total += parseInt(item.quantity); // Update total
    });

    document.getElementById('cartTotal').innerText = total;
}

function proceedToCheckout() {
    window.location.href = '/checkout';
}
