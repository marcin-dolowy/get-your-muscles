import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import {useState} from "react";

const NavBar = ({isMyCalendar, setIsMyCalendar, onChangeCalendar}) => {
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const logout = async () => {
        try {
            const response = await axios.post("/api/v1/auth/logout","", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log(response, "logout response");

            if (response.status === 200) {
                console.log("Status 200");
            } else {
                console.log("Status inny");
            }
        } catch (e) {
            // TODO exception handling
        }
    }

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <a className="navbar-brand">Get Your Muscles</a>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <button className="nav-link" onClick={() => {onChangeCalendar();}}>{isMyCalendar ? "Events Calendar" : "Calendar"}</button>
                        </li>
                    </ul>
                    <div className="d-flex navbar-nav">
                        <Link className="nav-link" to="/" onClick={logout}>Logout</Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;