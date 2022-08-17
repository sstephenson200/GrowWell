import axios from "axios";

import GetAllPlants from "../../../src/app/requests/Plant/GetAllPlants";

jest.mock("axios");

describe("Get All Plants Request", () => {

    const response = {
        response: 200,
        data: {
            plants: [
                {
                    _id: "62b85dd0a1583e275d3e1e9e",
                    name: "Asparagus",
                    plant_type: "Vegetable",
                    sow_date: [],
                    plant_date: [3, 3],
                    transplant_date: [],
                    harvest_date: [4, 6],
                    image: [
                        "62b85dcfa1583e275d3e1e97",
                        "62b85dcfa1583e275d3e1e98",
                        "62b85dcfa1583e275d3e1e99"
                    ]
                },
                {
                    _id: "62b84b34e92460c0a177c736",
                    name: "Aubergine",
                    plant_type: "Fruit",
                    sow_date: [1, 4],
                    plant_date: [5, 6],
                    transplant_date: [5, 6],
                    harvest_date: [8, 9],
                    image: [
                        "62b84b33e92460c0a177c72e",
                        "62b84b33e92460c0a177c72f",
                        "62b84b33e92460c0a177c730"
                    ]
                },
                {
                    _id: "62b86113469cb46a1feca60b",
                    name: "Basil",
                    plant_type: "Herb",
                    sow_date: [2, 7],
                    plant_date: [6, 8],
                    transplant_date: [],
                    harvest_date: [6, 9],
                    image: [
                        "62b86112469cb46a1feca603",
                        "62b86112469cb46a1feca604",
                        "62b86112469cb46a1feca605"
                    ]
                }
            ]
        }
    }

    axios.get.mockResolvedValue(response);

    it("returns all plant data", async () => {

        let expectedResult = response.data.plants;
        expect(await GetAllPlants()).toEqual(expectedResult);
    });


});