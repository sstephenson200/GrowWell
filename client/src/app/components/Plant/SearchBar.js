import React from "react";
import { Searchbar } from "react-native-paper";

import InputStyles from "../../styles/InputStyles";

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
            testID="searchbar"
            style={InputStyles.userSelect}
            placeholder="Search"
            onChangeText={onChange}
            value={query}
        />
    );
}

export default SearchBar;