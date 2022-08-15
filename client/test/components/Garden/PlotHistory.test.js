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

        let tree;
        await act(async () => {
            tree = create(<PlotHistory plot_history={plotHistory} />);
        });

        let actualResult = tree.root.findByProps({ testID: "plantIcon" }).props;
        expect(actualResult).toBeTruthy();
    });

    it("renders the plant name", async () => {

        let expectedResult = response.data.plant.name;

        let tree;
        await act(async () => {
            tree = create(<PlotHistory plot_history={plotHistory} />);
        });

        let actualResult = tree.root.findByProps({ testID: "plantName" }).props.children;
        expect(actualResult).toEqual(expectedResult);
    });

    it("renders the date in MMM YYYY format", async () => {
        let expectedResult = "May 2020";
        let tree;
        await act(async () => {
            tree = create(<PlotHistory plot_history={plotHistory} />);
        })
        let actualResult = tree.root.findByProps({ testID: "date" }).props.children;
        expect(actualResult).toEqual(expectedResult);
    });

});