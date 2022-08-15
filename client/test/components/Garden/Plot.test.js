import React from "react";
import { act, create } from "react-test-renderer";
import axios from "axios";

import Plot from "../../../src/app/components/Garden/Plot";

jest.mock("axios");

describe("<Plot />", () => {

    const plot = {
        plot_number: 0,
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

    it("has 1 child", () => {
        const tree = create(<Plot plot={plot} />).toJSON();
        expect(tree.children.length).toBe(1);
    });

    it("shows a readable plot number label", async () => {
        let expectedResult = plot.plot_number + 1;
        let tree;
        await act(async () => {
            tree = create(<Plot plot={plot} />);
        });
        let actualResult = tree.root.findByProps({ testID: "plotLabel" }).props.children;
        expect(actualResult).toEqual(expectedResult);
    });

    it("renders a plant icon image for filled plots", async () => {

        let tree;
        await act(async () => {
            tree = create(<Plot plot={plot} />);
        });

        let actualResult = tree.root.findByProps({ testID: "plantIcon" }).props;
        expect(actualResult).toBeTruthy();
    });

    it("does not render a plant icon image for empty plots", async () => {

        const plot = {
            plot_number: 0,
            plant_id: null
        }

        let expectedResult = 0;
        let tree;
        await act(async () => {
            tree = create(<Plot plot={plot} />);
        });

        let actualResult = tree.root.findAll(n => n.props.testID === "plantIcon" && n.type === "Image").length;

        expect(actualResult).toEqual(expectedResult);
    });

});