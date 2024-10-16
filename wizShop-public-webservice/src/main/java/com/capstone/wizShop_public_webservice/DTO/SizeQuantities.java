package com.capstone.wizShop_public_webservice.DTO;

public class SizeQuantities {
    private String size;
    private int quantity;

    // Getters and Setters
    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size.trim();
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
