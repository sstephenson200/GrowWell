import React, { useState, useEffect } from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import { unescape } from 'underscore';
import axios from "axios";

import Header from '../components/Header';
import ImageSelect from '../components/SearchableImages';
import Dropdown from '../components/Dropdown';

//Method to sort plants array by name
function sortPlants(props) {
    return function (a, b) {
        if (a[props] > b[props]) {
            return 1;
        } else if (a[props] < b[props]) {
            return -1;
        }
        return 0;
    }
}

const PlotScreen = (props) => {

    const [plantName, setPlantName] = useState(null);
    const [plants, setPlants] = useState([]);
    const [selectedPlant, setSelectedPlant] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    let plot = props.route.params.plot;
    let garden = props.route.params.garden;

    let plot_number = plot.plot_number + 1;
    let plant_id = plot.plant_id;

    function clearState() {
        setSelectedPlant(null);
        setErrorMessage("");
    }

    // Get plant name for use in icon selection
    async function getPlantName() {
        try {
            const response = await axios.post("https://grow-well-server.herokuapp.com/plant/getPlantByID", {
                "plant_id": plant_id
            }, { responseType: 'json' });

            let status = response.status;

            if (status == 200) {
                setPlantName(response.data.plant.name);
            }

        } catch (error) {
            console.log(error);
        }
    }

    //Get all plant data
    const getPlants = async () => {
        try {
            const response = await fetch("https://grow-well-server.herokuapp.com/plant/getAllPlants");
            const json = await response.json();
            let sortedPlants = json.plants.sort(sortPlants("name"));

            let plantLabels = [];

            if (sortedPlants !== null) {
                sortedPlants.forEach((plant) => {
                    let name = plant.name;
                    let id = plant._id;
                    let entry = { label: name, value: id };
                    plantLabels.push(entry);
                });
            }
            setPlants(plantLabels);
        } catch (error) {
            console.error(error);
        }
    }

    //Add plant to garden plot
    const addPlantToPlot = async (selectedPlant) => {

        try {

            let response = null;

            if (selectedPlant !== null) {
                response = await axios.put("https://grow-well-server.herokuapp.com/garden/updatePlotPlant", {
                    "plant_id": selectedPlant,
                    "plot_number": plot.plot_number,
                    "garden_id": garden._id
                }, { responseType: 'json' });
            } else {

                //need to add removed plant to plot history in later sprint

                response = await axios.put("https://grow-well-server.herokuapp.com/garden/updatePlotPlant", {
                    "plot_number": plot.plot_number,
                    "garden_id": garden._id
                }, { responseType: 'json' });
            }

            let status = response.status;

            if (status == 200) {
                clearState();
                props.navigation.navigate("Garden");
            } else {
                setErrorMessage(response.data.errorMessage);
            }

        } catch (error) {
            console.log(error);
        }

    }

    useEffect(() => {
        if (plant_id !== null) {
            getPlantName();
        } else {
            getPlants();
        }
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

            <View style={styles.screen}>

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

                            <Dropdown plants={plants} selected={[selectedPlant, setSelectedPlant]} placeholder="Select Plant" styling="largeDropdown" />

                            <TouchableOpacity style={styles.button} onPress={() => addPlantToPlot(selectedPlant)}>
                                <Text style={styles.buttonText}>ADD PLANT</Text>
                            </TouchableOpacity>
                        </View>
                }

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
        margin: 10,
        marginBottom: 450
    },
    buttonText: {
        color: "white",
        fontSize: 18
    }
});

export default PlotScreen;