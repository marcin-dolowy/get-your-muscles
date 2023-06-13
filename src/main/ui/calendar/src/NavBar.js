import {Link} from "react-router-dom";
import axios from "axios";
import {toast} from "react-toastify";

const NavBar = ({isMyCalendar, setIsMyCalendar, onChangeCalendar}) => {
    const logout = async () => {
        axios
            .post("/api/v1/auth/logout", "", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then((response) => {
                toast.info("Successfully logged out");
            })
            .catch((err) => {
                console.log(err)
                toast.error(err.response.data);
            });
    }

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Get Your Muscles</Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <button className="nav-link" onClick={() => {
                                onChangeCalendar();
                            }}>{isMyCalendar ? "All Events" : "My Events"}</button>
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
