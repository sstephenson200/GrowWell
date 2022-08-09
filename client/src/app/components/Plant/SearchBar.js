import React from "react";
import { StyleSheet } from "react-native";
import { Searchbar } from "react-native-paper";

const SearchBar = (props) => {

    //Initialise search query state for use in plant list screen
    let query = props.queryData[0];
    let setQuery = props.queryData[1];

    //Function to update search query based on user input
    function onChange(entry) {
        setQuery(entry);
    }

    return (
        <Searchbar
            style={styles.searchBar}
            placeholder="Search"
            onChangeText={onChange}
            value={query}
        />
    );
}

const styles = StyleSheet.create({
    searchBar: {
        width: "90%",
        alignSelf: "center",
        marginTop: 10,
        borderRadius: 15,
        elevation: 5
    }
});

export default SearchBar;