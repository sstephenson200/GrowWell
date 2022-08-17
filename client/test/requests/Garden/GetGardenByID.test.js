import axios from "axios";

import GetGardenByID from "../../../src/app/requests/Garden/GetGardenByID";

jest.mock("axios");

describe("Get Garden By ID Request", () => {

    const response = {
        status: 200,
        data: {
            garden: {
                _id: "62cece2c3dd3dfcf2a4a61bb",
                user_id: "62cec6b63dd3dfcf2a4a6185",
                size: [2, 1],
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
                    }
                ],
                __v: 0
            }
        }
    }

    axios.post.mockResolvedValue(response);

    it("returns garden name when requiredData equals name", async () => {

        let garden_id = "garden ID";
        let requiredData = "name";
        let expectedResult = response.data.garden.name;
        expect(await GetGardenByID(garden_id, requiredData)).toEqual(expectedResult);
    });

    it("returns all garden data when requiredData equals all", async () => {

        let garden_id = "garden ID";
        let requiredData = "all";
        let expectedResult = response.data.garden;
        expect(await GetGardenByID(garden_id, requiredData)).toEqual(expectedResult);
    });

});