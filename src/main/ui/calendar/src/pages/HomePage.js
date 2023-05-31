import React from "react";
import {Link} from "react-router-dom";

const HomePage = () => {
    return (
        <>
            <link
                href="https://fonts.googleapis.com/css?family=Poppins:100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i&display=swap"
                rel="stylesheet"
            />
            <title>Get Your Muscle - Free CSS Template</title>

            <link rel="stylesheet" type="text/css" href="/assets/css/bootstrap.min.css"/>
            <link rel="stylesheet" type="text/css" href="/assets/css/font-awesome.css"/>
            <link rel="stylesheet" href="/assets/css/templatemo-training-studio.css"/>

            <div id="js-preloader" className="js-preloader">
                <div className="preloader-inner">
                    <span className="dot"/>
                    <div className="dots">
                        <span/>
                        <span/>
                        <span/>
                    </div>
                </div>
            </div>

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
                                        <a href="/login">Sign In</a>
                                        {/*<Link to="/login">Sign In</Link>*/}
                                    </li>
                                </ul>
                                <a className="menu-trigger">
                                    <span>Menu</span>
                                </a>
                            </nav>
                        </div>
                    </div>
                </div>
            </header>
            <div className="main-banner" id="top">
                <video autoPlay muted loop id="bg-video">
                    <source src="/assets/images/gym-video.mov" type="video/mp4"/>
                </video>
                <div className="video-overlay header-text">
                    <div className="caption">
                        <h6>work harder, get stronger</h6>
                        <h2>
                            easy with our <em>gym</em>
                        </h2>
                        <div className="main-button scroll-to-section">
                            {/*<a href="/register">Become a member</a>*/}
                            <Link to="/register">Become a member</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
};

export default HomePage;
