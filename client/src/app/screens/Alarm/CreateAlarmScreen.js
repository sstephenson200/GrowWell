import React, { useState, useEffect } from "react";
import { Text, View, ScrollView, TouchableOpacity, TextInput } from "react-native";
import axios from "axios";
const moment = require("moment");
import { Checkbox } from "react-native-paper";

import { CancelNotification, ScheduleNotification } from "../../notifications/PushNotification";

import Header from "../../components/Header";
import DatePicker from "../../components/Alarm/DatePicker";
import Dropdown from "../../components/Dropdown";

import ContainerStyles from "../../styles/ContainerStyles";
import FontStyles from "../../styles/FontStyles";
import InputStyles from "../../styles/InputStyles";
import ButtonStyles from "../../styles/ButtonStyles";

import GetAllGardens from "../../requests/Garden/GetAllGardens";

const CreateAlarmScreen = (props) => {

    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    let notificationID = null;

    let alarmTitle = null;
    let alarmSchedule = null;
    let alarmDuration = null;

    //Initialise parameters if alarm details have been passed in from plant screen
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

    useEffect(() => {

        //Set parameters provided from plant screen
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
    }, [props]);

    //Function to reset state when leaving the page
    function clearState() {
        setDate(tomorrow);
        setTitle("");
        setSelectedPlot(null);
        setChecked(false);
        setSchedule(null);
        setNumRepeats(null);
        setErrorMessage("");
    }

    //Call GetAllGardens to fill plot selection dropdown
    async function getPlots() {
        setPlots(await GetAllGardens("allPlots"));
    }

    //Function to create a new alarm based on provided form data
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
                //If alarm is repeating, the first alarm must be classified as the parent
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

        //Link notification ID to alarm to allow for cancelling/re-adding the schedule when the alarm is on/off
        notificationID = await ScheduleNotification(title, selectedPlot, date);
        if (notificationID !== null) {
            body.notification_id = notificationID;
        }

        try {
            const response = await axios.post("/alarm/createAlarm", body);

            let status = response.status;

            if (status == 200) {
                if (response.data.errorMessage !== undefined) {
                    setErrorMessage(response.data.errorMessage);
                    message = response.data.errorMessage;
                    await CancelNotification(notificationID);
                } else {

                    //Create repeat alarms
                    if (schedule !== null && numRepeats !== null && numRepeats > 1) {

                        //Generate new alarm data
                        if (parent == null) {
                            parent = response.data.alarm._id;
                        }
                        let newDate = moment(date).add(schedule, "d");
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

    return (
        <View style={ContainerStyles.containerScroll}>
            <Header navigation={props.navigation} />
            <ScrollView style={ContainerStyles.screen} contentContainerStyle={{ flexGrow: 1 }}>

                <Text style={FontStyles.pageTitle}>New Alarm</Text>

                {
                    errorMessage !== "" ?
                        <Text style={FontStyles.errorMessage}>{errorMessage}</Text>
                        : null
                }

                <DatePicker date={[date, setDate]} />

                <Text style={FontStyles.subtitle}>Due: {moment(date).format("MMMM Do YYYY, h:mm A")}</Text>

                <Text style={FontStyles.subtitle}>Title</Text>
                <TextInput
                    style={InputStyles.textInput}
                    placeholder="Your Title"
                    value={title}
                    onChangeText={setTitle}
                />

                <Text style={FontStyles.subtitle}>Plot</Text>
                <View>
                    <Dropdown plots={plots} selected={[selectedPlot, setSelectedPlot]} placeholder="Select Plot" />
                </View>

                <Checkbox.Item
                    status={checked ? "checked" : "unchecked"}
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

                        <View style={ContainerStyles.dualRow}>
                            <Text style={FontStyles.subtitle}>Days Between Repeats</Text>
                            <TextInput
                                style={InputStyles.textInput}
                                placeholder="3"
                                keyboardType="numeric"
                                value={schedule}
                                onChangeText={setSchedule}
                            />

                            <Text style={FontStyles.subtitle}>Number of Repeats</Text>
                            <TextInput
                                style={InputStyles.textInput}
                                placeholder="5"
                                keyboardType="numeric"
                                value={numRepeats}
                                onChangeText={setNumRepeats}
                            />
                        </View>

                        : null
                }

                <View style={ButtonStyles.buttonContainer}>

                    <TouchableOpacity style={ButtonStyles.smallWarningButton} onPress={() => {
                        clearState();
                        props.navigation.navigate("Alarms");
                    }}>
                        <Text style={ButtonStyles.buttonText}>CANCEL</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={ButtonStyles.smallButton} onPress={async () => {
                        await createAlarm(props, title, date, schedule, numRepeats, null, selectedPlot);
                    }} >
                        <Text style={ButtonStyles.buttonText}>SAVE</Text>
                    </TouchableOpacity>

                </View>

            </ScrollView >
        </View >
    );
}

export default CreateAlarmScreen;