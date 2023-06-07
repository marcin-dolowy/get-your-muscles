package com.example.getyourmuscles.paypal.model;

import com.example.getyourmuscles.event.model.Event;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Order {

    private Event event;
    private double price;
    private String currency;
    private String method;
    private String intent;
}
