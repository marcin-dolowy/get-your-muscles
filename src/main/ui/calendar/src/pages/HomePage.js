import React, {useState} from "react";
import {Link} from "react-router-dom";

const HomePage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <header className="header-area header-sticky">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <nav className="main-nav">
                                <a href="/" className="logo">
                                    Get Your<em> Muscles</em>
                                </a>
                                <ul className="nav">
                                    <li className="main-button">
                                        <Link to="/login">Sign In</Link>
                                    </li>
                                </ul>
                                <button style={{padding: "0", border: "none", background: "none"}}
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                        className="menu-trigger">
                                    <span>Sign In</span>
                                </button>
                            </nav>
                            {isMenuOpen &&
                                <div className="row main-button">
                                    <Link to="/login">Sign In</Link>
                                </div>}
                        </div>
                    </div>
                </div>
            </header>
            <div className="main-banner" id="top">
                <video style={{marginBottom: "-6px"}} autoPlay muted loop id="bg-video">
                    <source src="/assets/images/gym-video.mp4" type="video/mp4"/>
                </video>
                <div className="video-overlay header-text">
                    <div className="caption">
                        <h6>work harder, get stronger</h6>
                        <h2>
                            easy with our <em>gym</em>
                        </h2>
                        <div className="main-button scroll-to-section">
                            <Link to="/register">Become a member</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
};

export default HomePage;
