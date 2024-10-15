// public.js

let selectedSize = null;
let cart = [];
let totalAmount = 0;

document.getElementById('filterButton').addEventListener('click', function() {
    const filterOptions = document.getElementById('filterOptions');
    if (filterOptions.style.display === 'none' || filterOptions.style.display === '') {
        filterOptions.style.display = 'block';
    } else {
        filterOptions.style.display = 'none';
    }
});

function openViewModal(productCard) {
    const productName = productCard.getAttribute('data-product-name');
    const productDescription = productCard.getAttribute('data-product-description');
    const productPrice = productCard.getAttribute('data-product-price');
    const productColour = productCard.getAttribute('data-product-colour');
    const productGender = productCard.getAttribute('data-product-gender');
    const productCategory = productCard.getAttribute('data-product-category');
	const sizeQuantities = productCard.getAttribute('data-product-size-quantities').split(';').map(sq => sq.trim());

    document.getElementById('viewProductName').textContent = productName;
    document.getElementById('viewProductDescription').textContent = productDescription;
    document.getElementById('viewProductPrice').textContent = productPrice;
    document.getElementById('viewProductColour').textContent = productColour;
    document.getElementById('viewProductGender').textContent = productGender;
    document.getElementById('viewProductCategory').textContent = productCategory;

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
function addToCart() {
    const productId = document.getElementById('viewModal').dataset.productId;
    const productName = document.getElementById('viewProductName').innerText;
    const size = document.querySelector('.size-options button.selected').innerText;
    const quantity = document.getElementById('productQuantity').value;

    const cartItem = {
        productId,
        productName,
        size,
        quantity
    };

    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    cart.push(cartItem);
    sessionStorage.setItem('cart', JSON.stringify(cart));

    displayCart();
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

// Redirect to checkout and store cart data in session storage
function proceedToCheckout() {
    window.location.href = '/checkout';
}

// On checkout page load, display cart summary
function loadCheckoutSummary() {
    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    const summaryDiv = document.getElementById('checkoutSummary');
    summaryDiv.innerHTML = '';

    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.innerHTML = `
            <p>${item.productName} - ${item.size} (x${item.quantity})</p>
        `;
        summaryDiv.appendChild(itemElement);
    });
}

// Show payment form
function showPaymentForm() {
    document.getElementById('paymentForm').style.display = 'block';
}

// Send cart details to backend on payment success
async function processPayment(token) {
    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    const response = await fetch('/process-payment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token: token.id,
            cart: cart
        }),
    });

    const result = await response.json();
    if (result.success) {
        alert('Payment successful!');
        sessionStorage.removeItem('cart'); // Clear cart after successful payment
        window.location.href = '/shop';
    } else {
        alert('Payment failed. Please try again.');
    }
}

// Initialize Stripe
function initStripe() {
    const stripe = Stripe('your-stripe-public-key'); // Replace with your Stripe public key
    const elements = stripe.elements();
    const card = elements.create('card');
    card.mount('#card-element');

    document.getElementById('payment-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const { token, error } = await stripe.createToken(card);
        if (error) {
            console.error(error);
        } else {
            processPayment(token);
        }
    });
}
