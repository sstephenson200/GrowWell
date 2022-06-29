import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';

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
                renderItem={({ item }) => <Text>{item.name}</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        flex: 1
    }
});

export default PlantList;