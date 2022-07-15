import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import axios from "axios";

import Plot from "./Plot";

const GardenGrid = (props) => {

    const [garden, setGarden] = useState(null);

    let garden_id = props.garden_id;

    //Get garden data
    async function getGardenData(garden_id) {
        try {
            const response = await axios.post("https://grow-well-server.herokuapp.com/garden/getGardenByID", {
                "garden_id": garden_id
            }, { responseType: 'json' });

            let status = response.status;

            if (status == 200) {
                let garden = response.data.garden;
                setGarden(garden);
            }

        } catch (error) {
            console.log(error);
        }
    }

    //Update garden data when garden_id changes
    useEffect(() => {
        getGardenData(garden_id)
    }, [garden_id]);

    //Generate plot grid
    const PlotGrid = () => {

        let width = garden.size[1];

        return (
            <FlatList
                data={garden.plot}
                numColumns={width}
                renderItem={({ item }) => {

                    return (
                        <View>
                            <TouchableOpacity onPress={() => props.navigation.navigate("StackNavigator", { screen: "Plot", params: { plot: item } })}>
                                <Plot plot={item} />
                            </TouchableOpacity>
                        </View >
                    );
                }}
            />
        );
    }

    return (
        <View>
            {
                garden !== null ?
                    <View style={styles.grid}>
                        <PlotGrid />
                    </View>
                    : null
            }
        </View>
    );
}

const styles = StyleSheet.create({
    grid: {
        paddingHorizontal: 10,
        alignItems: "center",
        paddingVertical: 10
    },
    plot: {
        width: 80,
        height: 80,
        backgroundColor: "#9B711A",
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
        height: 50
    }
});


export default GardenGrid;