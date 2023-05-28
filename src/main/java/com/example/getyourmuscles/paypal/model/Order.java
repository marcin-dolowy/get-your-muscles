package com.example.getyourmuscles.paypal.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Order {

    private double price;
    private String currency;
    private String method;
    private String intent;
    private String description;
}
