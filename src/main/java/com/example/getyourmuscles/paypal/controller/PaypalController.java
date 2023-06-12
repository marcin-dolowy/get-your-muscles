package com.example.getyourmuscles.paypal.controller;

import com.example.getyourmuscles.event.model.Event;
import com.example.getyourmuscles.event.service.EventService;
import com.example.getyourmuscles.paypal.model.Order;
import com.example.getyourmuscles.paypal.service.PaypalService;
import com.paypal.api.payments.Links;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

@RestController
@Slf4j
@RequiredArgsConstructor
public class PaypalController {

    private final PaypalService paypalService;
    private final EventService eventService;
    private final String RETURN_URL = "http://localhost:3000/calendar";

    private Event event;

    @PostMapping("/pay")
    public String payment(@RequestBody Order order) {
        try {
            Payment payment = paypalService.createPayment(
                    order.getPrice(),
                    order.getCurrency(),
                    order.getMethod(),
                    order.getIntent(),
                    order.getEvent().getTitle(),
                    "http://localhost:8080/pay/cancel",
                    "http://localhost:8080/pay/success");
            for (Links link : payment.getLinks()) {
                if (link.getRel().equals("approval_url")) {
                    this.event = order.getEvent();
                    return link.getHref();
                }
            }
        } catch (PayPalRESTException e) {
            log.error("An error occurred while creating a PayPal payment. Details: " + e.getMessage());
        }
        return "failed";
    }

    @GetMapping("/pay/cancel")
    public RedirectView cancelPay() {
        return new RedirectView(RETURN_URL);
    }

    @GetMapping("/pay/success")
    public RedirectView successPay(
            @RequestParam("paymentId") String paymentId, @RequestParam("PayerID") String payerId) {
        try {
            Payment payment = paypalService.executePayment(paymentId, payerId);
            if (payment.getState().equals("approved")) {
                log.info("Successfully added event: {}", event);
                eventService.addEvent(event);
                return new RedirectView(RETURN_URL);
            }
        } catch (PayPalRESTException e) {
            log.error("An error occurred while executing the PayPal payment. Details: " + e.getMessage());
        }
        return new RedirectView(RETURN_URL);
    }
}
