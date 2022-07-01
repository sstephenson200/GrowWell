import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';

import ImageSelect from "./SearchableImages";

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

    useEffect(() => {
        getPlants();
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

                    return (
                        <TouchableOpacity onPress={() => navigation.navigate("Plant", item)}>
                            <Card>
                                <View style={styles.cardHeader}>
                                    <Image
                                        style={styles.icon}
                                        source={ImageSelect({ name })}
                                    />
                                    <Text style={styles.plantName}>{item.name}</Text>
                                </View>
                                <View>
                                    <Image
                                        style={styles.image}
                                        source={{ uri: "" }}
                                    />
                                </View>
                            </Card>
                        </TouchableOpacity>

                    )
                }}
            />
        </View>
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
        borderRadius: 2,
        elevation: 1,
        marginHorizontal: 15,
        marginVertical: 8
    },
    cardContent: {
        marginHorizontal: 18,
        marginVertical: 20,
        flex: 2
    },
    cardHeader: {
        flexDirection: "row",
        flex: 2,
        alignItems: "center"
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
        width: 60,
        height: 60
    }
});

export default PlantList;