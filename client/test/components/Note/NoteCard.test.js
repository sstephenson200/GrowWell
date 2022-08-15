import React from "react";
import { act, create } from "react-test-renderer";
import axios from "axios";
import * as fs from "fs";

import NoteCard from "../../../src/app/components/Note/NoteCard";

jest.mock("axios");

describe("<NoteCard />", () => {

    let imageFile = fs.readFileSync(require("path").resolve(__dirname, "../../assets/images/mockImage1.jpg"));
    let fileString = imageFile.toString("base64");

    let minimalNote = {
        date: "2020-05-02",
        title: "Test title",
        garden_id: null,
        description: null,
        plant_id: null,
        image: []
    }

    let fullNote = {
        date: "2020-05-02",
        title: "Test title",
        description: "Test description",
        garden_id: "Test garden ID",
        plot_number: 0,
        plant_id: "Test plant ID",
        image: []
    }

    let photoNote = {
        date: "2020-05-02",
        title: "Test title",
        garden_id: null,
        description: null,
        plant_id: null,
        image: ["imageID"]
    }

    axios.post.mockImplementation((url) => {
        switch (url) {
            case '/garden/getGardenByID':
                return response = {
                    status: 200,
                    data: {
                        garden: {
                            name: "Garden Name"
                        }
                    }
                }
            case '/plant/getPlantByID':
                return response = {
                    status: 200,
                    data: {
                        plant: {
                            name: "Parsnip"
                        }
                    }
                }
            case 'plant/getImageByID':
                return blob = {
                    status: 200,
                    data: fileString
                }
            default:
                return Promise.reject(new Error('not found'))
        }
    })

    it("has 2 children", async () => {

        let minimalTree;
        let fullTree;

        await act(async () => {
            minimalTree = create(<NoteCard note={minimalNote} />);
            fullTree = create(<NoteCard note={fullNote} />);
        });

        let minimalChildren = minimalTree.toJSON().children.length;
        let fullChildren = fullTree.toJSON().children.length;

        expect(minimalChildren).toEqual(1);
        expect(fullChildren).toEqual(1);
    });

    it("renders garden name and plot number when garden_id is defined", async () => {

        let expectedResult = "Garden Name, Plot 1";

        let tree;

        await act(async () => {
            tree = create(<NoteCard note={fullNote} />);
        });

        let children = tree.root.findByProps({ testID: "gardenLabel" }).props.children;
        let actualResult = children.join("");

        expect(actualResult).toEqual(expectedResult);
    });

    it("does not render garden name and plot number when garden_id is undefined", async () => {

        let expectedResult = 0;

        let tree;
        await act(async () => {
            tree = create(<NoteCard note={minimalNote} />);
        });

        let actualResult = tree.root.findAll(n => n.props.testID === "gardenLabel" && n.type === "Text").length;

        expect(actualResult).toEqual(expectedResult);
    });

    it("renders plant name and icon when plant_id is defined", async () => {

        let expectedPlantName = "Parsnip";

        let tree;
        await act(async () => {
            tree = create(<NoteCard note={fullNote} />);
        });

        let actualPlantName = tree.root.findByProps({ testID: "plantName" }).props.children[0];
        let plantIcon = tree.root.findByProps({ testID: "plantIcon" }).props;

        expect(actualPlantName).toEqual(expectedPlantName);
        expect(plantIcon).toBeTruthy();
    });

    it("does not render plant name and icon when plant_id is undefined", async () => {

        let expectedResult = 0;

        let tree;
        await act(async () => {
            tree = create(<NoteCard note={minimalNote} />);
        });

        let actualResult = tree.root.findAll(n => n.props.testID === "plantLabel" && n.type === "View").length;

        expect(actualResult).toEqual(expectedResult);
    });

    it("renders description when description is defined", async () => {

        let expectedResult = "Test description";

        let tree;

        await act(async () => {
            tree = create(<NoteCard note={fullNote} />);
        });

        let actualResult = tree.root.findByProps({ testID: "description" }).props.children;

        expect(actualResult).toEqual(expectedResult);
    });

    it("does not render description when description is undefined", async () => {

        let expectedResult = 0;

        let tree;
        await act(async () => {
            tree = create(<NoteCard note={minimalNote} />);
        });

        let actualResult = tree.root.findAll(n => n.props.testID === "description" && n.type === "Text").length;

        expect(actualResult).toEqual(expectedResult);
    });

});