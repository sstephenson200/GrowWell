import React from "react";
import { create } from "react-test-renderer";

import Infographic from "../../../src/app/components/Plant/MonthlyPlantData";

jest.mock("@expo/vector-icons");

describe("<InfographicLabels />", () => {

    it("renders month labels as an array", () => {
        let expectedLength = 12;
        let expectedLabel = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

        let tree = create(<Infographic.InfographicLabels plantPage={true} />);

        let actualLength = tree.root.findByProps({ testID: "largeLabels" }).props.children.length;
        let firstLabel = tree.root.findByProps({ testID: "label0" }).props.children;
        let lastLabel = tree.root.findByProps({ testID: "label11" }).props.children;

        expect(actualLength).toEqual(expectedLength);
        expect(firstLabel).toEqual(expectedLabel[0]);
        expect(lastLabel).toEqual(expectedLabel[11]);
    });

});

describe("<GeneralInfographic />", () => {

    it("renders filled and empty circles to display active growing months", () => {

        let tree = create(<Infographic.GeneralInfographic schedule={[5, 8]} plantPage={true} />);

        let infographic = tree.root.findByProps({ testID: "infographic" }).props.children;
        let month4 = tree.root.findByProps({ testID: "infographic" }).props.children[3].props.color;
        let month5 = tree.root.findByProps({ testID: "infographic" }).props.children[4].props.color;
        let month8 = tree.root.findByProps({ testID: "infographic" }).props.children[7].props.color;
        let month9 = tree.root.findByProps({ testID: "infographic" }).props.children[8].props.color;

        expect(month4).toBeUndefined;
        expect(month5).toEqual("filled");
        expect(month8).toEqual("filled");
        expect(month9).toBeUndefined;
    });

});