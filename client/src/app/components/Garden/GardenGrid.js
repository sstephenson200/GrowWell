import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, TouchableOpacity } from "react-native";

import Plot from "./Plot";

import GetGardenByID from "../../requests/Garden/GetGardenByID";

const GardenGrid = (props) => {

    const [garden, setGarden] = useState(null);

    let garden_id = props.garden_id;
    let updated = null;
    if (props.updated !== undefined) {
        updated = props.updated;
    }

    useEffect(() => {
        //Trigger refresh when a garden is selected
        getGardenData(garden_id);

        //Trigger refresh when a garden or plot is added, removed or updated
        if (updated !== null) {
            updated = null;
        }

    }, [garden_id, updated]);

    //Function to get garden data
    async function getGardenData() {
        setGarden(await GetGardenByID(garden_id, "all"));
    }

    //Function used to generate a plot grid for garden displays
    function PlotGrid() {
        let width = garden.size[1];

        return (
            <FlatList
                data={garden.plot}
                numColumns={width}
                renderItem={({ item }) => {

                    return (
                        <View>
                            <TouchableOpacity onPress={() => props.navigation.navigate("StackNavigator", { screen: "Plot", params: { plot: item, garden: garden } })}>
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