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
            testID="stackNavigator"
            screenOptions={{
                headerShown: false
            }}
        >
            {loggedIn ? <>
                <Stack.Screen
                    testID="settingsScreen"
                    name="Settings"
                    component={SettingsScreen}
                />

                <Stack.Screen
                    testID="plantScreen"
                    name="Plant"
                    component={PlantScreen}
                    getId={({ params }) => params.plant_id}
                />

                <Stack.Screen
                    testID="createGardenScreen"
                    name="CreateGarden"
                    component={CreateGardenScreen}
                />

                <Stack.Screen
                    testID="plotScreen"
                    name="Plot"
                    component={PlotScreen}
                />

                <Stack.Screen
                    testID="noteScreen"
                    name="Note"
                    component={NoteScreen}
                />

                <Stack.Screen
                    testID="createAlarmScreen"
                    name="CreateAlarm"
                    component={CreateAlarmScreen}
                />
            </> : <>
                <Stack.Screen
                    testID="loginScreen"
                    name="Login"
                    component={LoginScreen}
                />

                <Stack.Screen
                    testID="signUpScreen"
                    name="SignUp"
                    component={SignUpScreen}
                />

                <Stack.Screen
                    testID="passwordResetScreen"
                    name="PasswordReset"
                    component={PasswordResetScreen}
                />
            </>}
        </Stack.Navigator>
    );
}

export default StackNavigator;