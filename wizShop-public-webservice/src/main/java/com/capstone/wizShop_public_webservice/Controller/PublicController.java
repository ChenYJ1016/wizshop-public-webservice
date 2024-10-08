package com.capstone.wizShop_public_webservice.Controller;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.capstone.wizShop_public_webservice.DTO.ProductsDTO;
import com.capstone.wizShop_public_webservice.Properties.Properties;



@Controller
@RequestMapping("/shop")
public class PublicController {
	
	private static final SecureRandom secureRandom = new SecureRandom();
    private static final Base64.Encoder base64Encoder = Base64.getUrlEncoder();
    private static final Logger logger = LoggerFactory.getLogger(PublicController.class);
    
    @Autowired
    private RestTemplate restTemplate;
    
    @Autowired 
    private Properties properties;
    
    @GetMapping
    public String redirectToPublic() {
        try {
            return "redirect:/shop/";
        } catch (Exception e) {
            logger.error("Error in redirectToPublic", e);
            return "error"; 
        }
    }
    
    @GetMapping("/")
    public String viewPublicPage(Model model) {
        try {
	        	HttpHeaders headers = new HttpHeaders();
	
	            HttpEntity<String> entity = new HttpEntity<>(headers);
	
	            String url = UriComponentsBuilder.fromHttpUrl(properties.getCommonRepoUrl() + "/api/products/").toUriString();
	            ResponseEntity<List<ProductsDTO>> response = restTemplate.exchange(url, HttpMethod.GET, entity, new ParameterizedTypeReference<List<ProductsDTO>>() {});
	
	            List<ProductsDTO> products = response.getBody();
	            model.addAttribute("products", products);
                return "public";

        } catch (Exception e) {
            logger.error("Error in viewPublicPage", e);
            return "error";
        }
    }
    
    @GetMapping("/search")
    public String searchProducts(
            @RequestParam(value = "query", required = false) String query,
            @RequestParam(value = "productCategory", required = false) List<String> productCategory,
            @RequestParam(value = "minPrice", required = false, defaultValue = "0") Double minPrice,
            @RequestParam(value = "maxPrice", required = false, defaultValue = "0") Double maxPrice,
            @RequestParam(value = "productColour", required = false) List<String> productColour,
            @RequestParam(value = "productGender", required = false) List<String> productGender,
            Model model) {
        try {
            HttpHeaders headers = new HttpHeaders();
            HttpEntity<String> entity = new HttpEntity<>(headers);

            UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(properties.getCommonRepoUrl() + "/api/products/search")
                    .queryParam("query", query);

            
            if (maxPrice != null && maxPrice > 0 && !maxPrice.isInfinite() && !maxPrice.isNaN()) {
            	uriBuilder.queryParam("maxPrice", maxPrice);
            }
            
            if (minPrice!= null && minPrice > 0) {
            	uriBuilder.queryParam("minPrice", minPrice);
            }

            if (productCategory != null && !productCategory.isEmpty()) {
                uriBuilder.queryParam("productCategory", String.join(",", productCategory));
            }
            if (productColour != null && !productColour.isEmpty()) {
                uriBuilder.queryParam("productColour", String.join(",", productColour));
            }
            if (productGender != null && !productGender.isEmpty()) {
                uriBuilder.queryParam("productGender", String.join(",", productGender));
            }

            String url = uriBuilder.toUriString();
            ResponseEntity<List<ProductsDTO>> response = restTemplate.exchange(url, HttpMethod.GET, entity, new ParameterizedTypeReference<List<ProductsDTO>>() {});
            List<ProductsDTO> products = response.getBody();

            model.addAttribute("products", products);
            return "public";
        } catch (Exception e) {
            logger.error("Error in searchProducts", e);
            return "error";
        }
    }

}
