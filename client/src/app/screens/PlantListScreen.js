import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';

import Header from '../components/Header';
import Filter from '../components/Filter';
import PlantList from "../components/PlantList";

const PlantListScreen = (props) => {

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
        <View style={styles.container}>
            <Header navigation={props.navigation} />
            <View style={styles.screen}>
                <Text style={styles.title}>Plants</Text>
                <SearchBar />
                <Filter />
                <PlantList navigation={props.navigation} />
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        marginBottom: 180
    },
    screen: {
        height: "100%",
        backgroundColor: "#EFF5E4",
        paddingTop: 5
    },
    title: {
        textAlign: "center",
        fontSize: 40,
        fontFamily: "Montserrat"
    }
});

export default PlantListScreen;