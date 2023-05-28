package com.example.getyourmuscles.paypal.config;

import com.paypal.base.rest.APIContext;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PaypalConfig {

    @Value("${paypal.client.id}")
    private String clientId;

    @Value("${paypal.client.secret}")
    private String clientSecret;

    @Value("${paypal.mode}")
    private String mode;

    @Bean
    public Map<String, String> paypalSdkConfig() {
        Map<String, String> configMap = new HashMap<>();
        configMap.put("mode", mode);
        return configMap;
    }

    @Bean
    public APIContext apiContext() {
        APIContext context = new APIContext(clientId, clientSecret, mode);
        context.setConfigurationMap(paypalSdkConfig());
        return context;
    }
}
