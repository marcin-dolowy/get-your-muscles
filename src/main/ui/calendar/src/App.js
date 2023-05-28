import * as React from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import CalendarPage from "./CalendarPage";
import HomePage from "./HomePage";
import NavBar from "./NavBar";
import './App.css';
import NotFoundPage from "./NotFoundPage";
import axios from "axios";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />}/>
                <Route path="/calendar" element={<CalendarPage />}/>
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
