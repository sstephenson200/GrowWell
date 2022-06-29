import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

import CalendarScreen from "../screens/CalendarScreen";
import NewNoteScreen from "../screens/NewNoteScreen";
import GardenScreen from "../screens/GardenScreen";
import AlarmScreen from "../screens/AlarmScreen";
import PlantListScreen from "../screens/PlantListScreen";


const Tab = createBottomTabNavigator();

const Tabs = () => {
    return (
        <Tab.Navigator
            initialRouteName="Calendar"
            screenOptions={{
                tabBarShowLabel: false,
                tabBarStyle: {
                    position: "absolute",
                    width: "100%",
                    height: 85,
                    paddingHorizontal: 10,
                    backgroundColor: "#81BF63"
                }
            }}
        >
            <Tab.Screen
                name="Calendar"
                component={CalendarScreen}
                options={{
                    tabBarIcon: () => {
                        return <FontAwesome name="calendar" size={40} color="white" />
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