import React from "react";
import { act, create } from "react-test-renderer";
import axios from "axios";

import AlarmCard from "../../../src/app/components/Alarm/AlarmCard";

jest.mock("axios");
jest.mock("@expo/vector-icons");

describe("<AlarmCard />", () => {

    it("lets user turn the alarm on or off by pressing the card switch", async () => {

        let alarm = { active_status: false }

        let expectedResult = true;
        let tree = create(<AlarmCard alarm={alarm} />);

        let alarmSwitch = tree.root.findByProps({ testID: "alarmSwitch" }).props;
        alarmSwitch.value = alarm.active_status;

        act(() => {
            alarmSwitch.onValueChange();
        });

        let actualResult = tree.root.findByProps({ testID: "alarmSwitch" }).props.value;

        expect(actualResult).toEqual(expectedResult);
    });

    it("lets user mark the alarm as complete/incomplete", async () => {

        let alarm = { completion_status: true }

        const response = {
            status: 200
        };

        axios.put.mockResolvedValue(response);

        let expectedResult = "Done ";
        let tree = create(<AlarmCard alarm={alarm} />);

        let alarmSetComplete = tree.root.findByProps({ testID: "alarmSetComplete" }).props;

        await act(async () => {
            alarmSetComplete.onPress();
        });

        let actualResult = tree.root.findByProps({ testID: "alarmSetComplete" }).props.children.props.children[0];

        expect(actualResult).toEqual(expectedResult);
    });

    it("opens the deletion modal when the user presses the delete icon for recurring alarms", async () => {

        jest.mock("react-native-paper", () => {
            const ReactNative = require("react-native");
            const realModule = jest.requireActual("react-native-paper");
            const mockedModule = {
                ...realModule,
                RadioButton: ({ children }) => <ReactNative.View>{children}</ReactNative.View>
            }
            return mockedModule;
        });

        let alarm = { isParent: true }

        let expectedResult = true;
        let tree = create(<AlarmCard alarm={alarm} />);

        let deleteButton = tree.root.findByProps({ testID: "deleteRecurringAlarms" }).props;

        act(() => {
            deleteButton.onPress();
        });

        let actualResult = tree.toJSON().children[0].props.visible;

        expect(actualResult).toEqual(expectedResult);
    });

});