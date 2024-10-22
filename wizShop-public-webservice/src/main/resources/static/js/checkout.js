// checkout.js

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
