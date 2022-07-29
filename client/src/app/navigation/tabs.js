import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

import StackNavigator from './stackNavigator';
import CalendarScreen from "../screens/CalendarScreen";
import NewNoteScreen from "../screens/NewNoteScreen";
import GardenScreen from "../screens/GardenScreen";
import AlarmScreen from "../screens/AlarmScreen";
import PlantListScreen from "../screens/PlantListScreen";

//Method to allow tab bar to be hidden for various screens
const getTabBarVisibility = (route) => {

    if (route.params !== undefined) {
        let screenName = route.params.screen;

        if (screenName == "CreateGarden" || screenName == "Login" || screenName == "SignUp" || screenName == "PasswordReset") {
            return { display: "none" };
        }
    }

    return {
        position: "absolute",
        width: "100%",
        height: 85,
        paddingHorizontal: 10,
        backgroundColor: "#81BF63"
    };
}

const Tab = createBottomTabNavigator();

const Tabs = (route) => {
    return (
        <Tab.Navigator
            initialRouteName="Garden"
            screenOptions={({ route }) => ({
                tabBarShowLabel: false,
                tabBarStyle: getTabBarVisibility(route)
            })}
        >

            <Tab.Screen
                name="StackNavigator"
                component={StackNavigator}

                options={({ route }) => ({
                    tabBarItemStyle: { display: "none" },
                    headerShown: false,
                })}
            />

            <Tab.Screen
                name="Calendar"
                component={CalendarScreen}
                options={{
                    tabBarIcon: () => {
                        return (
                            <FontAwesome name="calendar" size={40} color="white" />
                        )
                    },
                    headerShown: false
                }}
            />
            <Tab.Screen
                name="Notes"
                component={NewNoteScreen}
                options={{
                    tabBarIcon: () => {
                        return <FontAwesome name="book" size={40} color="white" />
                    },
                    headerShown: false
                }}
            />
            <Tab.Screen
                name="Garden"
                component={GardenScreen}
                options={{
                    tabBarIcon: () => {
                        return <FontAwesome name="home" size={40} color="white" />
                    },
                    headerShown: false
                }}
            />
            <Tab.Screen
                name="Alarms"
                component={AlarmScreen}
                options={{
                    tabBarIcon: () => {
                        return <Ionicons name="ios-alarm" size={40} color="white" />
                    },
                    headerShown: false
                }}
            />
            <Tab.Screen
                name="Plants"
                component={PlantListScreen}
                options={{
                    tabBarIcon: () => {
                        return <Ionicons name="leaf" size={40} color="white" />
                    },
                    headerShown: false
                }}
            />
        </Tab.Navigator >
    );
}

export default Tabs;