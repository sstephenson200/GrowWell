import axios from "axios";

import GetPlantByID from "../../../src/app/requests/Plant/GetPlantByID";

jest.mock("axios");

describe("Get Garden By ID Request", () => {

    const response = {
        status: 200,
        data: {
            plant: {
                _id: "62b848e4daace2b4f927b796",
                name: "Parsnip",
                description: "Parsnips are biennials but are usually grown as an annual vegetable. Parsnips are a hardy, cool-season crop that is best harvested after a hard frost. They produce long, tapering, white roots with an excellent flavour.",
                plant_type: "Vegetable"
            }
        }
    }

    axios.post.mockResolvedValue(response);

    it("returns plant name when requiredData equals name", async () => {

        let plant_id = "plant ID";
        let requiredData = "name";
        let expectedResult = response.data.plant.name;
        expect(await GetPlantByID(plant_id, requiredData)).toEqual(expectedResult);
    });

    it("returns all plant data when requiredData equals all", async () => {

        let plant_id = "plant ID";
        let requiredData = "all";
        let expectedResult = response.data.plant;
        expect(await GetPlantByID(plant_id, requiredData)).toEqual(expectedResult);
    });

});