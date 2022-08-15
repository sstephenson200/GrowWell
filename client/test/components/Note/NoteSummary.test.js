import React from "react";
import { create } from "react-test-renderer";

import NoteSummary from "../../../src/app/components/Note/NoteSummary";

describe("<NoteSummary />", () => {

    let notes = [
        {
            plant_id: null,
            _id: "62d55285dcedb2dca26c61e9",
            user_id: "62cec6b63dd3dfcf2a4a6185",
            title: "Test note 1",
            description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium.",
            date: "2022-07-18T12:31:01.250Z",
            image: [],
            garden_id: "62cece2c3dd3dfcf2a4a61bb",
            plot_number: 2,
            __v: 0
        },
        {
            plant_id: null,
            _id: "62d55285dcedb2dca26c61e9",
            user_id: "62cec6b63dd3dfcf2a4a6185",
            title: "Test note 2",
            description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium.",
            date: "2022-07-21T12:31:01.250Z",
            image: [],
            garden_id: "62cece2c3dd3dfcf2a4a61bb",
            plot_number: 2,
            __v: 0
        }
    ];

    it("renders a short message when no notes are available for the given date", () => {

        let expectedResult = "You have no entries for this date";
        let tree = create(<NoteSummary notes={notes} date={"2020-03-27"} />);
        let actualResult = tree.root.findByProps({ testID: "noNotesMessage" }).props.children;
        expect(actualResult).toEqual(expectedResult);
    });

    it("renders note titles when notes are available for the given date", () => {

        let expectedResult = notes[0].title;
        let tree = create(<NoteSummary notes={notes} date={"2022-07-18"} />);
        let actualResult = tree.root.findByProps({ testID: "noteTitle0" }).props.children;
        expect(actualResult).toEqual(expectedResult);
    });

    it("lets user navigate to Note screen", () => {
        const navigation = {
            navigate: jest.fn()
        }
        const tree = create(<NoteSummary navigation={navigation} notes={notes} date={"2022-07-18"} />);
        const button = tree.root.findByProps({ testID: "noteLink" }).props;
        button.onPress();
        expect(navigation.navigate).toBeCalledWith("StackNavigator", { screen: "Note", params: { date: "18 Jul 2022", notes: [notes[0]] } });
    });

});