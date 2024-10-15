package com.capstone.wizShop_public_webservice.DTO;

import java.util.List;

public class PaymentRequest {
	
    private String token;
    private List<CartItem> cart;
    
	public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
	}
	public List<CartItem> getCart() {
		return cart;
	}
	public void setCart(List<CartItem> cart) {
		this.cart = cart;
	}


}
