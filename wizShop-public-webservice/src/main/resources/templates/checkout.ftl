<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Checkout - wizShop</title>
    <link rel="stylesheet" href="/static/css/styles.css">
</head>
<body>
    <div class="navbar">
        <a href="/shop/">Home</a>
    </div>

    <div class="container">
        <h1>Checkout Summary</h1>
        <div id="checkoutSummary">
            <!-- Cart items will be displayed here -->
        </div>

        <button onclick="showPaymentForm()">Next</button>

        <!-- Payment Form -->
        <div id="paymentForm" style="display: none;">
            <h2>Enter Payment Details</h2>
            <form id="payment-form">
                <div id="card-element">
                    <!-- Stripe Elements will be inserted here -->
                </div>
                <button type="submit">Pay Now</button>
            </form>
        </div>
    </div>

    <script src="https://js.stripe.com/v3/"></script>
    <script src="/static/js/public.js"></script>
    <script>
        loadCheckoutSummary();
        initStripe();
    </script>
</body>
</html>
