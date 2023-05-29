import {Link} from "react-router-dom";
import {useState} from "react";

const NavBar = ({ isMyCalendar, setIsMyCalendar }) => {
    console.log(isMyCalendar)
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
                            {isMyCalendar
                                ? <Link className="nav-link" onClick={() => {setIsMyCalendar(!isMyCalendar)}} to="/eventscalendar">Events Calendar</Link>
                                : <Link className="nav-link" onClick={() => {setIsMyCalendar(!isMyCalendar)}} to="/mycalendar">Calendar</Link>
                            }
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