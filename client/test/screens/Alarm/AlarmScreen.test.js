import React from "react";
import { act, create } from "react-test-renderer";
import axios from "axios";

import AlarmScreen from "../../../src/app/screens/Alarm/AlarmScreen";

jest.mock("axios");

describe("<AlarmScreen />", () => {

    const response = {
        status: 200,
        data: {
            alarms: [
                {
                    _id: "62f3e35a6baa9c96a024f209",
                    user_id: "62cec6b63dd3dfcf2a4a6185",
                    title: "Test alarm 1",
                    due_date: "2022-08-11T16:56:48.000Z",
                    garden_id: null,
                    plot_number: null,
                    isParent: false,
                    parent: null,
                    completion_status: false,
                    active_status: true,
                    notification_id: "d11269d6-928f-4cf8-b686-a3abdb2c242b",
                    __v: 0
                },
                {
                    _id: "62f3e35a6baa9c96a024f210",
                    user_id: "62cec6b63dd3dfcf2a4a6185",
                    title: "Test alarm 2",
                    due_date: "2022-08-11T16:56:48.000Z",
                    garden_id: null,
                    plot_number: null,
                    isParent: true,
                    parent: null,
                    completion_status: false,
                    active_status: true,
                    notification_id: "d11269d6-928f-4cf8-b686-a3abdb2c242b",
                    __v: 0
                }
            ]
        }
    }

    axios.post.mockResolvedValue(response);

    it("renders dates which don't have alarms as empty", async () => {

        let expectedResult = [];

        let tree;
        await act(async () => {
            tree = create(<AlarmScreen route={{ params: undefined }} />);
        });

        let actualResponse = tree.root.findByProps({ testID: "agenda" }).props.items["2022-07-01"];

        expect(actualResponse).toEqual(expectedResult);
    });

    it("lets user navigate to Create Alarm screen", async () => {
        const navigation = {
            navigate: jest.fn()
        }

        let tree;
        await act(async () => {
            tree = create(<AlarmScreen navigation={navigation} route={{ params: undefined }} />);
        });

        const button = tree.root.findByProps({ testID: "newAlarmLink" }).props;
        button.onPress();
        expect(navigation.navigate).toBeCalledWith("StackNavigator", { screen: "CreateAlarm" });
    });

});