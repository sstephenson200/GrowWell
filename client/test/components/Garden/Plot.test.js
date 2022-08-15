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
        let actualResult = Number(tree.toJSON().children[0].children[0]);
        expect(actualResult).toEqual(expectedResult);
    });

    it("renders a plant icon image for filled plots", async () => {
        let expectedChildren = 2;
        let expectedType = "Image";

        let tree;
        await act(async () => {
            tree = create(<Plot plot={plot} />);
        });

        let actualChildren = tree.toJSON().children.length;
        let actualType = tree.toJSON().children[1].type;

        expect(actualChildren).toEqual(expectedChildren);
        expect(actualType).toEqual(expectedType);
    });

    it("does not render a plant icon image for empty plots", async () => {

        const plot = {
            plot_number: 0,
            plant_id: null
        }

        let expectedChildren = 1;
        let tree;
        await act(async () => {
            tree = create(<Plot plot={plot} />);
        });

        let actualChildren = tree.toJSON().children.length;
        expect(actualChildren).toEqual(expectedChildren);
    });

});