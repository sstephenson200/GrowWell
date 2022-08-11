import React, { useState } from "react";
import { Text, View, SafeAreaView } from "react-native";

import Header from "../../components/Header";
import SearchBar from "../../components/Plant/SearchBar";
import Filter from "../../components/Plant/Filter";
import PlantList from "../../components/Plant/PlantList";

import ContainerStyles from "../../styles/ContainerStyles";
import FontStyles from "../../styles/FontStyles";

const PlantListScreen = (props) => {

    const [query, setQuery] = useState("");
    const [filterOptions, setFilterOptions] = useState([]);

    return (
        <SafeAreaView style={ContainerStyles.container}>
            <Header navigation={props.navigation} />
            <View style={ContainerStyles.screen}>
                <Text style={FontStyles.pageTitle}>Plants</Text>
                <SearchBar queryData={[query, setQuery]} />
                <Filter filterData={[filterOptions, setFilterOptions]} />
                <PlantList navigation={props.navigation} searchQuery={query} filterData={filterOptions} />
            </View>
        </SafeAreaView>
    );
}

export default PlantListScreen;