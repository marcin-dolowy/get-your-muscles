import * as React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const logIn = async () => {
        const loginData = { email: email, password: password };

        axios
            .post("/api/v1/auth/authenticate", loginData)
            .then((response) => {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("loggedUserEmail", loginData.email);
                navigate("/calendar");
            })
            .catch((err) => {
                console.log(err);
                toast.error("Invalid email or password");
            });
    };

    return (
        <section className="vh-100" style={{ backgroundColor: "#508bfc" }}>
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                        <div
                            className="card shadow-2-strong"
                            style={{ borderRadius: "1rem" }}
                        >
                            <div className="card-body p-5 text-center">
                                <h3 className="mb-5">Sign in</h3>
                                <div className="form-outline mb-4">
                                    <input
                                        type="text"
                                        id="emailInput"
                                        className="form-control form-control-lg"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <label className="form-label" htmlFor="emailInput">
                                        Email
                                    </label>
                                </div>

                                <div className="form-outline mb-4">
                                    <input
                                        type="password"
                                        id="passwordInput"
                                        className="form-control form-control-lg"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <label className="form-label" htmlFor="passwordInput">
                                        Password
                                    </label>
                                </div>

                                <div className="d-grid gap-2">
                                    <button className="btn btn-primary" onClick={logIn}>
                                        Login
                                    </button>
                                    <div>
                                        <p style={{ display: "inline" }}>Not a member? </p>
                                        <Link to="/register">Sign up now</Link>
                                    </div>
                                    <hr />
                                    <button className=" btn btn-danger">
                                        Sign in with google
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        </section>
    );
};

export default LoginPage;
