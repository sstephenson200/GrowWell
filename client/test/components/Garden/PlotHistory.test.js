import React from "react";
import { act, create } from "react-test-renderer";
import axios from "axios";

import PlotHistory from "../../../src/app/components/Garden/PlotHistory";

jest.mock("axios");

describe("<PlotHistory />", () => {

    const plotHistory = {
        date_planted: "2020-05-02",
        plant_id: "Plant_ID"
    }

    const response = {
        status: 200,
        data: {
            plant: {
                name: "Parsnip"
            }
        }
    }

    axios.post.mockResolvedValue(response);

    it("has 2 children", () => {
        const tree = create(<PlotHistory plot_history={plotHistory} />).toJSON();
        expect(tree.children.length).toBe(2);
    });

    it("renders a plant icon image", async () => {
        let expectedChildren = 2;
        let expectedType = "Image";

        let tree;
        await act(async () => {
            tree = create(<PlotHistory plot_history={plotHistory} />);
        });

        let actualChildren = tree.toJSON().children[0].children.length;
        let actualType = tree.toJSON().children[0].children[0].type;

        expect(actualChildren).toEqual(expectedChildren);
        expect(actualType).toEqual(expectedType);
    });

    it("renders the plant name", async () => {
        let expectedChildren = 2;
        let expectedType = "Text";
        let expectedPlantName = response.data.plant.name;

        let tree;
        await act(async () => {
            tree = create(<PlotHistory plot_history={plotHistory} />);
        });

        let actualChildren = tree.toJSON().children[0].children.length;
        let actualType = tree.toJSON().children[0].children[1].type;
        let actualPlantName = tree.toJSON().children[0].children[1].children[0];

        expect(actualChildren).toEqual(expectedChildren);
        expect(actualType).toEqual(expectedType);
        expect(actualPlantName).toEqual(expectedPlantName);
    });

    it("renders the date in MMM YYYY format", async () => {
        let expectedResult = "May 2020";
        let tree;
        await act(async () => {
            tree = create(<PlotHistory plot_history={plotHistory} />);
        })
        let actualResult = tree.toJSON().children[1].children[0];
        expect(actualResult).toEqual(expectedResult);
    });

});