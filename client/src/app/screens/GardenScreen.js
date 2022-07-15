import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useFonts } from 'expo-font';
import axios from 'axios';
import { unescape } from 'underscore';

import Header from '../components/Header';
import Dropdown from "../components/Dropdown";
import GardenGrid from '../components/GardenGrid';

const GardenScreen = (props) => {

    const [gardens, setGardens] = useState([]);
    const [selectedGarden, setSelectedGarden] = useState(null);

    async function getGardens() {
        try {
            const response = await axios.post("https://grow-well-server.herokuapp.com/garden/getAllGardens", {
                "user_id": "62cec6b63dd3dfcf2a4a6185"
            }, { responseType: 'json' });

            let status = response.status;

            if (status == 200) {
                let userGardens = response.data.gardens;
                let gardenLabels = [];

                if (userGardens !== null) {
                    userGardens.forEach((garden) => {
                        let name = garden.name;
                        name = unescape(name);
                        let garden_id = garden._id;
                        let entry = { label: name, value: garden_id };
                        gardenLabels.push(entry);
                    });
                }
                setGardens(gardenLabels);
            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getGardens();
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
            <ScrollView style={styles.screen} contentContainerStyle={{ flexGrow: 1 }}>

                <Text style={styles.title}>Your Garden</Text>

                <Dropdown gardens={gardens} selected={[selectedGarden, setSelectedGarden]} placeholder="Select Garden" styling="largeDropdown" />

                <TouchableOpacity style={styles.button} onPress={() => props.navigation.navigate("StackNavigator", { screen: "CreateGarden" })}>
                    <Text style={styles.buttonText}>ADD NEW GARDEN</Text>
                </TouchableOpacity>

                {
                    selectedGarden !== null ?

                        <View style={styles.grid}>
                            <ScrollView horizontal={true}>
                                <GardenGrid garden_id={selectedGarden} navigation={props.navigation}></GardenGrid>
                            </ScrollView>

                            <View>
                                <TouchableOpacity style={styles.deleteButton} onPress={() => alert("Ready to delete garden!")}>
                                    <Text style={styles.buttonText}>DELETE GARDEN</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        : <Text style={styles.text}>Garden not selected</Text>
                }

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
        marginTop: 10
    },
    title: {
        textAlign: "center",
        fontSize: 40,
        fontFamily: "Montserrat"
    },
    button: {
        backgroundColor: "#9477B4",
        height: 40,
        width: 200,
        borderRadius: 8,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        margin: 10
    },
    buttonText: {
        color: "white",
        fontSize: 18
    },
    grid: {
        alignItems: "center",
        marginBottom: 85
    },
    deleteButton: {
        backgroundColor: "red",
        height: 40,
        width: 200,
        borderRadius: 8,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        margin: 15
    },
    text: {
        textAlign: "center",
        fontSize: 20
    }
});

export default GardenScreen;