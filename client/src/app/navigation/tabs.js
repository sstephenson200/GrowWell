import { useContext } from "react";
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

import AuthContext from "../context/AuthContext";

import StackNavigator from "./StackNavigator";

import CalendarScreen from "../screens/Note/CalendarScreen";
import CreateNoteScreen from "../screens/Note/CreateNoteScreen";
import GardenScreen from "../screens/Garden/GardenScreen";
import AlarmScreen from "../screens/Alarm/AlarmScreen";
import PlantListScreen from "../screens/Plant/PlantListScreen";

//Method to allow tab bar to be hidden for various screens
const getTabBarVisibility = (route, loggedIn) => {

    if (route.params !== undefined || !loggedIn) {

        let screenName = null;

        if (route.params !== undefined) {
            screenName = route.params.screen;
        }

        if (!loggedIn || screenName == "Login" || screenName == "SignUp" || screenName == "PasswordReset") {
            return { display: "none" };
        }
    }

    return {
        position: "absolute",
        width: "100%",
        height: hp("11%"),
        paddingHorizontal: 10,
        backgroundColor: "#81BF63"
    };
}

const Tab = createBottomTabNavigator();

//Core screens displayed on Tab bar
const Tabs = (route) => {

    const { loggedIn } = useContext(AuthContext);

    let initialRouteName = "StackNavigator";

    if (loggedIn) {
        initialRouteName = "Garden";
    }

    return (

        <Tab.Navigator
            initialRouteName={initialRouteName}
            screenOptions={({ route }) => ({
                tabBarShowLabel: false,
                tabBarStyle: getTabBarVisibility(route, loggedIn)
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
                            <View style={{ height: hp("5%"), width: hp("5%") }}>
                                <FontAwesome name="calendar" size={wp("7%")} color="white" />
                            </View>
                        );
                    },
                    headerShown: false
                }}
            />

            <Tab.Screen
                name="Notes"
                component={CreateNoteScreen}
                options={{
                    tabBarIcon: () => {
                        return (
                            <View style={{ height: hp("5%"), width: hp("5%") }}>
                                <FontAwesome name="book" size={wp("7%")} color="white" />
                            </View>
                        );
                    },
                    headerShown: false
                }}
            />

            <Tab.Screen
                name="Garden"
                component={GardenScreen}
                options={{
                    tabBarIcon: () => {
                        return (
                            <View style={{ height: hp("5%"), width: hp("5%") }}>
                                <FontAwesome name="home" size={wp("7%")} color="white" />
                            </View>
                        );
                    },
                    headerShown: false
                }}
            />

            <Tab.Screen
                name="Alarms"
                component={AlarmScreen}
                options={{
                    tabBarIcon: () => {
                        return (
                            <View style={{ height: hp("5%"), width: hp("5%") }}>
                                <Ionicons name="ios-alarm" size={wp("7%")} color="white" />
                            </View>
                        );
                    },
                    headerShown: false
                }}
            />

            <Tab.Screen
                name="Plants"
                component={PlantListScreen}
                options={{
                    tabBarIcon: () => {
                        return (
                            <View style={{ height: hp("5%"), width: hp("5%") }}>
                                <Ionicons name="leaf" size={wp("7%")} color="white" />
                            </View>
                        );
                    },
                    headerShown: false
                }}
            />

        </Tab.Navigator >
    );
}

export default Tabs;