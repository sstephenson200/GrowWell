import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
//import RNFetchBlob from 'react-native-fetch-blob';

import ImageSelect from "./SearchableImages";
import Infographic from './MonthlyPlantData';

// async function getImage(image_id) {
//     return {
//         uri: "http://192.168.1.110:8080/plant/getImageByID",
//         method: "POST",
//         body: {
//             "image_id": image_id
//         }
//     }
// }

const PlantList = () => {

    const [plants, setPlants] = useState([]);

    const getPlants = async () => {
        try {
            const response = await fetch("http://192.168.1.110:8080/plant/getAllPlants");
            const json = await response.json();
            setPlants(json.plants);
        } catch (error) {
            console.error(error);
        }
    }

    // const getImages = () => {

    //     plants.forEach((plant) => {
    //         RNFetchBlob.fetch(
    //             "POST",
    //             "http://192.168.1.110:8080/plant/getImageByID",
    //             {
    //                 body: { "image_id": plant.image[0] }
    //             })
    //             .then((response) => {
    //                 let base64String = response.base64();
    //                 let text = response.text();
    //                 let json = response.json();
    //             })
    //             .catch(error => {
    //                 console.log(error);
    //             })
    //     }
    //     )
    // }

    // const getImages = () => {

    //     //for (let i = 0; i < plants.length; i++) {
    //     const getData = async () => {
    //         fetch("http://192.168.1.110:8080/plant/getImageByID", {
    //             method: "POST",
    //             body: {
    //                 "image_id": plants[i].image[0]
    //             }
    //         })
    //             .then((response) => response.blob())
    //             .then((response) => {
    //                 setPlants.pictures(URL.createObjectURL(response));
    //             })
    //             .catch(error => {
    //                 console.log(error);
    //             });
    //     }
    // }

    // .then(response => response.blob()
    //     .then(blob => {
    //         let objectURL = URL.createObjectURL(blob);
    //         console.log(imageRef.current);
    //         imageRef.current.src = objectURL;
    //     }));

    //let image = URL.createObjectURL(await response.blob());
    //const json = await response.json();        
    //}
    // }

    // const getImages = () => {
    //     for (let i = 0; i < plants.length; i++) {

    //         let result = fetch("http://192.168.1.110:8080/plant/getImageByID", {
    //             method: "POST",
    //             body: { "image_id": plants.image[0] }
    //         })
    //             .then((result) => result.blob())

    //         console.log(result);
    //         console.log(result.blob());

    //     }
    // }

    useEffect(() => {
        getPlants();
    }, []);

    // getImages();

    return (

        <View style={styles.container}>
            <FlatList
                data={plants}
                contentContainerStyle={{
                    flexGrow: 1,
                }}
                renderItem={({ item }) => {

                    let name = item.name;
                    let image_id = item.image[0];
                    let plant_type = item.plant_type.toUpperCase();
                    if (plant_type == "VEGETABLE") {
                        plant_type = "VEG";
                    }

                    // let blob = fetch("http://192.168.1.110:8080/plant/getImageByID", {
                    //     method: "POST",
                    //     body: { "image_id": plants.image[0] }
                    // });

                    return (
                        <TouchableOpacity onPress={() => navigation.navigate("Plant", item)}>
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
                                        source={require("../assets/images/dog.jpg")}
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
        elevation: 1,
        marginHorizontal: 15,
        marginVertical: 8,
        backgroundColor: "#F2F8D0"
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
        flexDirection: "row",
        flex: 2
    },
    icon: {
        width: 40,
        height: 40
    },
    plantName: {
        fontSize: 20,
        paddingLeft: 10
    },
    image: {
        width: 135,
        height: 135,
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
        width: 50,
        borderRadius: 5,
        alignItems: "center"
    },
    plantType: {
        color: "white"
    }
});

export default PlantList;