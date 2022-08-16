import React from "react";
import { create } from "react-test-renderer";

import SearchBar from "../../../src/app/components/Plant/SearchBar";

describe("<SearchBar />", () => {

    it("allows the user input a search query", () => {

        let searchQuery = "test";
        let queryProps = [searchQuery, "setQuery"];

        let tree = create(<SearchBar queryData={queryProps} />);

        let actualResult = tree.root.findByProps({ testID: "searchbar" }).props.value;
        expect(actualResult).toEqual(searchQuery);
    });

});