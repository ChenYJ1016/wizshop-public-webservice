<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>wizShop</title>
    <link rel="stylesheet" href="/static/css/styles.css">
    <link rel="icon" href="/static/icon/favicon.ico" type="image/x-icon">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
</head>
<body>
    <div class="navbar">
        <a href="/shop/">Home</a>
        
        <!-- Cart Toggle Button -->
	    <div class="cart-toggle-btn" onclick="toggleCart()">
	        <i class="fa fa-shopping-cart"></i>
	    </div>
    </div>

    <div class="container">
        <div class="header-container">
            <form action="/shop/search" method="get" class="search-container">
                <input type="text" name="query" placeholder="Search products...">
                <button id="searchButton" type="submit">                   
                    <i class="fa fa-search"></i>
                </button>
            </form>
            
            <button id="filterButton" class="filter-button">Filter</button>
        </div>       
        
      	<div id="filterOptions" class="filter-options">
		    <form action="/shop/search" method="get">
			    <label for="productCategory">Category:</label>
			    <div>
			        <input type="checkbox" name="productCategory" value="Shirts"> Shirts<br>
			        <input type="checkbox" name="productCategory" value="Hats"> Hats<br>
			        <input type="checkbox" name="productCategory" value="Shoes"> Shoes<br>
			        <input type="checkbox" name="productCategory" value="Skirts"> Skirts<br>
			        <input type="checkbox" name="productCategory" value="Shorts"> Shorts<br>
			        <!-- Add more categories as needed -->
			    </div>
			
			    <label for="productColour">Colour:</label>
			    <div>
			        <input type="checkbox" name="productColour" value="Red"> Red<br>
			        <input type="checkbox" name="productColour" value="Blue"> Blue<br>
			        <input type="checkbox" name="productColour" value="Green"> Green<br>
			   		<input type="checkbox" name="productColour" value="Beige"> Beige<br>

			        <!-- Add more colors as needed -->
			    </div>
			
			    <label for="productGender">Gender:</label>
			    <div>
			        <input type="checkbox" name="productGender" value="Male"> Male<br>
			        <input type="checkbox" name="productGender" value="Female"> Female<br>
			        <input type="checkbox" name="productGender" value="Unisex"> Unisex<br>
			    </div>
			
			    <label for="minPrice">Min Price:</label>
			    <input type="number" name="minPrice" step="0.01">
			
			    <label for="maxPrice">Max Price:</label>
			    <input type="number" name="maxPrice" step="0.01">
			
			    <button type="submit">Apply Filters</button>
			</form>
		</div> 
        
        <!-- Product Cards -->
        <div class="product-container">
            <div class="product-card-container">
                <#list products as product>
                    <div class="product-card"
                         data-product-id="${product.productId}"
                         data-product-name="${product.productName?html}"
                         data-product-description="${product.productDescription?html}"
                         data-product-price="${product.productPrice}"
                         data-product-image-url="${product.productImageUrl?html}"
                         data-product-colour="${product.productColour?html}"
                         data-product-gender="${product.productGender?html}"
                         data-product-category="${product.productCategory?html}"
                         data-product-size-quantities="
                             <#assign sizeQuantitiesString=''>
                             <#list product.sizeQuantities as sq>
                                 <#if sq_has_next>
                                     <#assign sizeQuantitiesString += sq.size?trim + ':' + sq.quantity + ';'>
                                 <#else>
                                     <#assign sizeQuantitiesString += sq.size?trim + ':' + sq.quantity>
                                 </#if>
                             </#list>
                             ${sizeQuantitiesString}">
                        <img src="${product.productImageUrl}" alt="${product.productName}" onclick="openViewModal(this.parentElement)">
                        <p>${product.productName}</p>
                    </div>
                </#list>
            </div>
        </div>

        <!-- View Product Modal -->
        <div id="viewModal" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeViewModal()">&times;</span>
                
                <div class="form-group">
                    <label for="viewProductName">Name:</label>
                    <p id="viewProductName"></p>
                </div>

                <div class="form-group">
                    <label for="viewProductDescription">Description:</label>
                    <p id="viewProductDescription"></p>
                </div>

                <div class="form-group">
                    <label for="viewProductPrice">Price:</label>
                    <p id="viewProductPrice"></p>
                </div>

                <div class="form-group">
                    <label for="viewProductColour">Colour:</label>
                    <p id="viewProductColour"></p>
                </div>

                <div class="form-group">
                    <label for="viewProductGender">Gender:</label>
                    <p id="viewProductGender"></p>
                </div>

                <div class="form-group">
                    <label for="viewProductCategory">Category:</label>
                    <p id="viewProductCategory"></p>
                </div>

                <!-- Size and Quantity Selection -->
                <div class="form-group size-options">
                    <label for="viewProductSizeQuantities">Sizes & Quantities:</label>
                    <div id="viewProductSizeQuantities"></div>
                </div>

                <!-- Quantity Input -->
                <div class="form-group">
                    <label for="productQuantity">Quantity:</label>
                    <input type="number" id="productQuantity" value="1" min="1">
                </div>

                <!-- Add to Cart Button -->
				<div class="form-group">
				    <button class="add-to-cart-btn" onclick="addToCart()">Add to Cart</button>
				</div>

            </div>
        </div>
    </div>

    <!-- Cart Sidebar -->
    <div id="cartSidebar" class="cart-sidebar">
        <div class="cart-header">
        	Your Cart
	        <span class="close-cart" onclick="toggleCart()">&times;</span> <!-- Close button -->
        </div>
        <div class="cart-items" id="cartItems">
            <!-- Cart items will be displayed here -->
        </div>
        <div class="cart-footer">
            <p>Total: <span id="cartTotal">0</span></p>
			<button id="proceedToCheckoutButton" onclick="proceedToCheckout()">Proceed to Checkout</button>
        </div>
    </div>

    <script src="/static/js/public.js"></script>
</body>
</html>
