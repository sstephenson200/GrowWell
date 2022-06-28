import React, { useState, useEffect } from 'react';
import { Text, View, ActivityIndicator, FlatList } from 'react-native';

const PlantList = () => {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    const getPlants = async () => {
        try {
            const response = await fetch("http://192.168.1.110:8080/plant/getAllPlants");
            const json = await response.json();
            setData(json.plants);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getPlants();
    }, []);

    return (
        <View>
            {isLoading ? <ActivityIndicator /> : (
                <FlatList
                    data={data}
                    renderItem={({ item }) => <Text>{item.name}</Text>}
                />
            )}
        </View>
    )
}

export default PlantList;