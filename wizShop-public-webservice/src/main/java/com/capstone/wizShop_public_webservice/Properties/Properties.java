package com.capstone.wizShop_public_webservice.Properties;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class Properties {
	 
	 @Value("${wizshop.common.repo.url}")
	 private String commonRepoUrl;
	 
	 @Value("${stripe.secret.key}")
	 private String stripeSecretKey;

	 public String getCommonRepoUrl() {
		 return commonRepoUrl;
	 }
	 
	 public String getStripSecretKey() {
		 return stripeSecretKey;
	 }
}

