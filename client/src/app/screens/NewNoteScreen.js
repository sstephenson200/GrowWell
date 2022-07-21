import React, { useState, useEffect } from 'react';
import { Text, ScrollView, View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import axios from 'axios';
import { unescape } from 'underscore';

import Header from '../components/Header';
import Dropdown from "../components/Dropdown";

const NewNoteScreen = (props) => {

    const [title, setTitle] = useState("");
    const [plots, setPlots] = useState([]);
    const [description, setDescription] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedPlot, setSelectedPlot] = useState(null);

    //Function to reset state when leaving the page
    function clearState() {
        setTitle("");
        setDescription("");
        setErrorMessage("");
        setSelectedPlot(null);
    }

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

    async function createNote(props, title, description, selectedPlot) {

        let body = {
            note: {
                "user_id": "62cec6b63dd3dfcf2a4a6185",
                "title": title
            }
        };

        if (description !== "") {
            body.note.description = description;
        }

        if (selectedPlot !== null) {
            let gardenData = selectedPlot.split(":");
            let garden_id = gardenData[0];
            let plot_number = gardenData[1];
            body.note.garden_id = garden_id
            body.note.plot_number = plot_number;
        }

        try {
            const response = await axios.post("https://grow-well-server.herokuapp.com/note/createNote", body);


            let status = response.status;

            if (status == 200) {
                if (response.data.errorMessage !== undefined) {
                    setErrorMessage(response.data.errorMessage);
                } else {
                    clearState();
                    props.navigation.navigate("Calendar");
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

                <Text style={styles.title}>New Entry</Text>

                {
                    errorMessage !== "" ?
                        <Text style={styles.error}>{errorMessage}</Text>
                        : null
                }

                <Text style={styles.subtitle}>Title</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Your Title"
                    value={title}
                    onChangeText={setTitle}
                />

                <Text style={styles.subtitle}>Plot</Text>
                <Dropdown plots={plots} selected={[selectedPlot, setSelectedPlot]} placeholder="Select Plot" styling="largeDropdown" />

                <Text style={styles.subtitle}>Description</Text>
                <TextInput
                    style={styles.textInputLarge}
                    multiline={true}
                    numberOfLines={3}
                    placeholder="Your description..."
                    value={description}
                    onChangeText={setDescription}
                />

                <TouchableOpacity style={styles.addPhotosButton} onPress={async () => alert("Ready to add photo!")}>
                    <Text style={styles.buttonText}>ADD PHOTOS</Text>
                </TouchableOpacity>

                <View style={styles.navigationButtons}>

                    <TouchableOpacity style={styles.cancelButton} onPress={() => {
                        clearState()
                        props.navigation.navigate("Calendar")
                    }}>
                        <Text style={styles.buttonText}>CANCEL</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={async () => await createNote(props, title, description, selectedPlot)}>
                        <Text style={styles.buttonText}>SAVE</Text>
                    </TouchableOpacity>

                </View>

            </ScrollView>
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
    textInputLarge: {
        width: "90%",
        height: 60,
        margin: 8,
        padding: 10,
        backgroundColor: "white",
        borderColor: "grey",
        borderWidth: 1,
        borderRadius: 12,
        alignSelf: "center"
    },
    addPhotosButton: {
        backgroundColor: "#9477B4",
        height: 40,
        width: 120,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        marginVertical: 15
    },
    navigationButtons: {
        flexDirection: "row",
        flex: 2,
        justifyContent: "center",
        marginTop: 5
    },
    button: {
        backgroundColor: "#9477B4",
        height: 40,
        width: 100,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 10
    },
    cancelButton: {
        backgroundColor: "red",
        height: 40,
        width: 100,
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

export default NewNoteScreen;