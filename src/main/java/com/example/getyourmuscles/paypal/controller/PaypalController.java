package com.example.getyourmuscles.paypal.controller;

import com.example.getyourmuscles.event.model.Event;
import com.example.getyourmuscles.event.service.EventService;
import com.example.getyourmuscles.paypal.model.Order;
import com.example.getyourmuscles.paypal.service.PaypalService;
import com.paypal.api.payments.Links;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

@RestController
@RequiredArgsConstructor
public class PaypalController {

    private final PaypalService service;
    private final EventService eventService;
    public final String RETURN_URL = "http://localhost:3000/calendar";

    private Event event;

    @PostMapping("/pay")
    public String payment(@RequestBody Order order) {
        try {
            Payment payment = service.createPayment(
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
            e.printStackTrace();
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
            Payment payment = service.executePayment(paymentId, payerId);
            System.out.println(payment.toJSON());
            if (payment.getState().equals("approved")) {
                eventService.addEvent(event);
                return new RedirectView(RETURN_URL);
            }
        } catch (PayPalRESTException e) {
            System.out.println(e.getMessage());
        }
        return new RedirectView(RETURN_URL);
    }
}
