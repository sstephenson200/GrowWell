import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import axios from 'axios';
import { unescape } from 'underscore';
const moment = require("moment");
import { Checkbox } from 'react-native-paper';

import Header from '../components/Header';
import DatePicker from '../components/DatePicker';
import Dropdown from "../components/Dropdown";

const NewAlarmScreen = (props) => {

    let tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [date, setDate] = useState(tomorrow);
    const [title, setTitle] = useState("");
    const [plots, setPlots] = useState([]);
    const [selectedPlot, setSelectedPlot] = useState(null);
    const [checked, setChecked] = useState(false);
    const [schedule, setSchedule] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    //Function to reset state when leaving the page
    function clearState() {
        setDate(new Date());
        setTitle("");
        setSelectedPlot(null);
        setSchedule(null);
        setErrorMessage("");
    }

    //Function to get garden names and plot numbers for plot selection dropdown
    async function getPlots() {
        try {
            const response = await axios.post("https://grow-well-server.herokuapp.com/garden/getAllGardens", {
                "user_id": "62cec6b63dd3dfcf2a4a6185"
            }, { responseType: 'json' });

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
                            let value = garden_id + ":" + plot_number;
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

    async function createAlarm(props, title, date, schedule, selectedPlot) {

        date = moment(date).format();

        let body = {
            "user_id": "62cec6b63dd3dfcf2a4a6185",
            "title": title,
            "due_date": date,
        };

        if (schedule !== null) {
            body.schedule = schedule;
        }

        if (selectedPlot !== null) {
            let gardenData = selectedPlot.split(":");
            let garden_id = gardenData[0];
            let plot_number = gardenData[1];
            body.garden_id = garden_id
            body.plot_number = plot_number;
        }

        try {
            const response = await axios.post("https://grow-well-server.herokuapp.com/alarm/createAlarm", body);

            let status = response.status;

            if (status == 200) {
                if (response.data.errorMessage !== undefined) {
                    setErrorMessage(response.data.errorMessage);
                } else {
                    clearState();
                    props.navigation.navigate("Alarms");
                }
            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getPlots();
    }, []);

    const [loaded] = useFonts({
        Montserrat: require('../assets/fonts/Montserrat-Medium.ttf')
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
                            <Text style={styles.subtitle}>Days To Repeat</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="3"
                                keyboardType="numeric"
                                value={schedule}
                                onChangeText={setSchedule}
                            />
                        </View>

                        : null
                }

                <View style={styles.navigationButtons}>

                    <TouchableOpacity style={styles.cancelButton} onPress={() => {
                        clearState()
                        props.navigation.navigate("Alarms")
                    }}>
                        <Text style={styles.buttonText}>CANCEL</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={async () => await createAlarm(props, title, date, schedule, selectedPlot)}>
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
        justifyContent: "space-between"
    },
    screen: {
        height: "100%",
        backgroundColor: "#EFF5E4",
        paddingBottom: 180
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
        marginTop: 5
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

export default NewAlarmScreen;