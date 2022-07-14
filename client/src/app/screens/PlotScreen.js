import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

import Header from '../components/Header';

const PlotScreen = (props) => {

    let plant_id = props.route.params.plot.plant_id;

    return (
        <View style={styles.container}>
            <Header navigation={props.navigation} />
            <View style={styles.screen}>
                <Text>Plot Screen</Text>
                {
                    plant_id !== null ?
                        <Text>{plant_id}</Text>
                        : <Text>Empty!</Text>
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between"
    },
    screen: {
        height: "100%",
        backgroundColor: "#EFF5E4"
    }
});

export default PlotScreen;