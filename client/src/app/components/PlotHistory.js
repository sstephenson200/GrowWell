import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
const moment = require("moment");
import axios from 'axios';

import ImageSelect from '../components/SearchableImages';

const PlotHistory = (props) => {

    const [plantName, setPlantName] = useState(null);

    let date = moment(props.plot_history.date_planted).format("MMM YYYY");
    let plant_id = props.plot_history.plant_id;

    const getPlant = async () => {
        try {
            const response = await axios.post("https://grow-well-server.herokuapp.com/plant/getPlantByID", {
                "plant_id": plant_id
            }, { responseType: 'json' });
            let plantName = await response.data.plant.name;
            setPlantName(plantName);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getPlant();
    }, [props]);

    return (
        <View style={styles.currentPlant}>

            <View style={styles.plantTitle}>
                <Image
                    style={styles.icon}
                    source={ImageSelect({ name: plantName })}
                />
                <Text style={styles.plantName}>{plantName}</Text>
            </View>

            <Text style={styles.date}>{date}</Text>

        </View>
    );
}

const styles = StyleSheet.create({
    currentPlant: {
        flexDirection: "row",
        flex: 2,
        marginVertical: 10
    },
    plantTitle: {
        flexDirection: "row",
        flex: 2,
        alignItems: "flex-start",
        marginLeft: 20
    },
    icon: {
        width: 30,
        height: 30
    },
    plantName: {
        fontSize: 20,
        paddingLeft: 7
    },
    date: {
        textAlign: "center",
        fontSize: 20,
        marginRight: 20
    }
});

export default PlotHistory;