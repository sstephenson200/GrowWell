import { createStackNavigator } from '@react-navigation/stack';
import { View, Image, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

import Tabs from './tabs';
import SettingsScreen from "../screens/SettingsScreen";

const Stack = createStackNavigator();

const StackNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName="Tabs"
        >

            <Stack.Screen
                name="Home"
                component={Tabs}
                options={({ navigation }) => ({
                    headerTitle: "",
                    headerLeft: () => (
                        <View style={styles.iconPadding}>
                            <Image
                                style={styles.logo}
                                source={require("../assets/images/logo.png")}
                            />
                        </View>
                    ),
                    headerRight: () => (
                        <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
                            <View style={styles.iconPadding}>
                                <Ionicons name="settings-sharp" size={40} color="white" />
                            </View>
                        </TouchableOpacity>
                    ),
                    headerStyle: {
                        backgroundColor: "#81BF63",
                        height: 85
                    }
                })}
            />

            <Stack.Screen
                name="Settings"
                component={SettingsScreen}
                options={() => ({
                    headerStyle: {
                        backgroundColor: "#81BF63",
                        height: 85
                    },
                    headerTitleStyle: {
                        color: "white"
                    },
                    headerTintColor: "white"
                })}
            />

        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    logo: {
        width: 52,
        height: 52
    },
    iconPadding: {
        paddingHorizontal: 10,
        paddingBottom: 5
    }
});

export default StackNavigator;