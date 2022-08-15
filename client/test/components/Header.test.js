import React from "react";
import { create } from "react-test-renderer";

import Header from "../../src/app/components/Header";

jest.mock("@expo/vector-icons");

describe("<Header />", () => {

    it("has 2 children", () => {
        const tree = create(<Header />).toJSON();
        expect(tree.children.length).toBe(2);
    });

    it("lets user navigate to Settings screen", () => {
        const navigation = {
            navigate: jest.fn()
        }
        const tree = create(<Header navigation={navigation} />);
        const button = tree.root.findByProps({ testID: "settingsLink" }).props;
        button.onPress();
        expect(navigation.navigate).toBeCalledWith("StackNavigator", { screen: "Settings" });
    });

});