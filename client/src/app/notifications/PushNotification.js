import * as Notifications from "expo-notifications";
import { useState, useEffect, useRef } from "react";
import * as Device from "expo-device";
import { Platform } from "react-native";

//Create Notification Handler
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true
    })
});

//Create Notification
export default function Notification() {

    //need to remove token when logged out
    const [pushToken, setPushToken] = useState("");
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    useEffect(() => {

        RegisterNotification()
            .then((token) => setPushToken(token));

        notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener();

        return (
            Notifications.removeNotificationSubscription(notificationListener.current)
        );

    }, []);

    return null;
}

//Handle notification schedules
export async function ScheduleNotification(title, selectedPlot, date) {

    let notificationContent = null;

    if (selectedPlot !== null) {

        let gardenData = selectedPlot.split(":");
        let label = gardenData[2] + ": " + gardenData[3];

        notificationContent = {
            title: title,
            body: label
        }
    } else {
        notificationContent = {
            title: title
        }
    }

    let now = new Date();
    date = new Date(date);
    let diff = (date.getTime() - now.getTime()) / 1000;

    const id = await Notifications.scheduleNotificationAsync({
        content: notificationContent,
        trigger: {
            seconds: diff
        }
    });
    return id;
}

//Create new notifications
async function RegisterNotification() {

    let token = null;

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== "granted") {
            alert("Failed to get push token");
            return;
        }

        token = (await Notifications.getExpoPushTokenAsync()).data;

    } else {
        alert("Must use physical device for notifications");
    }

    if (Platform.OS === "android") {

        Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            sound: true,
            lightColor: "#FF231F7C",
            lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
            bypassDnd: true
        });
    }
    return token;
}

//Cancel notifications
export async function CancelNotification(notifId) {
    await Notifications.cancelScheduledNotificationAsync(notifId);
}

//Cancel all notifications
export async function CancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
}