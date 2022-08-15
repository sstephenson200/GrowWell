import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
const moment = require("moment");

import CardStyles from "../../styles/CardStyles";
import FontStyles from "../../styles/FontStyles";
import ButtonStyles from "../../styles/ButtonStyles";

const NoteSummary = (props) => {

    let date = moment(props.date).format("DD MMM YYYY");
    let noteSummaries = [];
    let noteData = [];

    //Initialise provided data from calendar screen
    if (props.notes.length !== 0) {
        let key = 0;
        props.notes.forEach(note => {
            let noteDate = moment(note.date).format("DD MMM YYYY");
            if (noteDate == date) {
                noteData.push(note);
                noteSummaries.push(
                    <Text testID={`noteTitle${key}`} key={"noteSummary_" + [key]} style={styles.noteTitles}>{note.title}</Text>);
                key++;
            }
        });
    }

    return (
        <View style={[CardStyles.card, { marginBottom: 20 }]}>
            <View style={CardStyles.cardContent}>
                <Text style={FontStyles.boldHeader}>{date}</Text>
                {
                    noteSummaries.length !== 0 ?

                        <View>
                            {noteSummaries}

                            <TouchableOpacity testID="noteLink" style={[ButtonStyles.smallButton, { alignSelf: "center" }]} onPress={() => props.navigation.navigate("StackNavigator", { screen: "Note", params: { date: date, notes: noteData } })}>
                                <Text style={ButtonStyles.buttonText}>VIEW</Text>
                            </TouchableOpacity>

                        </View>

                        : <Text testID="noNotesMessage" >You have no entries for this date</Text>
                }
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    noteTitles: {
        marginVertical: 1
    }
});

export default NoteSummary;