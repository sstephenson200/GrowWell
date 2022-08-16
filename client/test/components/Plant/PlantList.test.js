import React from "react";
import { act, create } from "react-test-renderer";
import axios from "axios";
import * as fs from "fs";

import PlantList from "../../../src/app/components/Plant/PlantList";

jest.mock("axios");

describe("<PlantList />", () => {

    let imageFile = fs.readFileSync(require("path").resolve(__dirname, "../../assets/images/mockImage1.jpg"));
    let fileString = imageFile.toString("base64");

    let plantResponse = {
        status: 200,
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
                    _id: "62b85dd0a1583e275d3e1e9e",
                    name: "Dill",
                    plant_type: "Herb",
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
                    _id: "62b85dd0a1583e275d3e1e9e",
                    name: "Aubergine",
                    plant_type: "Fruit",
                    sow_date: [5, 8],
                    plant_date: [3, 3],
                    transplant_date: [],
                    harvest_date: [4, 6],
                    image: [
                        "62b85dcfa1583e275d3e1e97",
                        "62b85dcfa1583e275d3e1e98",
                        "62b85dcfa1583e275d3e1e99"
                    ]
                },
            ]
        }
    }

    axios.get.mockResolvedValue(plantResponse);

    let imageResponse = {
        status: 200,
        data: fileString
    }

    axios.put.mockResolvedValue(imageResponse);

    it("renders a card component for each plant", async () => {
        let tree;
        await act(async () => {
            tree = create(<PlantList searchQuery={""} filterData={[]} />);
        });
        let actualResult = tree.root.findByProps({ testID: "cardAsparagus" }).props;
        expect(actualResult).toBeTruthy();
    });

    it("hides plant data which does not match the given search query", async () => {
        await act(async () => {
            tree = create(<PlantList searchQuery={"as"} filterData={[]} />);
        });
        let plant1 = tree.root.findByProps({ testID: "cardAsparagus" }).props;
        let plant2 = tree.root.findAll(n => n.props.testID === "cardDill" && n.type === "View").length;
        let plant3 = tree.root.findAll(n => n.props.testID === "cardAubergine" && n.type === "View").length;
        expect(plant1).toBeTruthy();
        expect(plant2).toEqual(0);
        expect(plant3).toEqual(0);
    });

    it("hides plant data which does not match the given filter data", async () => {
        await act(async () => {
            tree = create(<PlantList searchQuery={""} filterData={["Vegetable", "Herb"]} />);
        });
        let plant1 = tree.root.findByProps({ testID: "cardAsparagus" }).props;
        let plant2 = tree.root.findByProps({ testID: "cardDill" }).props;
        let plant3 = tree.root.findAll(n => n.props.testID === "cardAubergine" && n.type === "View").length;
        expect(plant1).toBeTruthy();
        expect(plant2).toBeTruthy();
        expect(plant3).toEqual(0);
    });

    it("lets user navigate to Plant screen by clicking on a plant card", async () => {

        const navigation = {
            navigate: jest.fn()
        }

        let tree;
        await act(async () => {
            tree = create(<PlantList navigation={navigation} searchQuery={""} filterData={[]} />);
        });

        const button = tree.root.findByProps({ testID: "cardAsparagus" }).props;
        button.onPress();

        expect(navigation.navigate).toBeCalledWith("StackNavigator", { screen: "Plant", params: { plant_id: plantResponse.data.plants[0]._id, name: plantResponse.data.plants[0].name, plant_type: plantResponse.data.plants[0].plant_type, photo: undefined } });
    });

});