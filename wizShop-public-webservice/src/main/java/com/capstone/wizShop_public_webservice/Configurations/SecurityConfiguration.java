package com.capstone.wizShop_public_webservice.Configurations;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.savedrequest.HttpSessionRequestCache;

import com.capstone.wizShop_public_webservice.Properties.Properties;



@Configuration
@EnableWebSecurity
public class SecurityConfiguration {
	
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {


        HttpSessionRequestCache requestCache = new HttpSessionRequestCache();
        requestCache.setMatchingRequestParameterName("continue");

        http
            .csrf(csrf -> csrf 
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
            )
            .authorizeHttpRequests(authorizeRequests ->
                authorizeRequests
                	.anyRequest().permitAll()
                
            )
            .requestCache(cache -> cache.requestCache(requestCache))
            .exceptionHandling(exceptionHandling ->
                exceptionHandling
                    .accessDeniedPage("/error")
            );

        return http.build();
    }
}
