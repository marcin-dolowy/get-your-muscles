import * as React from "react";
import {useEffect, useState} from "react";
import axios from "axios";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {Modal, Button, Form, Row, Col} from "react-bootstrap";

const PaymentPage = () => {

    const [modalShow, setModalShow] = React.useState(false);
    const handleShow = () => setModalShow(true);
    const handleClose = () => setModalShow(false);

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
                handleClose();
            })
            .catch((err) => {
                console.log(err);
                toast.error(err.response.data);
            });
    };


    function PaymentSummaryModal(props) {
        //variables necessary to payment
        const [price, setPrice] = useState("");
        const [currency, setCurrency] = useState("");
        const [paymentMethod, setPaymentMethod] = useState("");
        const [title, setTitle] = useState("");

        //variables to show data about event
        const [trainer, setTrainer] = useState("");
        const [member, setMember] = useState("");
        const [description, setDescription] = useState("");
        const [startEvent, setStartEvent] = useState("");
        const [endEvent, setEndEvent] = useState("");

        //TODO remove this and add reading data from event
        useEffect(() => {
            setPrice("10");
            setCurrency("USD");
            setPaymentMethod("paypal");
            setTitle("Cardio");
            setDescription("Running plus cycling");
            setTrainer("Radek");
            setMember("Marcin");
            setStartEvent("2023-05-30T17:30");
            setEndEvent("2023-05-30T19:00");
        }, []);

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
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
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
                                        value={currency}
                                        onChange={(e) => setCurrency(e.target.value)}
                                    >
                                        //TODO we can read some currency from backend
                                        <option value="USD">USD</option>
                                        <option value="EUR">EUR</option>
                                        <option value="PLN">GBP</option>
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
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
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
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
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
                                        value={trainer}
                                        onChange={(e) => setTrainer(e.target.value)}
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
                                        value={member}
                                        onChange={(e) => setMember(e.target.value)}
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
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
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
                                        value={startEvent}
                                        onChange={(e) => setStartEvent(e.target.value)}
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
                                        value={endEvent}
                                        onChange={(e) => setEndEvent(e.target.value)}
                                        readOnly
                                        style={{backgroundColor: '#f0f0f0', cursor: 'not-allowed'}}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Back
                    </Button>
                    <Button variant="primary" onClick={() => payForTraining(price, currency, paymentMethod, title)}>
                        I am paying
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

    return (
        <section className="vh-100" style={{backgroundColor: "#508bfc"}}>
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                        <div
                            className="card shadow-2-strong"
                            style={{borderRadius: "1rem"}}
                        >
                            <div className="card-body p-5 text-center">
                                <h3 className="mb-5">Sign in</h3>

                                <div className="d-grid gap-2">
                                    <Button variant="primary" onClick={handleShow}>
                                        Proceed to payment
                                    </Button>
                                    <PaymentSummaryModal
                                        show={modalShow}
                                        onHide={() => setModalShow(false)}
                                    />
                                    <hr/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar/>
        </section>
    );
};

export default PaymentPage;
