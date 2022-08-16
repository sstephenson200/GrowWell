import React from "react";
import { act, create } from "react-test-renderer";
import { NavigationContainer } from "@react-navigation/native";

import Tabs from "../../src/app/navigation/Tabs";
import AuthContext from "../../src/app/context/AuthContext";

describe("<Tabs />", () => {

    it("has default screen as Stack Navigator when logged out", async () => {

        let expectedInitialRoute = "StackNavigator";

        let tree;
        await act(async () => {
            tree = create(
                <AuthContext.Provider value={{ loggedIn: false }}>
                    <NavigationContainer>
                        <Tabs />
                    </NavigationContainer>
                </AuthContext.Provider>
            );
        });

        let actualResult = tree.root.findByProps({ testID: "tabBar" }).props.initialRouteName;
        expect(actualResult).toEqual(expectedInitialRoute);
    });

    it("has default screen as Garden when logged in", async () => {

        let expectedInitialRoute = "Garden";

        let tree;
        await act(async () => {
            tree = create(
                <AuthContext.Provider value={{ loggedIn: true }}>
                    <NavigationContainer>
                        <Tabs />
                    </NavigationContainer>
                </AuthContext.Provider>
            );
        });

        let actualResult = tree.root.findByProps({ testID: "tabBar" }).props.initialRouteName;
        expect(actualResult).toEqual(expectedInitialRoute);
    });

});