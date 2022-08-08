import { createStackNavigator } from "@react-navigation/stack";
import { useContext } from "react";

import AuthContext from "../context/AuthContext";

import SettingsScreen from "../screens/User/SettingsScreen";
import PlantScreen from "../screens/Plant/PlantScreen";
import CreateGardenScreen from "../screens/Garden/CreateGardenScreen";
import PlotScreen from "../screens/Garden/PlotScreen";
import NoteScreen from "../screens/Note/NoteScreen";
import CreateAlarmScreen from "../screens/Alarm/CreateAlarmScreen";
import LoginScreen from "../screens/User/LoginScreen";
import SignUpScreen from "../screens/User/SignUpScreen";
import PasswordResetScreen from "../screens/User/PasswordResetScreen";

const Stack = createStackNavigator();

//Screens not directly displayed as Tabs
const StackNavigator = (props) => {

    //Prevent user viewing certain pages based on loggedIn state
    const { loggedIn } = useContext(AuthContext);

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            {loggedIn ? <>
                <Stack.Screen
                    name="Settings"
                    component={SettingsScreen}
                />

                <Stack.Screen
                    name="Plant"
                    component={PlantScreen}
                    getId={({ params }) => params.plant_id}
                />

                <Stack.Screen
                    name="CreateGarden"
                    component={CreateGardenScreen}
                />

                <Stack.Screen
                    name="Plot"
                    component={PlotScreen}
                />

                <Stack.Screen
                    name="Note"
                    component={NoteScreen}
                />

                <Stack.Screen
                    name="CreateAlarm"
                    component={CreateAlarmScreen}
                />
            </> : <>
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                />

                <Stack.Screen
                    name="SignUp"
                    component={SignUpScreen}
                />

                <Stack.Screen
                    name="PasswordReset"
                    component={PasswordResetScreen}
                />
            </>}
        </Stack.Navigator>
    );
}

export default StackNavigator;