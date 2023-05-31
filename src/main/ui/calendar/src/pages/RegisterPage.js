import * as React from "react";
import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";

const RegisterPage = () => {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    const [error, setError] = useState('');

    const navigate = useNavigate();

    const register = async () => {
        try {
            const data = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                role: "USER",
                password: password,
                trainingPrice: 0,
            }
            if (password === repeatPassword) {
                const response = await axios.post("/api/v1/auth/register", data);
                console.log(response, "response");

                if (response.status === 200) {
                    console.log("Status 200");
                    navigate("/");
                } else {
                    console.log("Status inny");
                }
            }else{
                    console.log("Nieprawidłowe hasło");
                    //TODO add message on front that password is incorect
            }
        } catch (e) {
            setError(e.message);
        }
    }

    return (
        <section className="vh-100" style={{backgroundColor: "#508bfc"}}>
            <div className="container h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-lg-12 col-xl-11">
                        <div className="card text-black" style={{borderRadius: "25px"}}>
                            <div className="card-body p-md-5">
                                <div className="row justify-content-center">
                                    <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">

                                        <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Sign up</p>

                                        <form className="mx-1 mx-md-4">

                                            <div className="d-flex flex-row align-items-center mb-4">
                                                <i className="fas fa-user fa-lg me-3 fa-fw"></i>

                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="form-outline">
                                                            <input type="text" id="form3Example3c"
                                                                   className="form-control"
                                                                   value={firstName}
                                                                   onChange={e => setFirstName(e.target.value)}/>
                                                            <label className="form-label" htmlFor="form3Example1m">First
                                                                name</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-outline">
                                                            <input type="text" id="form3Example3c"
                                                                   className="form-control"
                                                                   value={lastName}
                                                                   onChange={e => setLastName(e.target.value)}/>
                                                            <label className="form-label" htmlFor="form3Example1n">Last
                                                                name</label>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>

                                            <div className="d-flex flex-row align-items-center mb-4">
                                                <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                                                <div className="form-outline flex-fill mb-0">
                                                    <input type="email" id="form3Example3c"
                                                           className="form-control"
                                                           value={email}
                                                           onChange={e => setEmail(e.target.value)}/>
                                                    <label className="form-label" htmlFor="form3Example3c">Email</label>
                                                </div>
                                            </div>

                                            <div className="d-flex flex-row align-items-center mb-4">
                                                <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                                                <div className="form-outline flex-fill mb-0">
                                                    <input type="password" id="form3Example4c"
                                                           className="form-control"
                                                           value={password}
                                                           onChange={e => setPassword(e.target.value)}/>
                                                    <label className="form-label"
                                                           htmlFor="form3Example4c">Password</label>
                                                </div>
                                            </div>

                                            <div className="d-flex flex-row align-items-center mb-4">
                                                <i className="fas fa-key fa-lg me-3 fa-fw"></i>
                                                <div className="form-outline flex-fill mb-0">
                                                    <input type="password" id="form3Example4cd"
                                                           className="form-control"
                                                           value={repeatPassword}
                                                           onChange={e => setRepeatPassword(e.target.value)}/>
                                                    <label className="form-label" htmlFor="form3Example4cd">Repeat
                                                        your password</label>
                                                </div>
                                            </div>


                                            <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                                                <button type="button" className="btn btn-primary btn-lg"
                                                        onClick={register}>Register
                                                </button>
                                            </div>

                                        </form>

                                        <div className="text-center mx-1 mx-md-4 mt-4">
                                            <p style={{display: "inline"}}>Already have an account? </p>
                                            <Link to="/">Sign in</Link>
                                        </div>

                                    </div>
                                    <div
                                        className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">

                                        <img
                                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                                            className="img-fluid" alt="Sample image"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default RegisterPage;
