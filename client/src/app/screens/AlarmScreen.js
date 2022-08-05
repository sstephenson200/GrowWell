import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { useFonts } from 'expo-font';
import { unescape } from 'underscore';
const moment = require("moment");
import axios from "axios";

import Header from '../components/Header';
import AlarmCard from '../components/AlarmCard';

const AlarmScreen = (props) => {

    const [items, setItems] = useState({});
    const [deleteAlarm, setDeleteAlarm] = useState(null);

    // Get alarms for shown month
    async function getAlarms() {
        try {
            const response = await axios.post("https://grow-well-server.herokuapp.com/alarm/getAllAlarms", { responseType: 'json' });

            let status = response.status;

            if (status == 200) {
                generateAlarmItems(response.data.alarms);
            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getAlarms();
        if (props.route.params !== undefined) {
            props.route.params = undefined;
        }
        if (deleteAlarm !== null) {
            setDeleteAlarm(null);
        }
    }, [props, deleteAlarm]);

    const [loaded] = useFonts({
        Montserrat: require('../assets/fonts/Montserrat-Medium.ttf')
    });

    if (!loaded) {
        return null;
    }

    //Function to add alarm data to agenda items parameter
    function generateAlarmItems(alarms) {

        let alarmItems = {};
        let item = [];

        if (alarms.length !== 0) {
            for (let i = 0; i < alarms.length; i++) {
                let alarm_id = alarms[i]._id;
                let notificationDate = alarms[i].due_date;
                let notification_id = alarms[i].notification_id;
                let due_date = moment(alarms[i].due_date).format("YYYY-MM-DD");
                let time = moment(alarms[i].due_date).format("h:mm A");
                let title = alarms[i].title;
                title = unescape(title);
                let garden_id = alarms[i].garden_id;
                let isParent = alarms[i].isParent;
                let parent = alarms[i].parent;
                let completion_status = alarms[i].completion_status;
                let active_status = alarms[i].active_status;

                if (garden_id !== null) {
                    let plot_number = alarms[i].plot_number;
                    item = { alarm_id: alarm_id, notificationDate: notificationDate, notification_id: notification_id, time: time, title: title, garden_id: garden_id, plot_number: plot_number, isParent: isParent, parent: parent, completion_status: completion_status, active_status: active_status };
                } else {
                    item = { alarm_id: alarm_id, notificationDate: notificationDate, notification_id: notification_id, time: time, title: title, isParent: isParent, parent: parent, completion_status: completion_status, active_status: active_status };
                }

                if (alarmItems[due_date] !== undefined) {
                    alarmItems[due_date].push(item);
                } else {
                    alarmItems[due_date] = [item];
                }

            }
        }
        fillEmptyItems(alarmItems);
    }

    //Function to set all dates which are not alarm due dates to [] 
    function fillEmptyItems(alarmItems) {

        let monthArray = getDays();

        for (let i = 0; i < monthArray.length; i++) {
            let day = monthArray[i];
            if (alarmItems[day] == undefined) {
                alarmItems[day] = [];
            }
        }
        setItems(alarmItems);
    }

    //Function to get all dates for the previous, current and next month
    function getDays() {

        let monthArray = [];

        let now = moment(new Date()).format("YYYY-MM-DD");
        let previousMonth = moment(now).subtract(1, "month").startOf("month").format('YYYY-MM-DD');
        let nextMonth = moment(now).add(1, "month").startOf("month").format('YYYY-MM-DD');

        let availableMonths = [previousMonth, now, nextMonth];

        for (let i = 0; i < availableMonths.length; i++) {
            let daysInMonth = moment(availableMonths[i]).daysInMonth();
            let monthValue = moment(availableMonths[i]).format("MM");
            let yearValue = moment(availableMonths[i]).format("YYYY");

            while (daysInMonth) {
                let date = moment().date(daysInMonth);
                monthArray.push(date.format(yearValue + "-" + monthValue + "-DD"));
                daysInMonth--;
            }
        }
        return monthArray;
    }

    function renderItem(item) {
        return (
            <AlarmCard alarm={item} deleteCard={[deleteAlarm, setDeleteAlarm]} />
        );
    }

    return (
        <View style={styles.container}>
            <Header navigation={props.navigation} />
            <View style={styles.screen}>

                <Text style={styles.title}>Your Alarms</Text>

                <TouchableOpacity style={styles.button} onPress={() => props.navigation.navigate("StackNavigator", { screen: "NewAlarm" })}>
                    <Text style={styles.buttonText}>ADD NEW ALARM</Text>
                </TouchableOpacity>

                <Agenda
                    pastScrollRange={1}
                    futureScrollRange={1}
                    showClosingKnob={true}
                    items={items}
                    renderItem={(item) => renderItem(item)}
                    renderEmptyDate={() => <View />}
                    theme={{
                        backgroundColor: "#EFF5E4",
                        calendarBackground: "#EFF5E4",
                        agendaKnobColor: "grey",
                        dotColor: "#9477B4",
                        selectedDayBackgroundColor: "#81BF63"
                    }}
                />

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        marginBottom: 170,
    },
    screen: {
        height: "100%",
        backgroundColor: "#EFF5E4",
        paddingBottom: 10
    },
    title: {
        textAlign: "center",
        fontSize: 40,
        fontFamily: "Montserrat",
        paddingTop: 10
    },
    button: {
        backgroundColor: "#9477B4",
        height: 40,
        width: 200,
        borderRadius: 8,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        margin: 10
    },
    buttonText: {
        color: "white",
        fontSize: 18
    }
});

export default AlarmScreen;