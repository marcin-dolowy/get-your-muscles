import * as React from "react";
import {useEffect, useState} from "react";
import axios from "axios";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {Modal, Button, Form, Row, Col} from "react-bootstrap";

const PaymentPage = () => {







    return (
        <section className="vh-100" style={{backgroundColor: "#508bfc"}}>
            {/*<div className="container py-5 h-100">*/}
            {/*    <div className="row d-flex justify-content-center align-items-center h-100">*/}
            {/*        <div className="col-12 col-md-8 col-lg-6 col-xl-5">*/}
            {/*            <div*/}
            {/*                className="card shadow-2-strong"*/}
            {/*                style={{borderRadius: "1rem"}}*/}
            {/*            >*/}
            {/*                <div className="card-body p-5 text-center">*/}
            {/*                    <h3 className="mb-5">Sign in</h3>*/}

            {/*                    <div className="d-grid gap-2">*/}
            {/*                        <Button variant="primary" onClick={handleShow}>*/}
            {/*                            Proceed to payment*/}
            {/*                        </Button>*/}

            {/*                        <hr/>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
            {/*<ToastContainer position="top-right" autoClose={3000} hideProgressBar/>*/}
        </section>
    );
};

export default PaymentPage;
