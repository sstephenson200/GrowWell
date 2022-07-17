import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import axios from "axios";

import ImageSelect from "../components/SearchableImages";

const Plot = (props) => {

    const [plantName, setPlantName] = useState(null);

    let plot_number = props.plot.plot_number;
    let plot_number_display = plot_number + 1;
    let plant_id = props.plot.plant_id;

    // Get plant name for use in icon selection
    async function getPlantName() {
        try {
            const response = await axios.post("https://grow-well-server.herokuapp.com/plant/getPlantByID", {
                "plant_id": plant_id
            }, { responseType: 'json' });

            let status = response.status;

            if (status == 200) {
                setPlantName(response.data.plant.name);
            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (plant_id !== null) {
            getPlantName();
        }
    }, []);


    return (
        <View style={styles.plot}>

            <Text style={styles.plotLabel}>{plot_number_display}</Text>
            {
                plantName !== null ?
                    <Image
                        style={styles.icon}
                        source={ImageSelect({ name: plantName })}
                    />
                    : null
            }

        </View>
    );
}

const styles = StyleSheet.create({
    plot: {
        width: 80,
        height: 80,
        backgroundColor: "#7D590C",
        margin: 1
    },
    plotLabel: {
        color: "white",
        fontSize: 15,
        marginTop: 2,
        marginLeft: 2
    },
    icon: {
        width: 50,
        height: 50,
        alignSelf: "center",
        justifyContent: "center"
    }
});

export default Plot;