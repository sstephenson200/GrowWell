import React from "react";
import { act, create } from "react-test-renderer";
import axios from "axios";

import GardenScreen from "../../../src/app/screens/Garden/GardenScreen";

jest.mock("axios");

describe("<GardenScreen />", () => {

    const response = {
        status: 200,
        data: {
            gardens: [
                {
                    _id: "62cece2c3dd3dfcf2a4a61bb",
                    user_id: "62cec6b63dd3dfcf2a4a6185",
                    size: [2, 2],
                    name: "Front Garden",
                    plot: [
                        {
                            plot_number: 0,
                            plant_id: "62b84c313eeb64eba7ae592c",
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
                            plant_id: "62b84b34e92460c0a177c736",
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
                        }
                    ],
                    __v: 0
                },
                {
                    _id: "62ed38ed945ee83abadd26c2",
                    user_id: "62cec6b63dd3dfcf2a4a6185",
                    size: [1, 2],
                    name: "Test",
                    plot: [
                        {
                            plot_number: 0,
                            plant_id: "62b8542bf98380cd4d9b6904",
                            date_planted: "2022-08-10T20:35:18.423Z",
                            plot_history: [],
                            _id: "62ed38ed945ee83abadd26c3"
                        },
                        {
                            plot_number: 1,
                            plant_id: "62b86a908d37b5f5a71b0639",
                            date_planted: "2022-08-08T15:14:00.546Z",
                            plot_history: [],
                            _id: "62ed38ed945ee83abadd26c4"
                        }
                    ],
                    __v: 0
                }
            ]
        }
    }

    axios.post.mockResolvedValue(response);

    it("does not render Garden Grid when garden is not selected", async () => {

        let expectedGardenGrid = 0;
        let expectedMessage = "Garden not selected";

        let tree;
        await act(async () => {
            tree = create(<GardenScreen />);
        });

        let actualGardenGrid = tree.root.findAll(n => n.props.testID === "gardenGrid" && n.type === "View").length;
        let actualMessage = tree.root.findByProps({ testID: "unselectedMessage" }).props.children;

        expect(actualGardenGrid).toEqual(expectedGardenGrid);
        expect(actualMessage).toEqual(expectedMessage);
    });

});