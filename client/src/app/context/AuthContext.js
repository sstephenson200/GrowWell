import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

import SplashScreen from "../screens/SplashScreen";

const AuthContext = createContext();

function AuthContextProvider(props) {

    const [loggedIn, setLoggedIn] = useState(null);

    //Check if user is logged in and set loggedIn flag
    async function checkLoggedIn() {
        try {
            const response = await axios.get("https://grow-well-server.herokuapp.com/user/checkLoggedIn");

            let status = response.status;

            if (status == 200) {
                setLoggedIn(response.data);
            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        checkLoggedIn();
    }, []);

    //On start up, show splash screen to prevent issues with tab visibility
    if (loggedIn == null) {
        return (
            <SplashScreen />
        );
    }

    return (
        <AuthContext.Provider value={{ loggedIn, checkLoggedIn }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };