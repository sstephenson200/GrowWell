import { createStackNavigator } from '@react-navigation/stack';
import { Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import GardenScreen from "../screens/GardenScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Stack = createStackNavigator();

const StackNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName="Home"
        >
            <Stack.Screen
                name="Home"
                component={GardenScreen}
                options={{
                    headerLeft: () => {
                        return (
                            <Image
                                style={styles.logo}
                                source={require("../assets/images/logo.png")}
                            />
                        );
                    },
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    headerRight: () => {
                        return (
                            <Ionicons name="settings-sharp" size={40} color="white" />
                        );
                    }
                }} />
        </Stack.Navigator>
    );
}

export default StackNavigator;