import * as React from "react";
import {Link} from "react-router-dom";

const HomePage = () => {
    return (
        <section className="vh-100" style={{backgroundColor: "#508bfc"}}>
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                        <div className="card shadow-2-strong" style={{borderRadius: "1rem"}}>
                            <div className="card-body p-5 text-center">

                                <h3 className="mb-5">Sign in</h3>

                                <div className="form-outline mb-4">
                                    <input type="text" id="emailInput" className="form-control form-control-lg"/>
                                    <label className="form-label" htmlFor="emailInput">Email</label>
                                </div>

                                <div className="form-outline mb-4">
                                    <input type="password" id="passwordInput"
                                           className="form-control form-control-lg"/>
                                    <label className="form-label" htmlFor="passwordInput">Password</label>
                                </div>

                                <div className="form-check d-flex justify-content-start mb-4">
                                    <input className="form-check-input me-1" type="checkbox" value="" id="rememberMeInput"/>
                                    <label className="form-check-label" htmlFor="rememberMeInput"> Remember
                                        password </label>
                                </div>

                                <div className="d-grid gap-2">
                                    <Link className="btn btn-primary" to="/calendar">Login</Link>
                                    <hr/>
                                    <Link className="btn btn-danger" to="#">Sign in with google</Link>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HomePage;