import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
const moment = require("moment");

import ImageSelect from "../Plant/SearchableImages";

import GetPlantByID from "../../requests/Plant/GetPlantByID";

const PlotHistory = (props) => {

    const [plantName, setPlantName] = useState(null);

    //Initialise parameters provided from plot screen
    let date = moment(props.plot_history.date_planted).format("MMM YYYY");
    let plant_id = props.plot_history.plant_id;

    useEffect(() => {
        getPlant();
    }, [props]);

    //Function to get plant name for use in title and icon selection
    async function getPlant() {
        setPlantName(await GetPlantByID(plant_id, "name"));
    }

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