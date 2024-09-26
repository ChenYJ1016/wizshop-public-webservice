package com.capstone.wizShop_public_webservice.DTO;

public class ProductEventPayload {

    private String productId;
    private String productName;
    private String productDescription;
    private Double productPrice;
    private Integer productQuantity;
    private String productImageFileName;
    private String productColour;
    private String productGender;
    private String productSize;
    private String productCategory;

    // Getters and Setters
    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getProductDescription() { return productDescription; }
    public void setProductDescription(String productDescription) { this.productDescription = productDescription; }

    public Double getProductPrice() { return productPrice; }
    public void setProductPrice(Double productPrice) { this.productPrice = productPrice; }

    public Integer getProductQuantity() { return productQuantity; }
    public void setProductQuantity(Integer productQuantity) { this.productQuantity = productQuantity; }

    public String getProductImageFileName() { return productImageFileName; }
    public void setProductImageFileName(String productImageFileName) { this.productImageFileName = productImageFileName; }

    public String getProductColour() { return productColour; }
    public void setProductColour(String productColour) { this.productColour = productColour; }

    public String getProductGender() { return productGender; }
    public void setProductGender(String productGender) { this.productGender = productGender; }

    public String getProductSize() { return productSize; }
    public void setProductSize(String productSize) { this.productSize = productSize; }

    public String getProductCategory() { return productCategory; }
    public void setProductCategory(String productCategory) { this.productCategory = productCategory; }
}
