import React from "react";
import { create, act } from "react-test-renderer";
import axios from "axios";

import GardenGrid from "../../../src/app/components/Garden/GardenGrid";

jest.mock("axios");

describe("<GardenGrid />", () => {

    let garden_id = "gardenID";

    const response = {
        status: 200,
        data: {
            garden: {
                _id: "62cece2c3dd3dfcf2a4a61bb",
                user_id: "62cec6b63dd3dfcf2a4a6185",
                size: [
                    2,
                    3
                ],
                name: "Ellie&#x27;s Garden",
                plot: [
                    {
                        plot_number: 0,
                        plant_id: null,
                        date_planted: "2022-08-06T20:27:43.844Z",
                        plot_history: [],
                        _id: "62cece2c3dd3dfcf2a4a61bc"
                    },
                    {
                        plot_number: 1,
                        plant_id: null,
                        date_planted: "2022-07-17T10:10:28.953Z",
                        plot_history: [],
                        _id: "62cece2c3dd3dfcf2a4a61bd"
                    },
                    {
                        plot_number: 2,
                        plant_id: null,
                        date_planted: "2022-07-14T13:43:21.737Z",
                        plot_history: [],
                        _id: "62cece2c3dd3dfcf2a4a61be"
                    },
                    {
                        plot_number: 3,
                        plant_id: null,
                        date_planted: null,
                        plot_history: [],
                        _id: "62cece2c3dd3dfcf2a4a61bf"
                    },
                    {
                        plot_number: 4,
                        plant_id: null,
                        date_planted: "2022-08-05T14:43:05.384Z",
                        plot_history: [],
                        _id: "62cece2c3dd3dfcf2a4a61c0"
                    },
                    {
                        plot_number: 5,
                        plant_id: null,
                        date_planted: "2022-08-05T15:26:59.129Z",
                        plot_history: [],
                        _id: "62cece2c3dd3dfcf2a4a61c1"
                    }
                ]
            }
        }
    };

    axios.post.mockResolvedValue(response);

    it("has a number of plots equal to total garden area", async () => {

        let expectedResult = response.data.garden.size[0] * response.data.garden.size[1];
        let tree;

        await act(async () => {
            tree = create(<GardenGrid garden_id={garden_id} />);
        });

        let actualResult = tree.root.findAll(n => n.props.testID === "plot" && n.type === "View").length;

        expect(actualResult).toEqual(expectedResult);
    });

    it("lets user navigate to Plot screen by clicking on a grid plot", async () => {

        const navigation = {
            navigate: jest.fn()
        }

        let tree;
        await act(async () => {
            tree = create(<GardenGrid navigation={navigation} garden_id={garden_id} />);
        });

        const button = tree.root.findByProps({ testID: "plotLink0" }).props;
        button.onPress();

        expect(navigation.navigate).toBeCalledWith("StackNavigator", { screen: "Plot", params: { plot: response.data.garden.plot[0], garden: response.data.garden } });
    });

});