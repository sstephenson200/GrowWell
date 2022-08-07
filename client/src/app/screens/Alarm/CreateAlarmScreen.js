import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import axios from 'axios';
import { unescape } from 'underscore';
const moment = require("moment");
import { Checkbox } from 'react-native-paper';

import Header from '../../components/Header';
import DatePicker from '../../components/Alarm/DatePicker';
import Dropdown from "../../components/Dropdown";
import { CancelNotification, ScheduleNotification } from "../../notifications/PushNotification";

const CreateAlarmScreen = (props) => {

    let tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1);

    let notificationID = null;

    let alarmTitle = null;
    let alarmSchedule = null;
    let alarmDuration = null;

    if (props.route.params !== undefined) {
        if (props.route.params.alarmTitle !== undefined) {
            alarmTitle = props.route.params.alarmTitle
        }
        if (props.route.params.alarmSchedule !== undefined) {
            alarmSchedule = props.route.params.alarmSchedule.toString();
        }
        if (props.route.params.alarmDuration !== undefined) {
            alarmDuration = props.route.params.alarmDuration.toString();
        }
    }

    const [date, setDate] = useState(tomorrow);
    const [title, setTitle] = useState("");
    const [plots, setPlots] = useState([]);
    const [selectedPlot, setSelectedPlot] = useState(null);
    const [checked, setChecked] = useState(false);
    const [schedule, setSchedule] = useState(null);
    const [numRepeats, setNumRepeats] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    //Function to reset state when leaving the page
    function clearState() {
        setDate(new Date());
        setTitle("");
        setSelectedPlot(null);
        setChecked(false);
        setSchedule(null);
        setNumRepeats(null);
        setErrorMessage("");
    }

    //Function to get garden names and plot numbers for plot selection dropdown
    async function getPlots() {

        try {
            const response = await axios.post("https://grow-well-server.herokuapp.com/garden/getAllGardens", { responseType: 'json' });

            let status = response.status;

            if (status == 200) {
                let userGardens = response.data.gardens;
                let plotLabels = [];

                if (userGardens !== null) {
                    userGardens.forEach((garden) => {
                        let name = garden.name;
                        name = unescape(name);
                        let garden_id = garden._id;

                        for (let i = 0; i < garden.plot.length; i++) {
                            let plot_number = garden.plot[i].plot_number;
                            let displayedPlotNumber = plot_number + 1;
                            let label = name + ": Plot " + displayedPlotNumber;
                            let value = garden_id + ":" + plot_number + ":" + label;
                            let entry = { label: label, value: value };
                            plotLabels.push(entry);
                        }
                    });
                }
                setPlots(plotLabels);
            }

        } catch (error) {
            console.log(error);
        }
    }

    async function createAlarm(props, title, date, schedule, numRepeats, parent, selectedPlot) {

        date = moment(date).format();
        let error = false;
        let message = "";

        let body = {
            "title": title,
            "due_date": date,
        };

        if (parent !== null) {
            body.parent = parent;
        }

        if (schedule !== null) {
            if (schedule < 1) {
                setErrorMessage("Schedule must be greater than 0 days.");
                error = true;
                return;
            }
            if (numRepeats == null) {
                setErrorMessage("Number of repeats must be provided with schedule.");
                error = true;
                return;
            }
            if (numRepeats < 1) {
                setErrorMessage("Number of repeats must be greater than 0.");
                error = true;
                return;
            }

            if (parent == null) {
                body.isParent = true;
            }

        } else if (schedule == null && numRepeats !== null) {
            setErrorMessage("Schedule must be provided with number of repeats.");
            error = true;
            return;
        }

        if (error == true) {
            return;
        }

        if (selectedPlot !== undefined && selectedPlot !== null) {
            let gardenData = selectedPlot.split(":");
            let garden_id = gardenData[0];
            let plot_number = gardenData[1];
            body.garden_id = garden_id;
            body.plot_number = plot_number;
        }

        notificationID = await ScheduleNotification(title, selectedPlot, date);
        if (notificationID !== null) {
            body.notification_id = notificationID;
        }

        try {
            const response = await axios.post("https://grow-well-server.herokuapp.com/alarm/createAlarm", body);

            let status = response.status;

            if (status == 200) {
                if (response.data.errorMessage !== undefined) {
                    setErrorMessage(response.data.errorMessage);
                    message = response.data.errorMessage;
                    await CancelNotification(notificationID);
                } else {

                    //Create repeat alarms
                    if (schedule !== null && numRepeats !== null && numRepeats > 1) {

                        if (parent == null) {
                            parent = response.data.alarm._id;
                        }
                        let newDate = moment(date).add(schedule, 'd');
                        let newNumRepeats = numRepeats - 1;
                        await createAlarm(props, title, newDate, schedule, newNumRepeats, parent, selectedPlot);
                    }
                }

                if ((numRepeats == null || numRepeats == 1) && message == "") {
                    clearState();
                    props.navigation.navigate("Alarms", { params: { updated: true } });
                }
            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {

        if (alarmTitle !== null) {
            setTitle(alarmTitle);
        }

        if (alarmSchedule !== null) {
            setChecked(true);
            setSchedule(alarmSchedule);
        }

        if (alarmDuration !== null) {
            setChecked(true);
            setNumRepeats(alarmDuration);
        }

        getPlots();
    }, []);

    const [loaded] = useFonts({
        Montserrat: require('../../assets/fonts/Montserrat-Medium.ttf')
    });

    if (!loaded) {
        return null;
    }

    return (
        <View style={styles.container}>
            <Header navigation={props.navigation} />
            <ScrollView style={styles.screen}>

                <Text style={styles.title}>New Alarm</Text>

                {
                    errorMessage !== "" ?
                        <Text style={styles.error}>{errorMessage}</Text>
                        : null
                }

                <DatePicker date={[date, setDate]} />

                <Text style={styles.subtitle}>Due: {moment(date).format("MMMM Do YYYY, h:mm A")}</Text>

                <Text style={styles.subtitle}>Title</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Your Title"
                    value={title}
                    onChangeText={setTitle}
                />

                <Text style={styles.subtitle}>Plot</Text>
                <Dropdown plots={plots} selected={[selectedPlot, setSelectedPlot]} placeholder="Select Plot" styling="largeDropdown" />

                <Checkbox.Item
                    status={checked ? 'checked' : 'unchecked'}
                    onPress={() => {
                        setChecked(!checked);
                    }}
                    color={"#80C1E3"}
                    label="Repeat Alarm"
                    position="trailing"
                    labelStyle={{ fontSize: 22, marginLeft: 5 }}
                />

                {
                    checked ?

                        <View style={styles.customRepeat}>
                            <Text style={styles.subtitle}>Days Between Repeats</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="3"
                                keyboardType="numeric"
                                value={schedule}
                                onChangeText={setSchedule}
                            />

                            <Text style={styles.subtitle}>Number of Repeats</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="5"
                                keyboardType="numeric"
                                value={numRepeats}
                                onChangeText={setNumRepeats}
                            />
                        </View>

                        : null
                }

                <View style={styles.navigationButtons}>

                    <TouchableOpacity style={styles.cancelButton} onPress={() => {
                        clearState();
                        props.navigation.navigate("Alarms");
                    }}>
                        <Text style={styles.buttonText}>CANCEL</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={async () => {
                        await createAlarm(props, title, date, schedule, numRepeats, null, selectedPlot);
                    }} >
                        <Text style={styles.buttonText}>SAVE</Text>
                    </TouchableOpacity>

                </View>

            </ScrollView >
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        marginBottom: 85
    },
    screen: {
        height: "100%",
        backgroundColor: "#EFF5E4"
    },
    title: {
        textAlign: "center",
        fontSize: 40,
        fontFamily: "Montserrat",
        paddingTop: 10
    },
    error: {
        color: "red",
        textAlign: "center",
        fontWeight: "bold"
    },
    subtitle: {
        fontSize: 22,
        marginLeft: 20,
        marginTop: 10
    },
    textInput: {
        width: "90%",
        height: 45,
        margin: 8,
        padding: 10,
        backgroundColor: "white",
        borderColor: "grey",
        borderWidth: 1,
        borderRadius: 12,
        alignSelf: "center"
    },
    customRepeat: {
        flexDirection: "column",
        flex: 2
    },
    navigationButtons: {
        flexDirection: "row",
        flex: 2,
        justifyContent: "center",
        marginTop: 5,
        marginBottom: 10
    },
    button: {
        backgroundColor: "#9477B4",
        height: 45,
        width: 110,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 10
    },
    cancelButton: {
        backgroundColor: "red",
        height: 45,
        width: 110,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 10
    },
    buttonText: {
        color: "white",
        fontSize: 16
    }
});

export default CreateAlarmScreen;