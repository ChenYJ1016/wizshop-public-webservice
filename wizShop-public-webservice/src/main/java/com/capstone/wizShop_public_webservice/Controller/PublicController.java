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

import com.capstone.wizShop_public_webservice.DTO.Products;
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
                ResponseEntity<List<Products>> response = restTemplate.exchange(url, HttpMethod.GET, entity, new ParameterizedTypeReference<List<Products>>() {});

                List<Products> products = response.getBody();
                model.addAttribute("products", products);
                return "public";

        } catch (Exception e) {
            logger.error("Error in viewAdminPage", e);
            return "error";
        }
    }
    
    @GetMapping("/search")
    public String searchProducts(@RequestParam("query") String query, Model model) {
        try {
            HttpHeaders headers = new HttpHeaders();
            HttpEntity<String> entity = new HttpEntity<>(headers);

            String url = UriComponentsBuilder.fromHttpUrl(properties.getCommonRepoUrl() + "/api/products/search")
                    .queryParam("query", query)
                    .toUriString();

            ResponseEntity<List<Products>> response = restTemplate.exchange(url, HttpMethod.GET, entity, new ParameterizedTypeReference<List<Products>>() {});
            List<Products> products = response.getBody();
            model.addAttribute("products", products);

            return "public";  
        } catch (Exception e) {
            return "error";
        }
    }
}
