package com.example.getyourmuscles.paypal.controller;

import com.example.getyourmuscles.paypal.model.Order;
import com.example.getyourmuscles.paypal.service.PaypalService;
import com.paypal.api.payments.Links;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

@RestController
public class PaypalController {

    final PaypalService service;
    public final String RETURN_URL = "http://localhost:3000/calendar";

    public PaypalController(PaypalService service) {
        this.service = service;
    }

    @PostMapping("/pay")
    public String payment(@RequestBody Order order) {
        try {
            Payment payment = service.createPayment(
                    order.getPrice(),
                    order.getCurrency(),
                    order.getMethod(),
                    order.getIntent(),
                    order.getDescription(),
                    "http://localhost:8080/pay/cancel",
                    "http://localhost:8080/pay/success");
            for (Links link : payment.getLinks()) {
                if (link.getRel().equals("approval_url")) {
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
    public RedirectView successPay(@RequestParam("paymentId") String paymentId, @RequestParam("PayerID") String payerId) {
        try {
            Payment payment = service.executePayment(paymentId, payerId);
            System.out.println(payment.toJSON());
            if (payment.getState().equals("approved")) {
                return new RedirectView(RETURN_URL);
            }
        } catch (PayPalRESTException e) {
            System.out.println(e.getMessage());
        }
        return new RedirectView(RETURN_URL);
    }
}
