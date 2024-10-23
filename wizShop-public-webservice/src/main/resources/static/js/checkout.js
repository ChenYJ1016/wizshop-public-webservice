// checkout.js

function loadCheckoutSummary() {
    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    const summaryDiv = document.getElementById('checkoutSummary');
    summaryDiv.innerHTML = ''; 
    let totalPrice = 0; 

    cart.forEach((item, index) => {
        const subtotal = item.productPrice * item.quantity; 
        totalPrice += subtotal; 

        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item-summary'); 
        itemElement.innerHTML = `    
            <div class="checkout-item">
                <img src="${item.productImageUrl}" alt="${item.productName}" class="checkout-item-image" />
                <div class="checkout-item-details">
                    <p>${item.productName}</p>
                    <p>Size: ${item.size}</p>
                    <p>
                        Quantity: 
                        <input type="number" value="${item.quantity}" min="1" max="${item.availableQuantity}" onchange="updateQuantity(${index}, this.value)" id="quantity-${index}" />
                    </p>
                    <p>Subtotal: $${subtotal.toFixed(2)}</p>
                    <button onclick="removeItem(${index})" class="remove-btn">Remove</button> <!-- Add class for styling -->
                </div>
            </div>
        `;
        summaryDiv.appendChild(itemElement);
    });

    const totalPriceElement = document.getElementById('totalPrice');
    totalPriceElement.innerHTML = `<h3>Total Price: $${totalPrice.toFixed(2)}</h3>`;
}


function updateQuantity(index, newQuantity) {
    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];

    if (newQuantity <= 0) {
        alert("Quantity must be at least 1.");
        return;
    }

    if (newQuantity > cart[index].availableQuantity) {
        alert(`Cannot set quantity to more than ${cart[index].availableQuantity}.`);
        return;
    }

    cart[index].quantity = parseInt(newQuantity);
    sessionStorage.setItem('cart', JSON.stringify(cart));
    loadCheckoutSummary(); 
}


function removeItem(index) {
    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    cart.splice(index, 1); 
    sessionStorage.setItem('cart', JSON.stringify(cart)); 
    loadCheckoutSummary(); 
}
function showAddressForm() {
    document.getElementById('addressForm').style.display = 'block';
}

function showPaymentForm() {
    document.getElementById('addressForm').style.display = 'none';
    document.getElementById('paymentForm').style.display = 'block';
}

async function processPayment(token) {
    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    const deliveryInfo = {
        name: document.getElementById('name').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        zip: document.getElementById('zip').value,
        phone: document.getElementById('phone').value,
    };

    const csrfToken = document.querySelector('meta[name="_csrf"]').content;
    const csrfHeader = document.querySelector('meta[name="_csrf_header"]').content;
    
    const response = await fetch('/process-payment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            [csrfHeader]: csrfToken,  
        },
        body: JSON.stringify({
            token: token.id,
            cart: cart,
            deliveryInfo: deliveryInfo
        }),
    });

    const result = await response.json();
    if (result.success) {
        alert('Payment successful!');
        sessionStorage.removeItem('cart');
        window.location.href = '/shop';
    } else {
        alert('Payment failed. Please try again.');
        console.log(result);
    }
}

function initStripe() {
    const stripe = Stripe('pk_test_51QA4vOEffnZXcLVI8hvB9WS5dpDGtpFtBdQGepvEQ6Rce8kVRDbjWnxkYNDk6eAi5Hw14uve2cC5spEHSpVq7pgl00morrGYHA'); 
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
