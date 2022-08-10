import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
const moment = require("moment");

import CardStyles from "../../styles/CardStyles";
import FontStyles from "../../styles/FontStyles";
import ButtonStyles from "../../styles/ButtonStyles";

const NoteSummary = (props) => {

    let date = moment(props.date).format("DD MMM YYYY");
    let noteSummaries = [];

    //Initialise provided data from calendar screen
    if (props.notes.length !== 0) {
        props.notes.forEach(note => {
            let noteDate = moment(note.date).format("DD MMM YYYY");
            if (noteDate == date) {
                noteSummaries.push(note);
            }
        });
    }

    return (
        <View style={CardStyles.card}>
            <View style={CardStyles.cardContent}>
                <Text style={FontStyles.boldHeader}>{date}</Text>
                {
                    noteSummaries.length !== 0 ?

                        <View>
                            <FlatList
                                data={noteSummaries}
                                renderItem={({ item }) => {
                                    return (
                                        <Text style={styles.noteTitles}>{item.title}</Text>
                                    );
                                }}
                            />

                            <TouchableOpacity style={[ButtonStyles.smallButton, { alignSelf: "center" }]} onPress={() => props.navigation.navigate("StackNavigator", { screen: "Note", params: { date: date, notes: noteSummaries } })}                            >
                                <Text style={ButtonStyles.buttonText}>VIEW</Text>
                            </TouchableOpacity>

                        </View>

                        : <Text>You have no entries for this date</Text>
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