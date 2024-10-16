package com.capstone.wizShop_public_webservice.DTO;

import java.time.LocalDateTime;
import java.util.List;

public class ProductsDTO {

    private Long productId;

    private String productName;

    private String productDescription;

    private double productPrice;
    
    private String productImageUrl;
    
    private String productColour;
    
    private String productGender;
        
    private String productCategory;

    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    private List<SizeQuantities> sizeQuantities;

    // Getters and Setters
    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductDescription() {
        return productDescription;
    }

    public void setProductDescription(String productDescription) {
        this.productDescription = productDescription;
    }

    public double getProductPrice() {
        return productPrice;
    }

    public void setProductPrice(double productPrice) {
        this.productPrice = productPrice;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

	public String getProductImageUrl() {
		return productImageUrl;
	}

	public void setProductImageUrl(String productImageUrl) {
		this.productImageUrl = productImageUrl;
	}

	public String getProductColour() {
		return productColour;
	}

	public void setProductColour(String productColour) {
		this.productColour = productColour;
	}

	public String getProductGender() {
		return productGender;
	}

	public void setProductGender(String productGender) {
		this.productGender = productGender;
	}

	public String getProductCategory() {
		return productCategory;
	}

	public void setProductCategory(String productCategory) {
		this.productCategory = productCategory;
	}

	public List<SizeQuantities> getSizeQuantities() {
		return sizeQuantities;
	}

	public void setSizeQuantities(List<SizeQuantities> sizeQuantities) {
		this.sizeQuantities = sizeQuantities;
	}

}
