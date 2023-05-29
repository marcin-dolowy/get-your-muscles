import * as React from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import CalendarPage from "./CalendarPage";
import HomePage from "./HomePage";
import NavBar from "./NavBar";
import './App.css';
import NotFoundPage from "./NotFoundPage";
import { registerLicense } from '@syncfusion/ej2-base';


function App() {
    registerLicense('Mgo+DSMBaFt+QHJqU01mQ1NHaV1CX2BZf1F8R2dTf11gFChNYlxTR3ZaQFRjSn5Vc0JqWnhc;Mgo+DSMBPh8sVXJ1S0R+WlpCaV1BQmFJfFBmRGFTfVp6dFZWACFaRnZdQV1mS3dTdUVlXHhXdXBX;ORg4AjUWIQA/Gnt2VFhiQldPcEBAXnxLflF1VWJbdVx0flVFcDwsT3RfQF5jTHxadkZjX3pWcHVXRA==;MjIzMjQ5NUAzMjMxMmUzMDJlMzBuaW5JeVhOM1d4U2VPcXFlVHdVMVJNM2RKVmxBZHFIYUNQQWRrRDFlRlFnPQ==;MjIzMjQ5NkAzMjMxMmUzMDJlMzBMZFM1TmlNQTNJSzJJU3VwOE41NVhYbFVvak9ENU9KL0RPKzR6dU5yVTg4PQ==;NRAiBiAaIQQuGjN/V0d+Xk9CfVldX2BWfFN0RnNYfVRycF9GY0wxOX1dQl9gSXtRf0VgWXlbeHRSQmI=;MjIzMjQ5OEAzMjMxMmUzMDJlMzBJNEVEbUhhR3hQS1pxRWRJbGcrd1BFekZXYXdqNEdwc3R4YThjLzBJUWtJPQ==;MjIzMjQ5OUAzMjMxMmUzMDJlMzBpWnVoUlRCTjNVLzBlVkg4bVFwZ2RkMDZVdUsvQVplSG9BNHlTb1dnQTRzPQ==;Mgo+DSMBMAY9C3t2VFhiQldPcEBAXnxLflF1VWJbdVx0flVFcDwsT3RfQF5jTHxadkZjX3pWcXJWRA==;MjIzMjUwMUAzMjMxMmUzMDJlMzBJUmFlWWFSV0kyRWhUWGlURVJ1Vmx5Nm9kTnpTNnNiMjZxbjZYUXlUeXBRPQ==;MjIzMjUwMkAzMjMxMmUzMDJlMzBCNkJkcE5CenpuNmlGeHZ0dVh0OGs0Z1diOC9STld4cFBGNGRiRHNNdWFnPQ==;MjIzMjUwM0AzMjMxMmUzMDJlMzBJNEVEbUhhR3hQS1pxRWRJbGcrd1BFekZXYXdqNEdwc3R4YThjLzBJUWtJPQ==');
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
