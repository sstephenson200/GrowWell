import React from "react";
import { act, create } from "react-test-renderer";
import axios from "axios";

import CreateAlarmScreen from "../../../src/app/screens/Alarm/CreateAlarmScreen";

jest.mock("axios");

describe("<CreateAlarmScreen />", () => {

    axios.post.mockImplementation((url) => {
        switch (url) {
            case "/garden/getAllGardens":
                return response = {
                    status: 200,
                    data: {
                        gardens: [
                            {
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
                                        date_planted: "2022-08-06T20:27:43.844Z",
                                        plot_history: [],
                                        _id: "62cece2c3dd3dfcf2a4a61bd"
                                    }
                                ],
                                __v: 0
                            },
                            {
                                _id: "62cece2c3dd3dfcf2a4a61bc",
                                user_id: "62cec6b63dd3dfcf2a4a6186",
                                size: [1, 1],
                                name: "Back Garden",
                                plot: [
                                    {
                                        plot_number: 0,
                                        plant_id: "62b84c313eeb64eba7ae592c",
                                        date_planted: "2022-08-06T20:27:43.844Z",
                                        plot_history: [],
                                        _id: "62cece2c3dd3dfcf2a4a61bc"
                                    }
                                ],
                                __v: 0
                            }
                        ]
                    }
                }
            case "/alarm/createAlarm":
                return response = {
                    status: 200,
                    data: {
                        errorMessage: "Error message"
                    }
                }
            default:
                return Promise.reject(new Error('not found'));
        }
    });

    it("prefills text inputs based on alarm data provided from Plant Screen", async () => {

        let expectedTitle = "Test title";
        let expectedSchedule = 20;
        let expectedDuration = 10;

        let tree;
        await act(async () => {
            tree = create(<CreateAlarmScreen route={
                {
                    params:
                    {
                        alarmTitle: expectedTitle,
                        alarmSchedule: expectedSchedule,
                        alarmDuration: expectedDuration
                    }
                }} />);
        });

        let actualTitle = tree.root.findByProps({ testID: "titleInput" }).props.value;
        let actualSchedule = tree.root.findByProps({ testID: "scheduleInput" }).props.value;
        let actualDuration = tree.root.findByProps({ testID: "repeatInput" }).props.value;

        expect(actualTitle).toEqual(expectedTitle);
        expect(Number(actualSchedule)).toEqual(expectedSchedule);
        expect(Number(actualDuration)).toEqual(expectedDuration);
    });

    it("renders additional text input boxes when the checkbox is pressed", async () => {

        let tree;
        await act(async () => {
            tree = create(<CreateAlarmScreen route={{ params: undefined }} />);
        });

        let checkbox = tree.root.findByProps({ testID: "checkbox" }).props;
        act(() => {
            checkbox.onPress();
        })

        let schedule = tree.root.findByProps({ testID: "scheduleInput" }).props;
        let repeats = tree.root.findByProps({ testID: "repeatInput" }).props;

        expect(schedule).toBeTruthy();
        expect(repeats).toBeTruthy();
    });

    it("can render an error message in red if the create alarm request is unsuccessful", async () => {

        let expectedResult = "Error message";

        let tree;
        await act(async () => {
            tree = create(<CreateAlarmScreen route={{ params: undefined }} />);
        });

        const button = tree.root.findByProps({ testID: "saveButton" }).props;
        await act(async () => {
            button.onPress();
        });

        let actualResult = tree.root.findByProps({ testID: "errorMessage" }).props.children;

        expect(actualResult).toEqual(expectedResult);
    });

    it("lets user navigate to Alarm screen by pressing the cancel button", () => {
        const navigation = {
            navigate: jest.fn()
        }
        const tree = create(<CreateAlarmScreen navigation={navigation} route={{ params: undefined }} />);
        const button = tree.root.findByProps({ testID: "cancelButton" }).props;
        button.onPress();
        expect(navigation.navigate).toBeCalledWith("Alarms");
    });

    it("lets user navigate to Alarm screen when an alarm is successfully created", async () => {

        axios.post.mockImplementation((url) => {
            switch (url) {
                case "/garden/getAllGardens":
                    return response = {
                        status: 200,
                        data: {
                            gardens: [
                                {
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
                                            date_planted: "2022-08-06T20:27:43.844Z",
                                            plot_history: [],
                                            _id: "62cece2c3dd3dfcf2a4a61bd"
                                        }
                                    ],
                                    __v: 0
                                },
                                {
                                    _id: "62cece2c3dd3dfcf2a4a61bc",
                                    user_id: "62cec6b63dd3dfcf2a4a6186",
                                    size: [1, 1],
                                    name: "Back Garden",
                                    plot: [
                                        {
                                            plot_number: 0,
                                            plant_id: "62b84c313eeb64eba7ae592c",
                                            date_planted: "2022-08-06T20:27:43.844Z",
                                            plot_history: [],
                                            _id: "62cece2c3dd3dfcf2a4a61bc"
                                        }
                                    ],
                                    __v: 0
                                }
                            ]
                        }
                    }
                case "/alarm/createAlarm":
                    return response = {
                        status: 200,
                        data: {
                            alarm: {
                                _id: "alarm ID"
                            }
                        }
                    }
                default:
                    return Promise.reject(new Error('not found'));
            }
        });

        const navigation = {
            navigate: jest.fn()
        }

        const tree = create(<CreateAlarmScreen navigation={navigation} route={{
            params: {
                alarmTitle: "Test title"
            }
        }} />);

        const button = tree.root.findByProps({ testID: "saveButton" }).props;
        await act(async () => {
            button.onPress();
        });
        expect(navigation.navigate).toBeCalledWith("Alarms", { params: { updated: true } });
    });

});