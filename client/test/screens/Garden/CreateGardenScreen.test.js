import React from "react";
import { act, create } from "react-test-renderer";
import axios from "axios";

import CreateGardenScreen from "../../../src/app/screens/Garden/CreateGardenScreen";

jest.mock("axios");

describe("<CreateGardenScreen />", () => {

    it("can render an error message if the create garden request is unsuccessful", async () => {

        let expectedResult = "Error message";

        const response = {
            status: 200,
            data: {
                errorMessage: expectedResult
            }
        }

        axios.post.mockResolvedValue(response);

        let tree = create(<CreateGardenScreen />);
        const button = tree.root.findByProps({ testID: "saveButton" }).props;
        await act(async () => {
            button.onPress();
        });

        let actualResult = tree.root.findByProps({ testID: "errorMessage" }).props.children;

        expect(actualResult).toEqual(expectedResult);
    });

    it("lets user navigate to Garden Screen by pressing the cancel button", () => {
        const navigation = {
            navigate: jest.fn()
        }
        const tree = create(<CreateGardenScreen navigation={navigation} />);
        const button = tree.root.findByProps({ testID: "cancelButton" }).props;
        button.onPress();
        expect(navigation.navigate).toBeCalledWith("Garden");
    });

    it("lets user navigate to Alarm screen when an alarm is successfully created", async () => {

        const response = {
            status: 200,
            data: {}
        }

        axios.post.mockResolvedValue(response);

        const navigation = {
            navigate: jest.fn()
        }

        const tree = create(<CreateGardenScreen navigation={navigation} />);
        const button = tree.root.findByProps({ testID: "saveButton" }).props;
        await act(async () => {
            button.onPress();
        });
        expect(navigation.navigate).toBeCalledWith("Garden", { created: true });
    });

});