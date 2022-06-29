import React from 'react';
import { View, StyleSheet } from 'react-native';

import Header from '../components/Header';
import PlantList from "../components/PlantList";

const PlantListScreen = () => {
    return (
        <View style={styles.container}>
            <Header />
            <PlantList />
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

export default PlantListScreen;