import React, { useState, useEffect } from "react";
import { Text, View, ScrollView, Image, TouchableOpacity, StyleSheet } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { unescape } from "underscore";
import axios from "axios";

import Header from "../../components/Header";
import ImageSelect from "../../components/Plant/SearchableImages";
import Dropdown from "../../components/Dropdown";
import NoteCard from "../../components/Note/NoteCard";
import PlotHistory from "../../components/Garden/PlotHistory";

import ContainerStyles from "../../styles/ContainerStyles";
import FontStyles from "../../styles/FontStyles";
import ImageStyles from "../../styles/ImageStyles";
import ButtonStyles from "../../styles/ButtonStyles";

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
        <View style={ContainerStyles.containerScroll}>
            <Header navigation={props.navigation} />

            <ScrollView style={ContainerStyles.screen} contentContainerStyle={{ flexGrow: 1 }} >

                <Text style={FontStyles.pageTitle}>Plot {plot_number}</Text>
                <Text style={FontStyles.subtitleStyledCenter}>{unescape(garden.name)}</Text>

                {
                    plant_id !== null ?

                        <View>

                            <View style={ContainerStyles.dualRow}>

                                <View style={[ContainerStyles.dualColumn, { marginBottom: 10 }]}>

                                    <View style={ContainerStyles.dualRow}>
                                        <Text style={FontStyles.subtitleStyledCenter}>Growing</Text>
                                        <View style={[ContainerStyles.dualColumn, ContainerStyles.centered]}>
                                            <Image
                                                style={ImageStyles.icon}
                                                source={ImageSelect({ name: plantName })}
                                            />
                                            <Text style={styles.iconLabel}>{plantName}</Text>
                                        </View>
                                    </View>


                                    <View style={ContainerStyles.dualRow}>
                                        <Text style={FontStyles.subtitleStyledCenter}>Date Planted</Text>
                                        <Text style={FontStyles.largeTextCenter}>{new Date(plot.date_planted).toLocaleDateString("en-UK")}</Text>
                                    </View>

                                </View>

                                <TouchableOpacity style={ButtonStyles.largeWarningButton} onPress={() => addPlantToPlot(null)}>
                                    <Text style={ButtonStyles.buttonText}>REMOVE PLANT</Text>
                                </TouchableOpacity>

                            </View>

                        </View>

                        : <View>

                            {
                                errorMessage !== "" ?
                                    <Text style={FontStyles.errorMessage}>{errorMessage}</Text>
                                    : null
                            }

                            <Text style={FontStyles.subtitleStyled}>Add Plant</Text>

                            <Dropdown plants={plants} selected={[selectedPlant, setSelectedPlant]} placeholder="Select Plant" />

                            <TouchableOpacity style={ButtonStyles.largeButton} onPress={() => addPlantToPlot(selectedPlant)}>
                                <Text style={ButtonStyles.buttonText}>ADD PLANT</Text>
                            </TouchableOpacity>

                        </View>
                }

                {
                    notes.length !== 0 ?
                        <View>
                            <Text style={FontStyles.subtitleStyled}>Plot {plot_number} Notes</Text>

                            <View style={{ paddingVertical: 10 }}>
                                {notes}
                            </View>

                        </View>
                        : null
                }

                {
                    plotHistory.length !== 0 ?
                        <View>
                            <Text style={FontStyles.subtitleStyled}>Grown Previously</Text>

                            <View style={{ paddingVertical: 10 }}>
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
    iconLabel: {
        fontSize: hp("3%"),
        paddingLeft: 7
    }
});

export default PlotScreen;