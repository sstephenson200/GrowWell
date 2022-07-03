import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';

import Filter from '../components/Filter';
import PlantList from "../components/PlantList";

const PlantListScreen = () => {

    const [loaded] = useFonts({
        Montserrat: require('../assets/fonts/Montserrat-Medium.ttf')
    });

    if (!loaded) {
        return null;
    }

    const SearchBar = () => {
        return <Text>This is a search bar!</Text>
    }

    return (
        <View style={styles.screen}>
            <Text style={styles.title}>Plants</Text>
            <SearchBar />
            <Filter />
            <PlantList />
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        height: "100%",
        backgroundColor: "#EFF5E4",
        paddingTop: 5,
        paddingBottom: 85
    },
    title: {
        textAlign: "center",
        fontSize: 40,
        fontFamily: "Montserrat"
    }
});

export default PlantListScreen;