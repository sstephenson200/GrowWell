import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';

import ImageSelect from "./SearchableImages";
import Infographic from "./MonthlyPlantData"

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

const PlantList = (props) => {

    const [plants, setPlants] = useState([]);
    let searchQuery = props.searchQuery;
    let filterData = props.filterData;

    const getAllPlantData = async () => {
        let plantData = await getPlants();
        getImages(plantData);
    }

    //Get all plant data
    const getPlants = async () => {
        try {
            const response = await fetch("https://grow-well-server.herokuapp.com/plant/getAllPlants");
            const json = await response.json();
            let sortedPlants = json.plants.sort(sortPlants("name"));

            setPlants(sortedPlants);

            return (sortedPlants);
        } catch (error) {
            console.error(error);
        }
    }

    //Get corresponding plant images
    const getImages = async (plantData) => {
        if (plantData.length <= 0) {
            return;
        }

        let updatedPlantData = [];

        let fileReaderInstance = new FileReader();

        for (let i = 0; i < plantData.length; i++) {
            let blob = await axios.post("https://grow-well-server.herokuapp.com/plant/getImageByID", {
                image_id: plantData[i].image[0]
            }, { responseType: 'blob' });
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

    useEffect(() => {
        getAllPlantData();
    }, []);

    //Function to check if a plant should be shown in search results based on a comparison of plant name and search query
    function showPlantInResults(plant, searchQuery, filterData) {
        let show = true;
        let plantTypes = [];

        if (searchQuery !== '') {
            if (!plant.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }
        }

        if (filterData.length !== 0) {

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

                    return (

                        <TouchableOpacity onPress={() => props.navigation.navigate("StackNavigator", { screen: "Plant", params: { plant_id: item._id, name: item.name, plant_type: item.plant_type, photo: item.photo } })}>
                            <Card>

                                <View style={styles.plantData}>

                                    <View style={styles.cardHeader}>
                                        <Image
                                            style={styles.icon}
                                            source={ImageSelect({ name })}
                                        />
                                        <Text style={styles.plantName}>{item.name}</Text>
                                    </View>

                                    <View style={styles.graphics}>
                                        <Infographic.PlantListInfographic sow={item.sow_date} plant={item.plant_date} />

                                        <View style={styles[plant_type]}>
                                            <Text style={styles.plantType}>{plant_type}</Text>
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
                                                source={require("../assets/images/placeholder.png")}
                                            />
                                    }
                                </View>

                            </Card>
                        </TouchableOpacity>

                    )
                }}
            />
        </View >
    );
}

function Card(props) {
    return (
        <View style={styles.card}>
            <View style={styles.cardContent}>
                {props.children}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        flex: 1
    },
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
        marginVertical: 20,
        flexDirection: "row",
        flex: 2
    },
    plantData: {
        flexDirection: "column",
        flex: 2
    },
    cardHeader: {
        flexDirection: "row",
        flex: 2
    },
    graphics: {
        justifyContent: "center",
        alignItems: "center"
    },
    icon: {
        width: 40,
        height: 40
    },
    plantName: {
        fontSize: 25,
        paddingLeft: 7,
        fontWeight: "bold"
    },
    image: {
        width: 125,
        height: 125,
        borderRadius: 20
    },
    VEG: {
        backgroundColor: "#9477B4",
        height: 25,
        width: 50,
        borderRadius: 5,
        alignItems: "center"
    },
    FRUIT: {
        backgroundColor: "#80C1E3",
        height: 25,
        width: 50,
        borderRadius: 5,
        alignItems: "center"
    },
    HERB: {
        backgroundColor: "#81BF63",
        height: 25,
        width: 60,
        borderRadius: 5,
        alignItems: "center"
    },
    plantType: {
        color: "white",
        fontSize: 15
    }
});

export default PlantList;