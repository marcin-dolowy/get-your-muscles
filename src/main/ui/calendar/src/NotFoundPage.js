import * as React from "react";
import NavBar from "./NavBar";

const NotFoundPage = ({ isMyCalendar, setIsMyCalendar }) => {
    return (
        <>
            <NavBar isMyCalendar={isMyCalendar} setIsMyCalendar={setIsMyCalendar} />
            <h1>404: Page Not found!</h1>
        </>
    );
}

export default NotFoundPage;