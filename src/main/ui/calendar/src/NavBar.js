import {Link} from "react-router-dom";
import {useState} from "react";

const NavBar = ({isMyCalendar, setIsMyCalendar, onChangeCalendar}) => {
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
                        <Link className="nav-link" to="/logout">Logout</Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;