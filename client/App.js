import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import axios from "axios";

import Tabs from "./src/app/navigation/Tabs";

import Notification from "./src/app/notifications/PushNotification";

import { AuthContextProvider } from "./src/app/context/AuthContext";

import LoadFont from "./src/app/assets/fonts/LoadFont";

axios.defaults.withCredentials = true;

const App = () => {

  axios.defaults.baseURL = "https://grow-well-server.herokuapp.com";

  LoadFont();

  return (
    <AuthContextProvider>
      <NavigationContainer>
        <Notification />
        <Tabs />
      </NavigationContainer>
    </AuthContextProvider>
  );
}

export default App;