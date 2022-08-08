import React, { useState, useEffect } from "react";
import { Text, View, ScrollView, Image, TouchableOpacity, StyleSheet } from "react-native";
import { unescape } from "underscore";
import axios from "axios";

import Header from "../../components/Header";
import ImageSelect from "../../components/Plant/SearchableImages";
import Dropdown from "../../components/Dropdown";
import NoteCard from "../../components/Note/NoteCard";
import PlotHistory from "../../components/Garden/PlotHistory";

import GetPlantByID from "../../requests/Plant/GetPlantByID";
import GetAllPlants from "../../requests/Plant/GetAllPlants";
import UpdatePlotPlant from "../../requests/Garden/UpdatePlotPlant";

const PlotScreen = (props) => {

    const [plantName, setPlantName] = useState(null);
    const [plants, setPlants] = useState([]);
    const [selectedPlant, setSelectedPlant] = useState(null);
    const [notes, setNotes] = useState([]);
    const [plotHistory, setPlotHistory] = useState([]);
    const [updatePlot, setUpdatePlot] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    let plot = props.route.params.plot;
    let garden = props.route.params.garden;

    let plot_number = plot.plot_number + 1;
    let plant_id = plot.plant_id;

    useEffect(() => {
        if (plant_id !== null) {
            //If plot is not empty:
            getPlantName();
        } else {
            //If plot is empty:
            getPlants();
        }
        getNotesByPlot();
        getPlotHistory();
    }, [props]);

    //Function to reset state when leaving the page
    function clearState() {
        setSelectedPlant(null);
        setErrorMessage("");
    }

    //Function to get plant name for use in title and icon selection
    async function getPlantName() {
        setPlantName(await GetPlantByID(plant_id, "name"));
    }

    //Function to get all plants to fill plant selection dropdown
    async function getPlants() {
        let plantList = (await GetAllPlants());
        let plantLabels = [];

        if (plantList !== null) {
            plantList.forEach((plant) => {
                let name = plant.name;
                let id = plant._id;
                let entry = { label: name, value: id };
                plantLabels.push(entry);
            });
        }
        setPlants(plantLabels);
    }

    //Function to add or remove a plant from a given plot
    async function addPlantToPlot() {
        let response = (await UpdatePlotPlant(selectedPlant, plot.plot_number, garden._id));

        if (response.data.errorMessage !== undefined) {
            setErrorMessage(response.data.errorMessage);
        } else {
            if (selectedPlant == null) {
                //Add removed plant to plot history
                await updatePlotHistory(plot.date_planted);
            }
            if (errorMessage == "") {
                clearState();
                setUpdatePlot(!updatePlot);
                props.navigation.navigate("Garden", { updatePlot });
            }
        }
    }

    //Function to get notes for a given garden plot
    async function getNotesByPlot() {

        try {
            const response = await axios.post("/note/getNotesByPlot", {
                "garden_id": garden._id,
                "plot_number": plot.plot_number
            }, { responseType: "json" });

            let status = response.status;

            if (status == 200) {
                let noteCards = [];
                let noteResults = response.data.notes;

                if (noteResults.length !== 0) {
                    for (let i = 0; i < noteResults.length; i++) {
                        noteCards.push(
                            <NoteCard key={[i]} note={noteResults[i]} />
                        );
                    }
                }
                setNotes(noteCards);
            }
        } catch (error) {
            console.error(error);
        }
    }

    //Function to render all plot history entries
    function getPlotHistory() {

        let history = [];

        if (plot.plot_history.length !== 0) {
            for (let i = 0; i < plot.plot_history.length; i++) {
                history.push(
                    <PlotHistory key={[i]} plot_history={plot.plot_history[i]} />
                );
            }
        }
        setPlotHistory(history);
    }

    //Function to add removed plant to plot history
    async function updatePlotHistory(date_planted) {

        try {
            const response = await axios.put("/garden/updatePlotHistory", {
                "plant_id": plant_id,
                "date_planted": date_planted,
                "plot_number": plot.plot_number,
                "garden_id": garden._id
            }, { responseType: "json" });

            let status = response.status;

            if (status == 200) {
                if (response.data.errorMessage !== undefined) {
                    setErrorMessage(response.data.errorMessage);
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <View style={styles.container}>
            <Header navigation={props.navigation} />

            <ScrollView style={styles.screen} contentContainerStyle={{ flexGrow: 1 }} >

                <Text style={styles.title}>Plot {plot_number}</Text>
                <Text style={styles.subtitle}>{unescape(garden.name)}</Text>

                {
                    plant_id !== null ?

                        <View style={{ flexDirection: "column", flex: 2 }}>

                            <View style={styles.currentPlant}>

                                <View style={styles.titledData}>
                                    <Text style={styles.subtitle}>Growing</Text>
                                    <View style={styles.plantTitle}>
                                        <Image
                                            style={styles.icon}
                                            source={ImageSelect({ name: plantName })}
                                        />
                                        <Text style={styles.plantName}>{plantName}</Text>
                                    </View>
                                </View>


                                <View style={styles.titledData}>
                                    <Text style={styles.subtitle}>Date Planted</Text>
                                    <Text style={styles.date}>{new Date(plot.date_planted).toLocaleDateString("en-UK")}</Text>
                                </View>

                            </View>

                            <TouchableOpacity style={styles.deleteButton} onPress={() => addPlantToPlot(null)}>
                                <Text style={styles.buttonText}>REMOVE PLANT</Text>
                            </TouchableOpacity>

                        </View>

                        : <View>

                            {
                                errorMessage !== "" ?
                                    <Text style={styles.error}>{errorMessage}</Text>
                                    : null
                            }

                            <Text style={styles.heading}>Add Plant</Text>

                            <Dropdown plants={plants} selected={[selectedPlant, setSelectedPlant]} placeholder="Select Plant" />

                            <TouchableOpacity style={styles.button} onPress={() => addPlantToPlot(selectedPlant)}>
                                <Text style={styles.buttonText}>ADD PLANT</Text>
                            </TouchableOpacity>
                        </View>
                }

                {
                    notes.length !== 0 ?
                        <View>
                            <Text style={styles.cardsTitle}>Plot {plot_number} Notes</Text>

                            <View style={styles.cards}>
                                {notes}
                            </View>

                        </View>
                        : null
                }

                {
                    plotHistory.length !== 0 ?
                        <View>
                            <Text style={styles.cardsTitle}>Grown Previously</Text>

                            <View>
                                {plotHistory}
                            </View>

                        </View>
                        : null
                }

            </ScrollView>

        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        marginBottom: 85
    },
    screen: {
        height: "100%",
        backgroundColor: "#EFF5E4",
        marginTop: 10
    },
    title: {
        textAlign: "center",
        fontSize: 40,
        fontFamily: "Montserrat"
    },
    subtitle: {
        fontSize: 25,
        textAlign: "center",
        fontFamily: "Montserrat"
    },
    heading: {
        fontSize: 25,
        fontFamily: "Montserrat",
        marginLeft: 10,
        marginTop: 10
    },
    currentPlant: {
        flexDirection: "row",
        flex: 2,
        marginTop: 10,
        justifyContent: "center"
    },
    titledData: {
        flexDirection: "column",
        flex: 2
    },
    plantTitle: {
        flexDirection: "row",
        flex: 2,
        justifyContent: "center",
        margin: 5
    },
    icon: {
        width: 30,
        height: 30
    },
    plantName: {
        fontSize: 20,
        paddingLeft: 7
    },
    date: {
        textAlign: "center",
        fontSize: 20,
        margin: 5
    },
    error: {
        color: "red",
        textAlign: "center",
        fontWeight: "bold"
    },
    button: {
        backgroundColor: "#9477B4",
        height: 50,
        width: 130,
        borderRadius: 8,
        alignItems: "center",
        alignSelf: "center",
        justifyContent: "center",
        marginTop: 10
    },
    deleteButton: {
        backgroundColor: "red",
        height: 50,
        width: 150,
        borderRadius: 8,
        alignItems: "center",
        alignSelf: "center",
        justifyContent: "center",
        margin: 10
    },
    buttonText: {
        color: "white",
        fontSize: 18
    },
    cardsTitle: {
        fontSize: 25,
        fontFamily: "Montserrat",
        color: "black",
        paddingLeft: 10
    },
    cards: {
        paddingVertical: 10
    }
});

export default PlotScreen;