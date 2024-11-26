<!DOCTYPE html> 
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Checkout - wizShop</title>
    <link rel="stylesheet" href="/static/public/css/checkoutStyles.css">
    <meta name="_csrf" content="${_csrf.token}">
    <meta name="_csrf_header" content="${_csrf.headerName}">
</head>
<body>
    <div class="navbar">
        <a href="/shop/">Home</a>
    </div>

    <div class="checkout-container">
        <div class="checkout-summary">
            <h1>Checkout Summary</h1>
            <div id="checkoutSummary">
                <!-- Cart items or empty cart message will be displayed here -->
            </div>
            <div id="totalPrice" style="display: none;"></div> 
        </div>

        <div class="form-section">
            <!-- Delivery Address Form -->
            <div id="addressForm" style="display: none;"> 
                <h2>Delivery Address</h2>
                <form id="deliveryForm" class="form">
                    <div class="form-group">
                        <label for="name">Name:</label>
                        <input type="text" id="name" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="address">Address:</label>
                        <input type="text" id="address" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="city">City:</label>
                        <input type="text" id="city" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="zip">Zip Code:</label>
                        <input type="text" id="zip" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="phone">Contact Number:</label>
                        <input type="text" id="phone" required>
                    </div>
                    
                    <button type="button" class="btn" onclick="showPaymentForm()">Continue to Payment</button>
                </form>
            </div>

            <!-- Payment Form -->
			<div id="paymentForm" style="display: none;">
			    <h2>Enter Payment Details</h2>
			    <form id="payment-form" class="form">
			        <div id="card-element">
			            <!-- Stripe Elements will be inserted here -->
			        </div>
			        <button type="button" class="btn" onclick="goBackToDeliveryForm()">Go Back</button>
			        <button type="submit" class="btn">Pay Now</button>
			    </form>
			</div>
        </div>
    </div>

    <script src="https://js.stripe.com/v3/"></script>
    <script src="/static/public/js/checkout.js"></script>
    <script>
        window.onload = function () {
            loadCheckoutSummary();
            initStripe();
        };
    </script>
</body>
</html>
