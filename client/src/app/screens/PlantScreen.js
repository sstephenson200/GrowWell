import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, Image, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import axios from 'axios';
import { unescape } from 'underscore';

import Header from '../components/Header';
import ImageSelect from "../components/SearchableImages";
import Dropdown from "../components/Dropdown";
import CareRequirementsTable from '../components/CareRequirementsTable';
import Infographic from '../components/MonthlyPlantData';
import NoteCard from '../components/NoteCard';

const PlantScreen = (props) => {

    let plant_id = props.route.params.plant_id;
    let name = null;
    let plant_type = null;
    let photo1 = null;
    let photo2 = null;
    let photo3 = null;

    const [plant, setPlant] = useState([]);
    const [notes, setNotes] = useState([]);
    const [plots, setPlots] = useState([]);
    const [selectedPlot, setSelectedPlot] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    //Function to reset state when leaving the page
    function clearState() {
        setErrorMessage("");
        setSelectedPlot(null);
    }

    const getPlantData = async () => {
        let plantData = await getPlant();
        getNotes();
        getPlots();
        await getImages(plantData);
    }

    //Get plant data
    const getPlant = async () => {
        try {
            const response = await axios.post("https://grow-well-server.herokuapp.com/plant/getPlantByID", {
                "plant_id": plant_id
            }, { responseType: 'json' });
            const plant = await response.data.plant;
            return plant;
        } catch (error) {
            console.error(error);
        }
    }

    //Get corresponding plant images
    const getImages = async (plantData) => {
        if (plantData.image.length <= 0)
            return;

        let updatedPlantData = [];
        let plantPhotos = [];

        let fileReaderInstance = new FileReader();

        for (let i = 0; i < plantData.image.length; i++) {

            let id = plantData.image[i];
            let blob = await axios.post("https://grow-well-server.herokuapp.com/plant/getImageByID", {
                image_id: id
            }, { responseType: 'blob' });
            let base64Image = null;
            fileReaderInstance.readAsDataURL(blob.data);
            fileReaderInstance.onload = async () => {
                base64Image = fileReaderInstance.result;
                plantPhotos.push(base64Image);
                plantData.photo = plantPhotos;
            }
        }

        updatedPlantData.push(plantData);

        fileReaderInstance.onloadend = () => {
            if (updatedPlantData[0].photo.length === plantData.image.length) {
                setPlant(plantData);
            }
        }
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
                            //Prevent filled plots being shown
                            if (garden.plot[i].plant_id == null) {
                                let plot_number = garden.plot[i].plot_number;
                                let displayedPlotNumber = plot_number + 1;
                                let label = name + ": Plot " + displayedPlotNumber;
                                let value = garden_id + ":" + plot_number;
                                let entry = { label: label, value: value };
                                plotLabels.push(entry);
                            }
                        }
                    });
                }
                setPlots(plotLabels);
            }

        } catch (error) {
            console.log(error);
        }
    }

    // Get notes for shown month
    async function getNotes() {

        try {
            const response = await axios.post("https://grow-well-server.herokuapp.com/note/getNotes", {
                "user_id": "62cec6b63dd3dfcf2a4a6185"
            }, { responseType: 'json' });

            let status = response.status;

            if (status == 200) {
                let allNotes = response.data.notes;

                filterNotes(allNotes);
            }

        } catch (error) {
            console.log(error);
        }
    }

    // Get notes for shown month
    async function filterNotes(notes) {

        let filteredData = [];

        for (let i = 0; i < notes.length; i++) {
            let plot_number = notes[i].plot_number;
            let garden_id = notes[i].garden_id;

            if (garden_id !== null) {
                try {
                    const response = await axios.post("https://grow-well-server.herokuapp.com/garden/getGardenByID", {
                        "garden_id": garden_id
                    }, { responseType: 'json' });

                    let status = response.status;

                    if (status == 200) {
                        let plot = response.data.garden.plot[plot_number];
                        if (plot.plant_id === plant_id) {
                            filteredData.push(
                                <NoteCard key={[i]} note={notes[i]} />
                            )
                        }
                    }

                } catch (error) {
                    console.log(error);
                }
            }

        }
        setNotes(filteredData);
    }

    //Add plant to garden plot
    const addPlantToPlot = async () => {

        if (selectedPlot !== null) {
            let gardenData = selectedPlot.split(":");
            let garden_id = gardenData[0];
            let plot_number = gardenData[1];

            try {

                let response = await axios.put("https://grow-well-server.herokuapp.com/garden/updatePlotPlant", {
                    "plant_id": plant_id,
                    "plot_number": plot_number,
                    "garden_id": garden_id
                }, { responseType: 'json' });

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
    }

    useEffect(() => {
        getPlantData();
    }, []);

    //Load title font
    const [loaded] = useFonts({
        Montserrat: require('../assets/fonts/Montserrat-Medium.ttf')
    });

    if (!loaded) {
        return null;
    }

    //Set plant variables when images have been added and plant data reset
    if (plant.length !== 0) {
        name = plant.name;
        plant_type = plant.plant_type.toUpperCase();
        if (plant_type == "VEGETABLE") {
            plant_type = "VEG";
        }
        photo1 = plant.photo[0];
        photo2 = plant.photo[1];
        photo3 = plant.photo[2];
    }

    return (

        <View style={styles.container}>

            <Header navigation={props.navigation} />

            <ScrollView style={styles.screen}>

                <ImageBackground
                    style={styles.backgroundImage}
                    source={{ uri: photo1 }}
                    imageStyle={{ opacity: 0.6 }}
                >
                    <View style={styles.title}>
                        <Image
                            style={styles.icon}
                            source={ImageSelect({ name })}
                        />
                        <Text style={styles.titleText}>{name}</Text>
                    </View>

                    <View style={styles[plant_type]}>
                        <Text style={styles.plantType}>{plant_type}</Text>
                    </View>

                </ImageBackground>

                <Text style={styles.description}>{plant.description}</Text>

                <View style={styles.plantPhotos}>
                    <Image
                        style={styles.photo}
                        source={{ uri: photo2 }}
                    />
                    <Image
                        style={styles.photo}
                        source={{ uri: photo3 }}
                    />
                </View>

                <Text style={styles.subtitle}>Add To Garden</Text>

                {
                    errorMessage !== "" ?
                        <Text style={styles.error}>{errorMessage}</Text>
                        : null
                }

                <Dropdown plots={plots} selected={[selectedPlot, setSelectedPlot]} placeholder="Select Plot" styling="largeDropdown" />

                <TouchableOpacity style={styles.button} onPress={() => addPlantToPlot()}>
                    <Text style={styles.buttonText}>ADD PLANT</Text>
                </TouchableOpacity>

                <Text style={styles.subtitle}>Seasonal Data</Text>

                <Infographic.InfographicLabels plantPage={true} />

                {
                    plant.sow_date !== undefined && plant.sow_date.length !== 0 ?

                        <View style={styles.monthInfographic}>
                            <Text style={styles.seasonalTitle}>Sow</Text>
                            <Infographic.GeneralInfographic style={styles.infographic} schedule={plant.sow_date} plantPage={true} />
                        </View>

                        : null
                }

                {
                    plant.plant_date !== undefined && plant.plant_date.length !== 0 ?

                        <View style={styles.monthInfographic}>
                            <Text style={styles.seasonalTitle}>Plant</Text>
                            <Infographic.GeneralInfographic style={styles.infographic} schedule={plant.plant_date} plantPage={true} />
                        </View>

                        : null
                }

                {
                    plant.transplant_date !== undefined && plant.transplant_date.length !== 0 ?

                        <View style={styles.monthInfographic}>
                            <Text style={styles.seasonalTitle}>Transplant</Text>
                            <Infographic.GeneralInfographic style={styles.infographic} schedule={plant.transplant_date} plantPage={true} />
                        </View>

                        : null
                }

                {
                    plant.harvest_date !== undefined && plant.harvest_date.length !== 0 ?

                        <View style={styles.monthInfographic}>
                            <Text style={styles.seasonalTitle}>Harvest</Text>
                            <Infographic.GeneralInfographic style={styles.infographic} schedule={plant.harvest_date} plantPage={true} />
                        </View>

                        : null
                }

                <Text style={styles.subtitle}>Care Requirements</Text>

                <CareRequirementsTable
                    navigation={props.navigation}
                    name={plant.name}
                    sow_date={plant.sow_date}
                    plant_date={plant.plant_date}
                    harvest_date={plant.harvest_date}
                    spacing={plant.spacing}
                    sun_condition={plant.sun_condition}
                    soil_type={plant.soil_type}
                    soil_ph={plant.soil_ph}
                    water_schedule={plant.water_schedule}
                    compost_schedule={plant.compost_schedule}
                    prune_schedule={plant.prune_schedule}
                    feed_schedule={plant.feed_schedule}
                    indoor_schedule={plant.indoor_schedule}
                    plant_problem={plant.plant_problem}
                    companion_plant={plant.companion_plant}
                    incompatible_plant={plant.incompatible_plant}
                />

                {
                    notes.length !== 0 ?
                        <View>
                            <Text style={styles.cardsTitle}>{plant.name} Notes</Text>

                            <View style={styles.cards}>
                                {notes}
                            </View>

                        </View>
                        : null
                }

            </ScrollView >

        </View>

    )
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
    },
    backgroundImage: {
        height: 150,
        alignSelf: "stretch"
    },
    title: {
        flexDirection: "row",
        flex: 2,
        justifyContent: "center",
        paddingTop: 15
    },
    titleText: {
        fontSize: 40,
        fontFamily: "Montserrat",
        color: "white",
        paddingLeft: 10,
        textShadowColor: "black",
        textShadowRadius: 10
    },
    icon: {
        width: 50,
        height: 50
    },
    VEG: {
        backgroundColor: "#9477B4",
        height: 40,
        width: 100,
        borderRadius: 15,
        alignItems: "center",
        alignSelf: "center",
        marginBottom: 30
    },
    FRUIT: {
        backgroundColor: "#80C1E3",
        height: 40,
        width: 100,
        borderRadius: 15,
        alignItems: "center",
        alignSelf: "center",
        marginBottom: 30
    },
    HERB: {
        backgroundColor: "#81BF63",
        height: 40,
        width: 100,
        borderRadius: 15,
        alignItems: "center",
        alignSelf: "center",
        marginBottom: 30
    },
    plantType: {
        color: "white",
        fontSize: 30
    },
    description: {
        paddingTop: 10,
        paddingHorizontal: 10,
        textAlign: "justify",
        fontSize: 15
    },
    error: {
        color: "red",
        textAlign: "center",
        fontWeight: "bold"
    },
    plantPhotos: {
        flexDirection: "row",
        flex: 2,
        justifyContent: "center"
    },
    photo: {
        height: 180,
        width: 180,
        borderRadius: 20,
        borderColor: "white",
        borderWidth: 5,
        margin: 8
    },
    subtitle: {
        fontSize: 25,
        fontFamily: "Montserrat",
        color: "black",
        paddingLeft: 10,
        paddingTop: 15
    },
    button: {
        backgroundColor: "#9477B4",
        height: 35,
        width: 115,
        borderRadius: 8,
        alignItems: "center",
        alignSelf: "center",
        justifyContent: "center"
    },
    buttonText: {
        color: "white",
        fontSize: 18
    },
    monthInfographic: {
        marginTop: 5,
        flexDirection: "row",
        flex: 2
    },
    seasonalTitle: {
        fontSize: 15,
        paddingHorizontal: 10,
        width: 100
    },
    infographic: {
        paddingLeft: 10
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

export default PlantScreen;