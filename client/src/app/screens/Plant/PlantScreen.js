import React, { useState, useEffect } from "react";
import { Text, View, SafeAreaView, ScrollView, Image, ImageBackground, TouchableOpacity, StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import axios from "axios";

import Header from "../../components/Header";
import ImageSelect from "../../components/Plant/SearchableImages";
import Dropdown from "../../components/Dropdown";
import CareRequirementsTable from "../../components/Plant/CareRequirementsTable";
import Infographic from "../../components/Plant/MonthlyPlantData";
import NoteCard from "../../components/Note/NoteCard";

import ContainerStyles from "../../styles/ContainerStyles";
import ImageStyles from "../../styles/ImageStyles";
import FontStyles from "../../styles/FontStyles";
import ButtonStyles from "../../styles/ButtonStyles";

import GetPlantByID from "../../requests/Plant/GetPlantByID";
import GetAllGardens from "../../requests/Garden/GetAllGardens";
import UpdatePlotPlant from "../../requests/Garden/UpdatePlotPlant";

const PlantScreen = (props) => {

    //Set parameters passed in from Plant List for faster rendering
    let plant_id = props.route.params.plant_id;
    let name = props.route.params.name;
    let plant_type = props.route.params.plant_type == "Vegetable" ? "VEG" : String(props.route.params.plant_type).toUpperCase();
    let photo1 = props.route.params.photo;

    const [plant, setPlant] = useState([]);
    const [notes, setNotes] = useState([]);
    const [plots, setPlots] = useState([]);
    const [photo2, setPhoto2] = useState(null);
    const [photo3, setPhoto3] = useState(null);
    const [selectedPlot, setSelectedPlot] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        getPlantData();
    }, []);

    //Function to reset state when leaving the page
    function clearState() {
        setErrorMessage("");
        setSelectedPlot(null);
    }

    //Function to get page data without triggering undefined errors
    async function getPlantData() {
        let plantData = await getPlant();
        getNotes();
        getPlots();
        getImages(plantData);
    }

    //Function to get plant data
    async function getPlant() {
        let plantData = await GetPlantByID(plant_id, "all");
        setPlant(plantData);
        return plantData;
    }

    //Function to convert plant images to base64 format for rendering
    async function getImages(plantData) {
        if (plantData.image.length <= 0) {
            return;
        }

        let updatedPlantData = [];
        let plantPhotos = [];

        let fileReaderInstance = new FileReader();

        for (let i = 0; i < plantData.image.length; i++) {

            let id = plantData.image[i];
            let blob = await axios.post("/plant/getImageByID", {
                image_id: id
            }, { responseType: "blob" });
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
                setPhoto2(plantData.photo[1]);
                setPhoto3(plantData.photo[2]);
                setPlant(plantData);
            }
        }
    }

    //Call GetAllGardens to fill plot selection dropdown with unfilled plots
    async function getPlots() {
        setPlots(await GetAllGardens("unfilledPlots"));
    }

    //Function to get notes by plant_id
    async function getNotes() {

        try {
            const response = await axios.post("/note/getNotesByPlant", {
                "plant_id": plant_id
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
            console.log(error);
        }
    }

    //Function to add or remove plant from a given plot
    async function addPlantToPlot() {

        if (selectedPlot !== null) {

            let gardenData = selectedPlot.split(":");
            let garden_id = gardenData[0];
            let plot_number = gardenData[1];

            let response = (await UpdatePlotPlant(plant_id, plot_number, garden_id));

            if (response.data.errorMessage !== undefined) {
                setErrorMessage(response.data.errorMessage);
            } else {
                clearState();
                props.navigation.navigate("Garden");
            }
        }
    }

    return (

        <SafeAreaView style={ContainerStyles.containerScroll}>

            <Header navigation={props.navigation} />

            <ScrollView style={[ContainerStyles.screen, { paddingTop: 0 }]} contentContainerStyle={{ flexGrow: 1 }}>

                <ImageBackground
                    style={styles.backgroundImage}
                    source={{ uri: photo1 }}
                    imageStyle={{ opacity: 0.6 }}
                >
                    <View style={styles.title}>
                        <Image
                            style={ImageStyles.largeIcon}
                            source={ImageSelect({ name })}
                        />
                        <Text style={styles.titleText}>{name}</Text>
                    </View>

                    <View style={[styles.plantType, ContainerStyles[plant_type]]}>
                        <Text style={styles.plantTypeText}>{plant_type}</Text>
                    </View>

                </ImageBackground>

                <Text style={styles.description}>{plant.description}</Text>

                {
                    plant.photo !== undefined && plant.photo[1] !== null && plant.photo[2] !== null ?
                        <View style={[ContainerStyles.dualColumn, ContainerStyles.centered]}>
                            <Image
                                style={styles.photo}
                                source={{ uri: photo2 }}
                            />
                            <Image
                                style={styles.photo}
                                source={{ uri: photo3 }}
                            />
                        </View>
                        :
                        <View style={[ContainerStyles.dualColumn, ContainerStyles.centered]}>
                            <Image
                                style={styles.photo}
                                source={require("../../assets/images/placeholder.png")}
                            />
                            <Image
                                style={styles.photo}
                                source={require("../../assets/images/placeholder.png")}
                            />
                        </View>
                }

                <Text style={FontStyles.subtitleStyled}>Add To Garden</Text>

                {
                    errorMessage !== "" ?
                        <Text style={FontStyles.errorMessage}>{errorMessage}</Text>
                        : null
                }

                <Dropdown plots={plots} selected={[selectedPlot, setSelectedPlot]} placeholder="Select Plot" />

                <TouchableOpacity style={ButtonStyles.largeButton} onPress={() => addPlantToPlot()}>
                    <Text style={ButtonStyles.buttonText}>ADD PLANT</Text>
                </TouchableOpacity>

                <View style={{ paddingVertical: 10 }}>

                    <Text style={FontStyles.subtitleStyled}>Seasonal Data</Text>

                    <Infographic.InfographicLabels plantPage={true} />

                    {
                        plant.sow_date !== undefined && plant.sow_date.length !== 0 ?

                            <View style={ContainerStyles.dualColumn}>
                                <Text style={styles.seasonalTitle}>Sow</Text>
                                <Infographic.GeneralInfographic style={styles.infographic} schedule={plant.sow_date} plantPage={true} />
                            </View>

                            : null
                    }

                    {
                        plant.plant_date !== undefined && plant.plant_date.length !== 0 ?

                            <View style={ContainerStyles.dualColumn}>
                                <Text style={styles.seasonalTitle}>Plant</Text>
                                <Infographic.GeneralInfographic style={styles.infographic} schedule={plant.plant_date} plantPage={true} />
                            </View>

                            : null
                    }

                    {
                        plant.transplant_date !== undefined && plant.transplant_date.length !== 0 ?

                            <View style={ContainerStyles.dualColumn}>
                                <Text style={styles.seasonalTitle}>Transplant</Text>
                                <Infographic.GeneralInfographic style={styles.infographic} schedule={plant.transplant_date} plantPage={true} />
                            </View>

                            : null
                    }

                    {
                        plant.harvest_date !== undefined && plant.harvest_date.length !== 0 ?

                            <View style={ContainerStyles.dualColumn}>
                                <Text style={styles.seasonalTitle}>Harvest</Text>
                                <Infographic.GeneralInfographic style={styles.infographic} schedule={plant.harvest_date} plantPage={true} />
                            </View>

                            : null
                    }

                </View>

                <Text style={FontStyles.subtitleStyled}>Care Requirements</Text>

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
                            <Text style={FontStyles.subtitleStyled}>{plant.name} Notes</Text>

                            <View style={{ paddingVertical: 10 }}>
                                {notes}
                            </View>

                        </View>
                        : null
                }

            </ScrollView >

        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        height: hp("25%"),
        alignSelf: "stretch"
    },
    title: {
        flexDirection: "row",
        flex: 2,
        justifyContent: "center",
        paddingTop: 15
    },
    titleText: {
        fontSize: hp("6%"),
        fontFamily: "Montserrat",
        color: "white",
        paddingLeft: 10,
        textShadowColor: "black",
        textShadowRadius: 10
    },
    plantType: {
        height: hp("5%"),
        width: wp("25%"),
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        marginBottom: 30
    },
    plantTypeText: {
        color: "white",
        fontSize: hp("3%")
    },
    description: {
        paddingTop: 10,
        paddingHorizontal: 10,
        textAlign: "justify",
        fontSize: hp("2%")
    },
    photo: {
        height: wp("45%"),
        width: wp("45%"),
        borderRadius: 20,
        borderColor: "white",
        borderWidth: 5,
        margin: 8
    },
    seasonalTitle: {
        fontSize: hp("2%"),
        paddingHorizontal: 10,
        width: wp("25%"),
    },
    infographic: {
        paddingLeft: 10
    }
});

export default PlantScreen;