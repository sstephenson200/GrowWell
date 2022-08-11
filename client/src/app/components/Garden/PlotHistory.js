import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
const moment = require("moment");

import ImageSelect from "../Plant/SearchableImages";

import ContainerStyles from "../../styles/ContainerStyles";
import ImageStyles from "../../styles/ImageStyles";

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
        <View style={[ContainerStyles.dualColumn, { marginVertical: 10 }]}>

            <View style={[ContainerStyles.dualColumn, styles.plantTitle]}>
                <Image
                    style={ImageStyles.icon}
                    source={ImageSelect({ name: plantName })}
                />
                <Text style={styles.plantName}>{plantName}</Text>
            </View>

            <Text style={styles.date}>{date}</Text>

        </View>
    );
}

const styles = StyleSheet.create({
    plantTitle: {
        alignItems: "flex-start",
        marginLeft: 20
    },
    plantName: {
        fontSize: hp("3%"),
        paddingLeft: 7
    },
    date: {
        textAlign: "center",
        fontSize: hp("3%"),
        marginRight: 20
    }
});

export default PlotHistory;