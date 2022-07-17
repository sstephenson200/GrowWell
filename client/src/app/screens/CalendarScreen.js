import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useFonts } from 'expo-font';
const moment = require("moment");
import axios from "axios";

import Header from '../components/Header';

const CalendarScreen = (props) => {

    const [notes, setNotes] = useState([]);
    const [markedDates, setMarkedDates] = useState({});

    let selectedMonth = null;

    // Get notes for shown month
    async function getNotes() {

        let date = null;

        if (selectedMonth == null) {
            date = new Date();
            date = moment(date).format("YYYY-MM-DD");
        } else {
            date = selectedMonth.dateString;
        }

        try {
            const response = await axios.post("https://grow-well-server.herokuapp.com/note/getNotesByMonth", {
                "user_id": "62cec6b63dd3dfcf2a4a6185",
                "date": date
            }, { responseType: 'json' });

            let status = response.status;

            if (status == 200) {
                setNotes(response.data.notes);
                getMarkedDates(response.data.notes);
            }

        } catch (error) {
            console.log(error);
        }
    }

    //Mark dates when notes were made
    function getMarkedDates(notes) {

        const markColours = ["#9477B4", "#80C1E3", "#D26E8D", "#81BF63", "#E3B453"];

        if (notes.length !== 0) {
            let dates = {};
            for (let i = 0; i < notes.length; i++) {
                let randomNum = Math.floor(Math.random() * 4);
                let colour = markColours[randomNum];
                let date = notes[i].date;
                date = moment(date).format("YYYY-MM-DD");
                dates[date] = { selected: true, selectedColor: colour };
            }
            setMarkedDates(dates);
        }
    }

    useEffect(() => {
        getNotes();
    }, [selectedMonth]);

    const [loaded] = useFonts({
        Montserrat: require('../assets/fonts/Montserrat-Medium.ttf')
    });

    if (!loaded) {
        return null;
    }

    return (
        <View style={styles.container}>
            <Header navigation={props.navigation} />
            <View style={styles.screen}>
                <Calendar
                    style={styles.calendar}
                    theme={{
                        calendarBackground: "#EFF5E4",
                        arrowColor: "#9477B4",
                        textMonthFontFamily: "Montserrat",
                        textMonthFontSize: 35
                    }}
                    onDayPress={day => {
                        console.log("Day selected: ", day);
                    }}
                    onMonthChange={month => {
                        selectedMonth = month;
                    }}
                    hideExtraDays={true}
                    firstDay={1}
                    markedDates={markedDates}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between"
    },
    screen: {
        height: "100%",
        backgroundColor: "#EFF5E4"
    },
    calendar: {
        marginTop: 5
    }
});

export default CalendarScreen;