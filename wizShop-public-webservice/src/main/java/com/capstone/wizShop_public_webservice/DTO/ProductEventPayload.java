package com.capstone.wizShop_public_webservice.DTO;

import java.util.List;

public class ProductEventPayload {

    private Long productId;
    private String productName;
    private String productDescription;
    private Double productPrice;
    private String productImageFileName;
    private String productColour;
    private String productGender;
    private String productCategory;
    private List<SizeQuantities> sizeQuantities;

    // Getters and Setters
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getProductDescription() { return productDescription; }
    public void setProductDescription(String productDescription) { this.productDescription = productDescription; }

    public Double getProductPrice() { return productPrice; }
    public void setProductPrice(Double productPrice) { this.productPrice = productPrice; }

    public String getProductImageFileName() { return productImageFileName; }
    public void setProductImageFileName(String productImageFileName) { this.productImageFileName = productImageFileName; }

    public String getProductColour() { return productColour; }
    public void setProductColour(String productColour) { this.productColour = productColour; }

    public String getProductGender() { return productGender; }
    public void setProductGender(String productGender) { this.productGender = productGender; }

    public String getProductCategory() { return productCategory; }
    public void setProductCategory(String productCategory) { this.productCategory = productCategory; }
	
    public List<SizeQuantities> getSizeQuantities() { return sizeQuantities; }
	public void setSizeQuantities(List<SizeQuantities> sizeQuantities) { this.sizeQuantities = sizeQuantities; }
    
    
}
