import {useEffect, useState} from "react";
import {Button, Col, Form, Modal, Row} from "react-bootstrap";
import axios from "axios";
import {toast} from "react-toastify";

const PaymentSummaryModal = (props) => {

    useEffect(() => {
        props.setPrice(props.price);
        props.setCurrency(props.currency);
        props.setPaymentMethod(props.paymentMethod);
        props.setTitle(props.title);
        props.setDescription(props.description);
        props.setTrainer(props.trainer);
        props.setMember(props.member);
        props.setStartEvent(props.startEvent);
        props.setEndEvent(props.endEvent);
    }, []);

    const payForTraining = (price, currency, paymentMethod, description) => {
        const paymentData = {
            price: price,
            currency: currency,
            method: paymentMethod,
            intent: "sale",
            description: description
        };

        axios
            .post("/pay", paymentData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then((response) => {
                window.location.replace(response.data)
                props.onHide();
            })
            .catch((err) => {
                console.log(err);
                toast.error(err.response.data);
            });
    };

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Payment Summary
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row>
                        <Col>
                            <Form.Group controlId="formPrice">
                                <Form.Label>Price</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={props.price}
                                    onChange={(e) => props.setPrice(e.target.value)}
                                    readOnly
                                    style={{backgroundColor: '#f0f0f0', cursor: 'not-allowed'}}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="formCurrency">
                                <Form.Label>Currency</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={props.currency}
                                    onChange={(e) => props.setCurrency(e.target.value)}
                                >
                                    <option value="PLN">PLN</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group controlId="formMethod">
                                <Form.Label>Method</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={props.paymentMethod}
                                    onChange={(e) => props.setPaymentMethod(e.target.value)}
                                    readOnly
                                    style={{backgroundColor: '#f0f0f0', cursor: 'not-allowed'}}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="formTitle">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={props.title}
                                    onChange={(e) => props.setTitle(e.target.value)}
                                    readOnly
                                    style={{backgroundColor: '#f0f0f0', cursor: 'not-allowed'}}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group controlId="formTrainer">
                                <Form.Label>Trainer</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={props.trainer}
                                    onChange={(e) => props.setTrainer(e.target.value)}
                                    readOnly
                                    style={{backgroundColor: '#f0f0f0', cursor: 'not-allowed'}}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="formMember">
                                <Form.Label>Member</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={props.member}
                                    onChange={(e) => props.setMember(e.target.value)}
                                    readOnly
                                    style={{backgroundColor: '#f0f0f0', cursor: 'not-allowed'}}
                                />
                            </Form.Group>
                        </Col>

                    </Row>
                    <Row>
                        <Col>
                            <Form.Group controlId="formDescription">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={props.description}
                                    onChange={(e) => props.setDescription(e.target.value)}
                                    readOnly
                                    style={{backgroundColor: '#f0f0f0', cursor: 'not-allowed'}}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="formStartEvent">
                                <Form.Label>Start Event</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    value={props.startEvent}
                                    onChange={(e) => props.setStartEvent(e.target.value)}
                                    readOnly
                                    style={{backgroundColor: '#f0f0f0', cursor: 'not-allowed'}}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="formEndEvent">
                                <Form.Label>End Event</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    value={props.endEvent}
                                    onChange={(e) => props.setEndEvent(e.target.value)}
                                    readOnly
                                    style={{backgroundColor: '#f0f0f0', cursor: 'not-allowed'}}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onHide}>
                    Back
                </Button>
                <Button variant="primary" onClick={() => payForTraining(props.price, props.currency, props.paymentMethod, props.title)}>
                    I am paying
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default PaymentSummaryModal;
