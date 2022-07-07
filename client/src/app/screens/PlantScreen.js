import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, Image, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import axios from 'axios';

import ImageSelect from "../components/SearchableImages";
import Dropdown from "../components/Dropdown";
import CareRequirementsTable from '../components/CareRequirementsTable';
import Infographic from '../components/MonthlyPlantData';

const PlantScreen = (props) => {

    let plant_id = props.route.params.plant_id;
    let name = null;
    let plant_type = null;
    let photo1 = null;
    let photo2 = null;
    let photo3 = null;

    const plots = [{ label: "Plot 1", value: 1 }, { label: "Plot 2", value: 2 }, { label: "Plot 1", value: 3 }];

    const [plant, setPlant] = useState([]);

    const getPlantData = async () => {
        let plantData = await getPlant();
        await getImages(plantData);
    }

    //Get plant data
    const getPlant = async () => {
        try {
            const response = await axios.post("http://192.168.1.110:8080/plant/getPlantByID", {
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
            let blob = await axios.post("http://192.168.1.110:8080/plant/getImageByID", {
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

            <Dropdown plots={plots} placeholder="Select Plot" />

            <TouchableOpacity style={styles.button} onPress={() => alert("Ready to add plant to garden.")}>
                <Text style={styles.buttonText}>ADD PLANT</Text>
            </TouchableOpacity>

            <Text style={styles.subtitle}>Care Requirements</Text>

            <CareRequirementsTable
                sun_condition={plant.sun_condition}
                soil_type={plant.soil_type}
                soil_ph={plant.soil_ph}
                plant_problem={plant.plant_problem}
                companion_plant={plant.companion_plant}
                incompatible_plant={plant.incompatible_plant}
            />

        </ScrollView >
    )
}

const styles = StyleSheet.create({
    screen: {
        height: "100%",
        backgroundColor: "#EFF5E4"
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
    }
});

export default PlantScreen;