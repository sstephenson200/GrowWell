import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
const moment = require("moment");

const NoteSummary = (props) => {

    let date = moment(props.date).format("DD MMM YYYY");
    let noteSummaries = [];

    if (props.notes.length !== 0) {
        props.notes.forEach(note => {
            let noteDate = moment(note.date).format("DD MMM YYYY");
            if (noteDate == date) {
                noteSummaries.push(note);
            }
        })
    }

    return (
        <View style={styles.card}>
            <View style={styles.cardContent}>
                <Text style={styles.date}>{date}</Text>
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

                            <TouchableOpacity style={styles.button} onPress={() => {
                                alert("Ready to go to note")
                            }}>
                                <Text style={styles.buttonText}>VIEW</Text>
                            </TouchableOpacity>

                        </View>

                        : <Text>You have no entries for this date</Text>
                }
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    card: {
        alignSelf: "stretch",
        borderRadius: 15,
        elevation: 5,
        marginHorizontal: 15,
        marginVertical: 8,
        backgroundColor: "white"
    },
    cardContent: {
        marginHorizontal: 18,
        marginVertical: 20
    },
    date: {
        fontSize: 18,
        fontWeight: "bold"
    },
    noteTitles: {
        marginVertical: 1
    },
    button: {
        backgroundColor: "#9477B4",
        height: 40,
        width: 80,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        marginVertical: 5
    },
    buttonText: {
        color: "white",
        fontSize: 16
    }
});

export default NoteSummary;