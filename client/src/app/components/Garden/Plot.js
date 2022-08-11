import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

import ImageSelect from "../Plant/SearchableImages";

import ImageStyles from "../../styles/ImageStyles";

import GetPlantByID from "../../requests/Plant/GetPlantByID";

const Plot = (props) => {

    const [plantName, setPlantName] = useState(null);

    //Initialise parameters provided from garden grid
    let plot_number = props.plot.plot_number;
    let plot_number_display = plot_number + 1;
    let plant_id = props.plot.plant_id;

    useEffect(() => {
        if (plant_id !== null) {
            getPlantName();
        }
    }, []);

    //Function to get plant name for use in icon selection
    async function getPlantName() {
        setPlantName(await GetPlantByID(plant_id, "name"));
    }

    return (
        <View style={styles.plot}>

            <Text style={styles.plotLabel}>{plot_number_display}</Text>
            {
                plantName !== null ?
                    <Image
                        style={[ImageStyles.largeIcon, { alignSelf: "center" }]}
                        source={ImageSelect({ name: plantName })}
                    />
                    : null
            }

        </View>
    );
}

const styles = StyleSheet.create({
    plot: {
        width: wp("23%"),
        height: wp("23%"),
        backgroundColor: "#7D590C",
        margin: 1
    },
    plotLabel: {
        color: "white",
        fontSize: hp("2.5%"),
        marginTop: 2,
        marginLeft: 2
    }
});

export default Plot;