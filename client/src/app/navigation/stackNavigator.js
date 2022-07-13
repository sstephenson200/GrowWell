import { createStackNavigator } from '@react-navigation/stack';

import SettingsScreen from "../screens/SettingsScreen";
import PlantScreen from "../screens/PlantScreen";
import CreateGardenScreen from "../screens/CreateGardenScreen";

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

        </Stack.Navigator>
    );
}

export default StackNavigator;