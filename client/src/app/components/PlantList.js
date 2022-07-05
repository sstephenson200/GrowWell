import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';

import ImageSelect from "./SearchableImages";
import Infographic from './MonthlyPlantData';

//Method to sort plants array by name
function sortPlants(prop) {
    return function (a, b) {
        if (a[prop] > b[prop]) {
            return 1;
        } else if (a[prop] < b[prop]) {
            return -1;
        }
        return 0;
    }
}

const PlantList = (props) => {

    const [plants, setPlants] = useState([]);

    const getAllPlantData = async () => {
        let plantData = await getPlants();
        await getImages(plantData);
    }

    //Get all plant data
    const getPlants = async () => {
        try {
            const response = await fetch("http://192.168.1.110:8080/plant/getAllPlants");
            const json = await response.json();
            let sortedPlants = json.plants.sort(sortPlants("name"));

            return sortedPlants;
        } catch (error) {
            console.error(error);
        }
    }

    //Get corresponding plant images
    const getImages = async (plantData) => {
        if (plantData.length <= 0)
            return;

        let updatedPlantData = [];

        let fileReaderInstance = new FileReader();

        for (let i = 0; i < plantData.length; i++) {
            let blob = await axios.post("http://192.168.1.110:8080/plant/getImageByID", {
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

                    return (
                        <TouchableOpacity onPress={() => props.navigation.navigate("Plant", { plant_id: item._id })}>
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
                                        <Infographic sow={item.sow_date} plant={item.plant_date} />

                                        <View style={styles[plant_type]}>
                                            <Text style={styles.plantType}>{plant_type}</Text>
                                        </View>
                                    </View>

                                </View>

                                <View>
                                    <Image
                                        style={styles.image}
                                        source={{ uri: item.photo }}
                                    />
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