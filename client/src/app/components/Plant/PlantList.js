import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import axios from "axios";

import ImageSelect from "./SearchableImages";
import Infographic from "./MonthlyPlantData";

import CardStyles from "../../styles/CardStyles";
import ContainerStyles from "../../styles/ContainerStyles";
import ImageStyles from "../../styles/ImageStyles";

import GetAllPlants from "../../requests/Plant/GetAllPlants";

const PlantList = (props) => {

    const [plants, setPlants] = useState([]);

    //Initialise data from plant list screen
    let searchQuery = props.searchQuery;
    let filterData = props.filterData;

    useEffect(() => {
        getAllPlantData();
    }, []);

    //Function to gather plant and image data without triggering undefined errors
    async function getAllPlantData() {
        let plantData = await getPlants();
        getImages(plantData);
    }

    //Function to get all plants to fill list cards
    async function getPlants() {
        let plantList = (await GetAllPlants());
        setPlants(plantList);
        return (plantList);
    }

    //Function to convert first plant image to base64 format for rendering
    async function getImages(plantData) {
        if (plantData.length <= 0) {
            return;
        }

        let updatedPlantData = [];

        let fileReaderInstance = new FileReader();

        for (let i = 0; i < plantData.length; i++) {
            let blob = await axios.post("/plant/getImageByID", {
                image_id: plantData[i].image[0]
            }, { responseType: "blob" });
            let base64Image = null;
            fileReaderInstance.readAsDataURL(blob.data);
            fileReaderInstance.onload = async () => {
                base64Image = fileReaderInstance.result;
                plantData[i].photo = base64Image;
                updatedPlantData.push(plantData[i]);
            }
        }

        fileReaderInstance.onloadend = () => {
            if (updatedPlantData.length === plantData.length) {
                setPlants(plantData);
            }
        }
    }

    //Function to remove plant card from render if plant data is incompatible with search and filter queries
    function showPlantInResults(plant, searchQuery, filterData) {
        let show = true;
        let plantTypes = [];

        if (searchQuery !== "") {
            if (!plant.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }
        }

        if (filterData.length !== 0) {

            //Allow selection of multiple plant types in filter query
            for (let i = 0; i < filterData.length; i++) {
                if (filterData[i] == "Fruit" || filterData[i] == "Herb" || filterData[i] == "Vegetable") {
                    plantTypes.push(filterData[i]);
                }
            }

            for (let i = 0; i < filterData.length; i++) {
                switch (filterData[i]) {
                    case "Fruit":
                    case "Herb":
                    case "Vegetable":
                        if (!plantTypes.includes(plant.plant_type)) {
                            return false;
                        }
                        break;
                    //Check if current date is in selected schedule period
                    case "Sow":
                        show = Infographic.MonthFilter(plant.sow_date);
                        break;
                    case "Plant":
                        show = Infographic.MonthFilter(plant.plant_date);
                        break;
                    case "Transplant":
                        show = Infographic.MonthFilter(plant.transplant_date);
                        break;
                    case "Harvest":
                        show = Infographic.MonthFilter(plant.harvest_date);
                        break;
                    default:
                }

                if (show == false) {
                    return false;
                }
            }
        }
        return show;
    }

    //Function to render and give style to list cards
    function Card(props) {
        return (
            <View style={CardStyles.card}>
                <View style={[CardStyles.cardContent, ContainerStyles.dualColumn]}>
                    {props.children}
                </View>
            </View>
        );
    }

    return (

        <View style={styles.container}>

            <FlatList
                data={plants}
                contentContainerStyle={{
                    flexGrow: 1,
                }}
                renderItem={({ item }) => {

                    let name = item.name;
                    let plant_type = item.plant_type.toUpperCase();
                    if (plant_type == "VEGETABLE") {
                        plant_type = "VEG";
                    }

                    //Hide items which don't match search criteria
                    if (showPlantInResults(item, searchQuery, filterData) == false) {
                        return null;
                    }

                    //Render list card
                    return (

                        <TouchableOpacity testID={`card${item.name}`} onPress={() => props.navigation.navigate("StackNavigator", { screen: "Plant", params: { plant_id: item._id, name: item.name, plant_type: item.plant_type, photo: item.photo } })}>
                            <Card>

                                <View style={ContainerStyles.dualRow}>

                                    <View style={ContainerStyles.dualColumn}>
                                        <Image
                                            style={ImageStyles.largeIcon}
                                            source={ImageSelect({ name })}
                                        />
                                        <Text style={styles.plantName}>{item.name}</Text>
                                    </View>

                                    <View style={ContainerStyles.centered}>
                                        <Infographic.PlantListInfographic sow={item.sow_date} plant={item.plant_date} />

                                        <View style={[styles.plantType, ContainerStyles[plant_type]]}>
                                            <Text style={styles.plantTypeText}>{plant_type}</Text>
                                        </View>
                                    </View>

                                </View>

                                <View>
                                    {
                                        item.photo !== undefined ?
                                            <Image
                                                style={styles.image}
                                                source={{ uri: item.photo }}
                                            />
                                            :
                                            <Image
                                                style={styles.image}
                                                source={require("../../assets/images/placeholder.png")}
                                            />
                                    }
                                </View>

                            </Card>
                        </TouchableOpacity>

                    );
                }}
            />
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        flex: 1
    },
    plantName: {
        fontSize: wp("6.5%"),
        paddingLeft: 7,
        fontWeight: "bold"
    },
    image: {
        width: wp("32%"),
        height: wp("32%"),
        borderRadius: 20
    },
    plantType: {
        height: hp("4%"),
        width: wp("25%"),
        borderRadius: 5,
        alignItems: "center"
    },
    plantTypeText: {
        color: "white",
        fontSize: hp("2.5%")
    }
});

export default PlantList;