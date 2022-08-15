import React from "react";
import { act, create } from "react-test-renderer";

import Dropdown from "../../src/app/components/Dropdown";

describe("<Dropdown />", () => {

    it("sets dropdown items from provided props data", async () => {

        const data = [{ label: "Label 1", value: "value1" }, { label: "Label 2", value: "value2" }, { label: "Label 3", value: "value3" }];

        let expectedResult = data;
        let tree;

        await act(async () => {
            tree = create(<Dropdown plots={data} />);
        });

        const actualResult = tree.root.findByProps({ testID: "dropdown" }).props.items;
        expect(actualResult).toEqual(expectedResult);
    });

    it("allows the user to select a value from the dropdown menu", async () => {

        const data = [{ label: "Label 1", value: "value1" }, { label: "Label 2", value: "value2" }, { label: "Label 3", value: "value3" }];
        const selected = "value2";
        const selectionProp = [selected, "setValue"];

        let expectedResult = selected;
        let tree;

        await act(async () => {
            tree = create(<Dropdown plots={data} selected={selectionProp} />);
        });

        const actualResult = tree.root.findByProps({ testID: "dropdown" }).props.value;
        expect(actualResult).toEqual(expectedResult);
    });

});