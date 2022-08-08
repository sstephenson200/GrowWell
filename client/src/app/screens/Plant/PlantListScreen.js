import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';

import Header from '../../components/Header';
import SearchBar from '../../components/Plant/SearchBar';
import Filter from '../../components/Plant/Filter';
import PlantList from "../../components/Plant/PlantList";

const PlantListScreen = (props) => {

    const [query, setQuery] = useState('');
    const [filterOptions, setFilterOptions] = useState([]);

    return (
        <View style={styles.container}>
            <Header navigation={props.navigation} />
            <View style={styles.screen}>
                <Text style={styles.title}>Plants</Text>
                <SearchBar queryData={[query, setQuery]} />
                <Filter filterData={[filterOptions, setFilterOptions]} />
                <PlantList navigation={props.navigation} searchQuery={query} filterData={filterOptions} />
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        marginBottom: 170
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