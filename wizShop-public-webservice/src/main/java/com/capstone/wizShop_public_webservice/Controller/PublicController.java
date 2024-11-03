package com.capstone.wizShop_public_webservice.Controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.HtmlUtils;
import org.springframework.web.util.UriComponentsBuilder;

import com.capstone.wizShop_public_webservice.DTO.ProductsDTO;
import com.capstone.wizShop_public_webservice.Properties.Properties;



@Controller
@RequestMapping("/shop")
public class PublicController {
	
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

            UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(properties.getCommonRepoUrl() + "/api/products/search");

            // Sanitize query
            if (query != null && !query.trim().isEmpty()) {
                uriBuilder.queryParam("query", HtmlUtils.htmlEscape(query.trim()));
            }

            if (maxPrice != null && maxPrice > 0 && !maxPrice.isInfinite() && !maxPrice.isNaN()) {
                uriBuilder.queryParam("maxPrice", maxPrice);
            }

            if (minPrice != null && minPrice > 0) {
                uriBuilder.queryParam("minPrice", minPrice);
            }

            if (productCategory != null && !productCategory.isEmpty()) {
                String sanitizedCategories = productCategory.stream()
                        .map(HtmlUtils::htmlEscape)
                        .reduce((cat1, cat2) -> cat1 + "," + cat2)
                        .orElse("");
                uriBuilder.queryParam("productCategory", sanitizedCategories);
            }

            if (productColour != null && !productColour.isEmpty()) {
                String sanitizedColours = productColour.stream()
                        .map(HtmlUtils::htmlEscape)
                        .reduce((color1, color2) -> color1 + "," + color2)
                        .orElse("");
                uriBuilder.queryParam("productColour", sanitizedColours);
            }

            if (productGender != null && !productGender.isEmpty()) {
                String sanitizedGenders = productGender.stream()
                        .map(HtmlUtils::htmlEscape)
                        .reduce((gender1, gender2) -> gender1 + "," + gender2)
                        .orElse("");
                uriBuilder.queryParam("productGender", sanitizedGenders);
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
