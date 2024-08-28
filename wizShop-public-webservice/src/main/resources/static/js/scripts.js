// scripts.js

function openViewModal(productCard) {
    const productName = productCard.getAttribute('data-product-name');
    const productDescription = productCard.getAttribute('data-product-description');
    const productPrice = productCard.getAttribute('data-product-price');
    const productQuantity = productCard.getAttribute('data-product-quantity');
    const productColour = productCard.getAttribute('data-product-colour');
    const productGender = productCard.getAttribute('data-product-gender');
    const productSize = productCard.getAttribute('data-product-size');
    const productCategory = productCard.getAttribute('data-product-category');

    document.getElementById('viewProductName').innerText = productName;
    document.getElementById('viewProductDescription').innerText = productDescription;
    document.getElementById('viewProductPrice').innerText = productPrice;
    document.getElementById('viewProductQuantity').innerText = productQuantity;
    document.getElementById('viewProductColour').innerText = productColour;
    document.getElementById('viewProductGender').innerText = productGender;
    document.getElementById('viewProductSize').innerText = productSize;
    document.getElementById('viewProductCategory').innerText = productCategory;

    document.getElementById('viewModal').style.display = 'block';
}

function closeViewModal() {
    document.getElementById('viewModal').style.display = 'none';
}

document.getElementById('filterButton').addEventListener('click', function() {
    const filterOptions = document.getElementById('filterOptions');
    if (filterOptions.style.display === 'none' || filterOptions.style.display === '') {
        filterOptions.style.display = 'block';
    } else {
        filterOptions.style.display = 'none';
    }
});

