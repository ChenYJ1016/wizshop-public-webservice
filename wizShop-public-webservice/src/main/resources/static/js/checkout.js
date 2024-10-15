//checkout.js

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