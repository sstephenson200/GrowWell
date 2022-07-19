import { createStackNavigator } from '@react-navigation/stack';

import SettingsScreen from "../screens/SettingsScreen";
import PlantScreen from "../screens/PlantScreen";
import CreateGardenScreen from "../screens/CreateGardenScreen";
import PlotScreen from "../screens/PlotScreen";
import NoteScreen from '../screens/NoteScreen';

const Stack = createStackNavigator();

const StackNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >

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

        </Stack.Navigator>
    );
}

export default StackNavigator;