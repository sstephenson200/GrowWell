import { createStackNavigator } from '@react-navigation/stack';
import { useContext } from 'react';

import SettingsScreen from "../screens/SettingsScreen";
import PlantScreen from "../screens/PlantScreen";
import CreateGardenScreen from "../screens/CreateGardenScreen";
import PlotScreen from "../screens/PlotScreen";
import NoteScreen from '../screens/NoteScreen';
import NewAlarmScreen from '../screens/NewAlarmScreen';
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from '../screens/SignUpScreen';
import PasswordResetScreen from '../screens/PasswordResetScreen';
import AuthContext from '../context/AuthContext';

const Stack = createStackNavigator();

const StackNavigator = (props) => {

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
                    name="NewAlarm"
                    component={NewAlarmScreen}
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