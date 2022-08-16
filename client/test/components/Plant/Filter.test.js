import React from "react";
import { act, create } from "react-test-renderer";

import Filter from "../../../src/app/components/Plant/Filter";

describe("<Filter />", () => {

    it("allows the user to select multiple values from the filter dropdown menu", async () => {

        const selected = ["Vegetable", "Sow"];
        const selectionProp = [selected, "setValue"];

        let expectedResult = selected;
        let tree;

        await act(async () => {
            tree = create(<Filter filterData={selectionProp} />);
        });

        const actualResult = tree.root.findByProps({ testID: "filter" }).props.value;
        expect(actualResult).toEqual(expectedResult);
    });

});