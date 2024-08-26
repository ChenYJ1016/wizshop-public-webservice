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

function openUpdateModal(productCard) {
    const productId = productCard.getAttribute('data-product-id');
    const productName = productCard.getAttribute('data-product-name');
    const productDescription = productCard.getAttribute('data-product-description');
    const productPrice = productCard.getAttribute('data-product-price');
    const productQuantity = productCard.getAttribute('data-product-quantity');
    const productColour = productCard.getAttribute('data-product-colour');
    const productGender = productCard.getAttribute('data-product-gender');
    const productSize = productCard.getAttribute('data-product-size');
    const productCategory = productCard.getAttribute('data-product-category');

    document.getElementById('updateForm').action = '/admin/update/' + productId;
    document.getElementById('updateProductId').value = productId;
    document.getElementById('updateProductName').value = productName;
    document.getElementById('updateProductDescription').value = productDescription;
    document.getElementById('updateProductPrice').value = productPrice;
    document.getElementById('updateProductQuantity').value = productQuantity;
    document.getElementById('updateProductColour').value = productColour;
    document.getElementById('updateProductGender').value = productGender;
    document.getElementById('updateProductSize').value = productSize;
    document.getElementById('updateProductCategory').value = productCategory;

    document.getElementById('updateModal').style.display = 'block';
}

function closeUpdateModal() {
    document.getElementById('updateModal').style.display = 'none';
}

function openCreateModal() {
    document.getElementById('createForm').reset();
    document.getElementById('createModal').style.display = 'block';
}

function closeCreateModal() {
    document.getElementById('createModal').style.display = 'none';
}
